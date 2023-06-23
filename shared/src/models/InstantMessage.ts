import { InstantMessageSource } from "../enums/InstantMessageSource";

export interface InstantMessage {
  text: string,
  sentAt: Date,
  createdAt: Date,
  organisationId: string,
  channelId: string,
  source: InstantMessageSource
}