import { OauthIntegration } from "../enums/OauthIntegration";
import { OauthServiceType } from "../enums/OauthServiceType";

export interface OauthConnection {
  organisationId: string,
  integration: OauthIntegration,
  serviceType: OauthServiceType,
  accessToken?: string,
  refreshToken: string,
  metadata?: { [key: string]: any }
  createdAt: Date
}