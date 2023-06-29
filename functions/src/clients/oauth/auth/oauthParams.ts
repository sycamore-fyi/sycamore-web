import { SecretParam } from "firebase-functions/lib/params/types";
import { googleWorkspaceCredentials, hubspotCredentials, slackCredentials, zoomCredentials } from "../../firebase/secrets";
import { OauthIntegration, OauthServiceType } from "@sycamore-fyi/shared";

export interface OauthParams {
  secret: SecretParam,
  scopes?: string[],
  authUrl: string,
  tokensUrl: string,
  serviceType: OauthServiceType,
  additionalParams?: Record<string, string>,
  fieldNameOverrides?: {
    scopes?: string
  }
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
    serviceType: OauthServiceType.MEETING_TOOL,
    additionalParams: {
      response_type: "code",
    },
  },
  [OauthIntegration.SLACK]: {
    secret: slackCredentials,
    authUrl: "https://slack.com/oauth/v2/authorize",
    scopes: [
      "channels:history",
      "channels:join",
      "channels:read",
      "groups:history",
      "groups:read",
      "im:history",
      "mpim:history",
      "mpim:read",
    ],
    tokensUrl: "https://slack.com/api/oauth.v2.access",
    serviceType: OauthServiceType.INSTANT_MESSAGE_TOOL,
    fieldNameOverrides: {
      scopes: "scope",
    },
  },
  [OauthIntegration.GOOGLE_CALENDAR]: {
    secret: googleWorkspaceCredentials,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokensUrl: "https://oauth2.googleapis.com/token",
    serviceType: OauthServiceType.CALENDAR,
    scopes: [
      ".../auth/calendar.events.readonly",
    ],
    additionalParams: {
      access_type: "offline",
    },
    fieldNameOverrides: {
      scopes: "scope",
    },
  },
};
