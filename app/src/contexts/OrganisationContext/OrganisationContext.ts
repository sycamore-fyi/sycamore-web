import { createContext, useContext } from "react"
import { Invite, Membership, Organisation, Recording } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { organisationActions } from "./organisationActions"

export interface OrganisationContextState {
  isLoading: boolean,
  organisation?: DocumentSnapshot<Organisation> | null,
  memberships?: DocumentSnapshot<Membership>[] | null,
  userMembership?: DocumentSnapshot<Membership> | null,
  invites?: DocumentSnapshot<Invite>[] | null,
  recordings?: DocumentSnapshot<Recording>[] | null,
}

export interface OrganisationContextProps {
  state: OrganisationContextState,
  actions: typeof organisationActions
}

export const initialOrganisationState: OrganisationContextState = {
  isLoading: true,
}

export const OrganisationContext = createContext<OrganisationContextProps>({
  state: initialOrganisationState,
  actions: organisationActions
})

export const useOrganisation = () => useContext(OrganisationContext)
