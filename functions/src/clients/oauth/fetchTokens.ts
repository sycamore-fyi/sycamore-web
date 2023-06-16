import axios from "axios";
import { GrantResponse } from "./GrantResponse";
import { GrantRequest } from "./GrantRequest";
import { SecretParam } from "firebase-functions/lib/params/types";
import { getCredentials, hubspotCredentials } from "../firebase/secrets";
import { OauthCredentials } from "./OauthCredentials";
import { config } from "../../config";
import { OauthIntegration } from "@sycamore-fyi/shared";

interface OauthParams {
  secret: SecretParam,
  scopes: string[],
  authUrl: string,
  tokensUrl: string
}

export const oauthParams: { [key in OauthIntegration]: OauthParams } = {
  [OauthIntegration.HUBSPOT]: {
    secret: hubspotCredentials,
    scopes: [],
    authUrl: "https://app.hubspot.com/oauth/authorize",
    tokensUrl: "https://api.hubapi.com/oauth/v1/token",
  },
};

function redirectUri(integration: OauthIntegration) {
  return `${config().CLIENT_URL}/oauth/${integration.toLowerCase()}`;
}

async function fetchToken(
  integration: OauthIntegration,
  grant: { grant_type: "authorization_code", code: string } | { grant_type: "refresh_token", refresh_token: string }
) {
  const { secret, tokensUrl } = oauthParams[integration];
  const { clientId, clientSecret } = getCredentials<OauthCredentials>(secret);

  const grantRequest: GrantRequest = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(integration),
    ...grant,
  };

  const res = await axios.post<GrantResponse>(tokensUrl, grantRequest);

  const {
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_in: expiresIn,
  } = res.data;

  return {
    refreshToken,
    accessToken,
    expiresIn,
  };
}

export async function refreshAccessToken(integration: OauthIntegration, refreshToken: string) {
  return fetchToken(integration, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

export async function exchangeAuthCodeForTokens(integration: OauthIntegration, code: string) {
  return fetchToken(integration, { grant_type: "authorization_code", code });
}

export function constructAuthUrl(integration: OauthIntegration) {
  const { authUrl, scopes, secret } = oauthParams[integration];
  const { clientId } = getCredentials<OauthCredentials>(secret);
  const url = new URL(authUrl);
  url.searchParams.append("client_id", encodeURIComponent(clientId));
  url.searchParams.append("scopes", encodeURIComponent(scopes[0]));
  url.searchParams.append("redirect_uri", encodeURIComponent(redirectUri(integration)));
  return url.href;
}


