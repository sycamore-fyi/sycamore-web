import { OauthIntegration } from "@sycamore-fyi/shared";
import { syncHubspot } from "./hubspot/syncHubspot";

export const syncFunctions = {
  [OauthIntegration.HUBSPOT]: syncHubspot,
  [OauthIntegration.SALESFORCE]: syncHubspot,
  [OauthIntegration.SLACK]: () => {
    console.log(1);
  },
  [OauthIntegration.ZOOM]: () => {
    console.log(1);
  },
};
