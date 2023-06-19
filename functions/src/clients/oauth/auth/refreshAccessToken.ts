import { OauthIntegration } from "@sycamore-fyi/shared";
import { fetchToken } from "./fetchToken";


export async function refreshAccessToken(integration: OauthIntegration, refreshToken: string) {
  return fetchToken(integration, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}
