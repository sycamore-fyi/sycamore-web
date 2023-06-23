import { InstantMessageSource } from "../enums/InstantMessageSource"

export interface InstantMessageChannel {
  organisationId: string,
  name: string,
  source: InstantMessageSource,
  createdAt: Date
}