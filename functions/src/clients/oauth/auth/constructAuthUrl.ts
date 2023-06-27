import { getCredentials } from "../../firebase/secrets";
import { OauthCredentials } from "./OauthCredentials";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { oauthParams } from "./oauthParams";
import { redirectUri } from "./redirectUri";

export function constructAuthUrl(integration: OauthIntegration, state: string) {
  const { authUrl, scopes, secret, additionalParams, fieldNameOverrides } = oauthParams[integration];
  const { clientId } = getCredentials<OauthCredentials>(secret);
  const url = new URL(authUrl);
  url.searchParams.append("client_id", clientId);
  if (scopes) {
    url.searchParams.append(fieldNameOverrides?.scopes ?? "scopes", scopes.join(" "));
  }

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  url.searchParams.append("redirect_uri", redirectUri(integration));
  url.searchParams.append("state", state);
  return url.href;
}
