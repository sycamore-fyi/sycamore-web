import axios from "axios";
import { GrantResponse } from "./GrantResponse";
import { GrantRequest } from "./GrantRequest";
import { getCredentials } from "../../firebase/secrets";
import { OauthCredentials } from "./OauthCredentials";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { oauthParams } from "./oauthParams";
import { redirectUri } from "./redirectUri";

export async function fetchToken(
  integration: OauthIntegration,
  grant: { grant_type: "authorization_code"; code: string; } | { grant_type: "refresh_token"; refresh_token: string; }
) {
  const { secret, tokensUrl } = oauthParams[integration];
  const { clientId, clientSecret } = getCredentials<OauthCredentials>(secret);

  const grantRequest: GrantRequest = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(integration),
    ...grant,
  };

  console.log({
    tokensUrl,
    grantRequest,
  });

  const res = await axios.post<GrantResponse>(tokensUrl, grantRequest, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const {
    refresh_token: refreshToken, access_token: accessToken, expires_in: expiresIn,
  } = res.data;

  return {
    refreshToken,
    accessToken,
    expiresIn,
  };
}
