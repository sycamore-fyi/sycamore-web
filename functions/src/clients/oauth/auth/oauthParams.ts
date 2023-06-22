import { SecretParam } from "firebase-functions/lib/params/types";
import { hubspotCredentials } from "../../firebase/secrets";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { OauthServiceType } from "@sycamore-fyi/shared/build/enums/OauthServiceType";

export interface OauthParams {
  secret: SecretParam,
  scopes: string[],
  authUrl: string,
  tokensUrl: string,
  serviceType: OauthServiceType
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
};
