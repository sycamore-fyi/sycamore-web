import { SecretParam } from "firebase-functions/lib/params/types";
import { hubspotCredentials, zoomCredentials } from "../../firebase/secrets";
import { OauthIntegration, OauthServiceType } from "@sycamore-fyi/shared";

export interface OauthParams {
  secret: SecretParam,
  scopes?: string[],
  authUrl: string,
  tokensUrl: string,
  serviceType: OauthServiceType,
  additionalParams?: Record<string, string>
}

export const oauthParams: {
  [key in OauthIntegration]: OauthParams;
} = {
  [OauthIntegration.HUBSPOT]: {
    secret: hubspotCredentials,
    scopes: [
      "crm.objects.deals.read",
      "crm.objects.companies.read",
      "crm.objects.contacts.read",
    ],
    authUrl: "https://app.hubspot.com/oauth/authorize",
    tokensUrl: "https://api.hubapi.com/oauth/v1/token",
    serviceType: OauthServiceType.CRM,
  },
  [OauthIntegration.SALESFORCE]: {
    secret: hubspotCredentials,
    scopes: [
      "crm.objects.deals.read",
      "crm.objects.companies.read",
      "crm.objects.contacts.read",
    ],
    authUrl: "https://app.hubspot.com/oauth/authorize",
    tokensUrl: "https://api.hubapi.com/oauth/v1/token",
    serviceType: OauthServiceType.CRM,
  },
  [OauthIntegration.ZOOM]: {
    secret: zoomCredentials,
    authUrl: "https://zoom.us/oauth/authorize",
    tokensUrl: "https://zoom.us/oauth/token",
    serviceType: OauthServiceType.CALLS,
    additionalParams: {
      response_type: "code",
    },
  },
};
