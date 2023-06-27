import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { logger } from "firebase-functions/v2";
import { getBotCredentials } from "../utils/getBotCredentials";
import { Collection } from "../../../../clients/firebase/firestore/collection";
import { InstantMessageChannelMembership, InstantMessageSource } from "@sycamore-fyi/shared";
import { connectionFromTeam } from "../utils/organisationIdFromTeamId";
import { slack } from "../../../../clients/slack";

export const handleMemberJoinedChannel = async ({ event }: SlackEventMiddlewareArgs<"member_joined_channel">) => {
  const { user, channel, team } = event;
  const connection = await connectionFromTeam(team);
  if (!connection) return;
  const { data: { organisationId } } = connection;

  const slackClient = await slack(organisationId);

  logger.info("member joined channel", {
    user,
    channel,
    team,
  });

  const { botUserId } = await getBotCredentials(slackClient);

  logger.info("got bot user id", {
    botUserId,
    user,
  });

  if (user !== botUserId) return;

  logger.info("bot joined channel");


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
