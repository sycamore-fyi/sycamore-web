import { WebClient } from "@slack/web-api";

export interface BotCredentials {
  botId: string,
  botUserId: string,
}

export async function getBotCredentials(slackClient: WebClient): Promise<BotCredentials> {
  const {
    bot_id: botId,
    user_id: botUserId,
  } = await slackClient.auth.test();

  return {
    botId: botId!,
    botUserId: botUserId!,
  };
}
