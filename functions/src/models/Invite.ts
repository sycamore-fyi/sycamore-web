import { OrganisationRole } from "./Membership";

export interface Invite {
  email: string,
  organisationId: string,
  role: OrganisationRole,
  invitingUserId: string,
  createdAt: Date,
  isAccepted: boolean,
  acceptedAt?: Date,
  acceptingUserId?: string,
  isCancelled: boolean,
  cancelledAt?: Date,
}
