import { OauthIntegration } from "../enums/OauthIntegration";
import { SyncedDataType } from "../enums/SyncedDataType";

export interface SyncedData<T = any> {
  integration: OauthIntegration,
  type: SyncedDataType,
  oauthConnectionId: string,
  dataExtractionId: string,
  organisationId: string,
  data: T,
  createdAt: Date,
}