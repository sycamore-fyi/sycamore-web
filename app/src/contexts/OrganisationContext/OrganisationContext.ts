import { createContext, useContext } from "react"
import { Invite, Membership, Organisation, Call, OauthConnection, OrganisationRole } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { CreateInvite } from "@/routes/org/[organisationId]/settings/tabs/team/InvitesDialog"

export interface OrganisationContextState {
  isLoading: boolean,
  organisation?: DocumentSnapshot<Organisation> | null,
  memberships?: DocumentSnapshot<Membership>[] | null,
  userMembership?: DocumentSnapshot<Membership> | null,
  invites?: DocumentSnapshot<Invite>[] | null,
  oauthConnections?: DocumentSnapshot<OauthConnection>[] | null,
  calls?: DocumentSnapshot<Call>[] | null,
}

export interface OrganisationContextActions {
  leave?: () => Promise<void>,
  deleteOrg?: () => Promise<void>,
  sendInvites?: (data: CreateInvite) => Promise<void>,
  cancelInvite?: (inviteId: string) => Promise<void>,
  removeMember?: (membershipId: string) => Promise<void>,
  changeMemberRole?: (membershipId: string, role: OrganisationRole) => Promise<void>,
}

export interface OrganisationContextProps {
  state: OrganisationContextState,
  actions: OrganisationContextActions
}

export const initialOrganisationState: OrganisationContextState = {
  isLoading: true,
}

export const OrganisationContext = createContext<OrganisationContextProps>({
  state: initialOrganisationState,
  actions: {}
})

export const useOrganisation = () => useContext(OrganisationContext)
