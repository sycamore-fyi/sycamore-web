import { OauthIntegration } from "../enums/OauthIntegration";

export interface OauthConnection {
  organisationId: string,
  integration: OauthIntegration,
  refreshToken: string,
  createdAt: Date
}