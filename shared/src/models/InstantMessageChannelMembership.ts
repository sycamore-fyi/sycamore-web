import { InstantMessageSource } from "../enums/InstantMessageSource";

export interface InstantMessageChannelMembership {
  organisationId: string,
  userId: string,
  channelId: string,
  source: InstantMessageSource,
  isBotUser: boolean,
  createdAt: Date,
}