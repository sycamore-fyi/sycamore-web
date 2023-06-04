import { createContext, useContext } from "react"
import { Membership, Organisation } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { organisationsActions } from "./organisationsActions"

export interface OrganisationsContextState {
  isLoading: boolean,
  organisations?: DocumentSnapshot<Organisation>[] | null,
  memberships?: DocumentSnapshot<Membership>[] | null
}

export interface OrganisationsContextProps {
  state: OrganisationsContextState,
  actions: typeof organisationsActions
}

export const initialOrganisationsState: OrganisationsContextState = {
  isLoading: true,
}

export const OrganisationsContext = createContext<OrganisationsContextProps>({
  state: initialOrganisationsState,
  actions: organisationsActions
})

export const useOrganisations = () => useContext(OrganisationsContext)
