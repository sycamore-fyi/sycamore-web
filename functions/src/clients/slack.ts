import { App } from "@slack/bolt";
import { SlackCredentials } from "../triggers/http/slack/slackReceiver";
import { getCredentials, slackCredentials } from "./firebase/secrets";

export const slack = (
  { signingSecret, token }: SlackCredentials = getCredentials<SlackCredentials>(slackCredentials)
) => {
  const app = new App({
    signingSecret,
    token,
  });

  return app.client;
};
