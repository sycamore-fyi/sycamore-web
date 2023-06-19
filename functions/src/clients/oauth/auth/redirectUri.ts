import { OauthIntegration } from "@sycamore-fyi/shared";
import { config } from "../../../config";

export function redirectUri(integration: OauthIntegration) {
  return `${config().CLIENT_URL}/oauth/${integration.toLowerCase()}`;
}
