import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { logger } from "firebase-functions/v2";
import { Collection } from "../../../../clients/firebase/firestore/collection";
import { organisationIdFromTeam } from "../utils/organisationIdFromTeamId";
import { InstantMessageSource } from "@sycamore-fyi/shared";

export const handleMessage = async ({ message, body }: SlackEventMiddlewareArgs<"message">) => {
  const {
    channel,
    channel_type: channelType,
    ts,
  } = message;

  const { team_id: team } = body;

  const { user } = message as any;
  const threadTs: string | undefined = (message as any).thread_ts;

  logger.info("message received", {
    channel,
    channelType,
    ts,
    team,
    user,
    threadTs,
    text: (message as any).text?.slice(0, 200),
  });

  const isChannelNotification = !!message.subtype?.includes("channel");
  const wasMessageWrittenByAHuman = !isChannelNotification && !!user && user !== "USLACKBOT";
  const doesMessageContainText = "text" in message && message.text!.length > 0;
  const shouldMessageBeSaved = wasMessageWrittenByAHuman && doesMessageContainText;

  logger.info("determined if message should be saved", {
    shouldMessageBeSaved,
    doesMessageContainText,
    wasMessageWrittenByAHuman,
    isChannelNotification,
    subtype: message.subtype ?? "none",
  });

  if (!shouldMessageBeSaved) return;

  const organisationId = await organisationIdFromTeam(team);

  if (!organisationId) return;

  await Collection.InstantMessage.add({
    text: message.text!,
    createdAt: new Date(),
    sentAt: new Date(),
    organisationId,
    channelId: channel,
    source: InstantMessageSource.SLACK,
  });
};
