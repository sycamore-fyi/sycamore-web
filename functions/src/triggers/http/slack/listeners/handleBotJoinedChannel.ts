import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { logger } from "firebase-functions/v2";
import { getBotCredentials } from "../utils/getBotCredentials";
import { Collection } from "../../../../clients/firebase/firestore/collection";
import { InstantMessageChannelMembership, InstantMessageSource, OauthIntegration } from "@sycamore-fyi/shared";
import { organisationIdFromTeam } from "../utils/organisationIdFromTeamId";

export const handleBotJoinedChannel = async ({ event }: SlackEventMiddlewareArgs<"member_joined_channel">) => {
  const { user, channel, team } = event;

  logger.info("member joined channel", {
    user,
    channel,
    team,
  });

  const { botUserId } = await getBotCredentials();

  logger.info("got bot user id", {
    botUserId,
    user,
  });

  if (user !== botUserId) return;

  logger.info("bot joined channel");

  const organisationId = await organisationIdFromTeam(team);

  if (!organisationId) return;

  const channelMembershipData: InstantMessageChannelMembership = {
    organisationId,
    channelId: channel,
    userId: user,
    isBotUser: true,
    createdAt: new Date(),
    source: InstantMessageSource.SLACK,
  };

  await Collection.InstantMessageChannelMembership.add(channelMembershipData);
};
