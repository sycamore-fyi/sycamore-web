import { OauthIntegration } from "@sycamore-fyi/shared";
import { fetchToken } from "./fetchToken";

export async function exchangeAuthCodeForTokens(integration: OauthIntegration, code: string) {
  return fetchToken(integration, { grant_type: "authorization_code", code });
}
