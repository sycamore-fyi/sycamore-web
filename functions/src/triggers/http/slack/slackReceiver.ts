import { App, ExpressReceiver } from "@slack/bolt";
import { handleMessage } from "./listeners/handleMessage";
import { handleMemberJoinedChannel } from "./listeners/handleBotJoinedChannel";
import { getCredentials, slackCredentials } from "../../../clients/firebase/secrets";
import { connectionFromTeam } from "./utils/organisationIdFromTeamId";

export interface SlackCredentials {
  appId: string,
  clientId: string,
  clientSecret: string,
  signingSecret: string,
}

const { signingSecret } = getCredentials<SlackCredentials>(slackCredentials);

const receiver = new ExpressReceiver({ signingSecret });

const app = new App({
  receiver,
  authorize: async (source) => {
    if (!source.teamId) throw new Error("Unauthorized");
    const connection = await connectionFromTeam(source.teamId);
    if (!connection) throw new Error("Unauthorized");
    const { accessToken } = connection.data;

    return { botToken: accessToken };
  },
  ignoreSelf: false,
});

app.event("member_joined_channel", handleMemberJoinedChannel);
app.message(handleMessage);

export default receiver.app;
