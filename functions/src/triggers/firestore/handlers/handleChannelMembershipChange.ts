import { logger } from "firebase-functions/v2";
import { slack } from "../../../clients/slack";
import { InstantMessageChannelMembership } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { createBatchDatum, writeBatch } from "../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../clients/firebase/firestore/collection";

async function saveMessagesRecursively(channelMembership: InstantMessageChannelMembership, cursor?: string) {
  const { source, organisationId, channelId } = channelMembership;
  const slackClient = await slack(organisationId);

  const { messages: firstMessages, response_metadata: responseMetadata } = await slackClient.conversations.history({
    channel: channelId,
    limit: 200,
    cursor,
  });

  if (!firstMessages || !responseMetadata) return;

  let messagesToSave: any[] = [];

  // use a for loop to avoid rate limit issues here
  for (const message of firstMessages.map((m) => ({ ...m, channel: channelId }))) {
    const shouldSaveMessage = !(message.subtype?.includes("channel_") || message.user === "USLACKBOT");

    if (shouldSaveMessage) messagesToSave.push(message);

    if (message.reply_count === 0 || !message.ts) continue;

    const { messages: replyMessages } = await slackClient.conversations.replies({
      channel: channelId,
      ts: message.ts,
      limit: 200,
    });

    if (!replyMessages) continue;

    const replyMessagesWithoutOriginal = replyMessages
      .map((m) => ({ ...m, channel: channelId }))
      .filter((replyMessage) => replyMessage.ts !== message.ts);

    messagesToSave = [...messagesToSave, ...replyMessagesWithoutOriginal];
  }

  const { next_cursor: nextCursor } = responseMetadata!;

  const addMessagesToDb = writeBatch(
    messagesToSave!.map((message) => createBatchDatum(
      Collection.InstantMessage.doc(),
      {
        text: message.text,
        createdAt: new Date(),
        channelId,
        source,
        organisationId,
        sentAt: new Date(),
      }
    ))
  );

  const promises: Promise<void>[] = [addMessagesToDb];

  if (nextCursor) {
    promises.push(saveMessagesRecursively(channelMembership, nextCursor));
  }

  await Promise.all(promises);
}

export const handleInstantMessageChannelMembershipChange = wrapChangeHandler<InstantMessageChannelMembership>({
  async onCreate(channelMembership) {
    const { organisationId, channelId, isBotUser } = channelMembership;

    logger.info("new channel membership created", {
      organisationId,
      channelId,
      isBotUser,
    });

    if (!isBotUser) return;

    await saveMessagesRecursively(channelMembership);

    logger.info("recursively saved messages from channel", {
      channelId,
      organisationId,
    });
  },
});
