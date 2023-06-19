import { getCredentials } from "../../firebase/secrets";
import { OauthCredentials } from "./OauthCredentials";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { oauthParams } from "./oauthParams";
import { redirectUri } from "./redirectUri";

export function constructAuthUrl(integration: OauthIntegration, state: string) {
  const { authUrl, scopes, secret } = oauthParams[integration];
  const { clientId } = getCredentials<OauthCredentials>(secret);
  const url = new URL(authUrl);
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("scopes", scopes.join(" "));
  url.searchParams.append("redirect_uri", redirectUri(integration));
  url.searchParams.append("state", state);
  return url.href;
}
