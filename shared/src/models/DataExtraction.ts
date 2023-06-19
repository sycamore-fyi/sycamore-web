import { SuccessStatus } from "../enums/SuccessStatus";

export interface DataExtraction {
  createdAt: Date,
  oauthConnectionId: string,
  status: SuccessStatus,
  organisationId: string,
  cursor?: string
}