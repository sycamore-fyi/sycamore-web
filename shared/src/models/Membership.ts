export enum OrganisationRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export interface Membership {
  organisationId: string,
  userId: string,
  role: OrganisationRole,
  organisationName: string,
  userName?: string,
  userPhotoUrl?: string,
  createdAt: Date,
}
