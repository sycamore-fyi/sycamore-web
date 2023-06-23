import { App, ExpressReceiver } from "@slack/bolt";
import { handleMessage } from "./listeners/handleMessage";
import { handleBotJoinedChannel } from "./listeners/handleBotJoinedChannel";
import { getCredentials, slackCredentials } from "../../../clients/firebase/secrets";

export interface SlackCredentials {
  appId: string,
  clientId: string,
  clientSecret: string,
  signingSecret: string,
  token: string,
}

const { signingSecret, token } = getCredentials<SlackCredentials>(slackCredentials);

const receiver = new ExpressReceiver({ signingSecret });

const app = new App({
  receiver,
  token,
  ignoreSelf: false,
});

app.event("member_joined_channel", handleBotJoinedChannel);
app.message(handleMessage);

export default receiver.app;
