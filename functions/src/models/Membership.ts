export enum OrganisationRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export interface Membership {
  organisationId: string,
  userId: string,
  role: OrganisationRole,
  createdAt: Date,
}
