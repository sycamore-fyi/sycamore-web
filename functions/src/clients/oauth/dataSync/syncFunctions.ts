import { OauthIntegration } from "@sycamore-fyi/shared";
import { syncHubspot } from "./hubspot/syncHubspot";

export const syncFunctions = {
  [OauthIntegration.HUBSPOT]: syncHubspot,
  [OauthIntegration.SALESFORCE]: syncHubspot,
};
