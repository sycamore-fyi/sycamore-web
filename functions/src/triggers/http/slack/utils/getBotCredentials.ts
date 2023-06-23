import { slack } from "../../../../clients/slack";
import { AsyncCache } from "../../../../utils/AsyncCache";

const botCredentialsCache = new AsyncCache(
  () => slack().auth.test(),
  1000 * 60 * 60 * 24
);

export interface BotCredentials {
  botId: string,
  botUserId: string,
}

export async function getBotCredentials(): Promise<BotCredentials> {
  const {
    bot_id: botId,
    user_id: botUserId,
  } = await botCredentialsCache.retrieveValue();

  return {
    botId: botId!,
    botUserId: botUserId!,
  };
}
