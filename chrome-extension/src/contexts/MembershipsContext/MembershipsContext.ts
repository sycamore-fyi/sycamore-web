import { createContext, useContext } from "react"
import { Membership } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"

export interface MembershipsContextState {
  isLoading: boolean,
  memberships?: DocumentSnapshot<Membership>[] | null,
  selectedMembership?: DocumentSnapshot<Membership> | null,
}

export interface MembershipsContextActions {
  selectMembership(membershipId: string): void
}

const defaultActions: MembershipsContextActions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectMembership() { },
}

export interface MembershipsContextProps {
  state: MembershipsContextState,
  actions: MembershipsContextActions
}

export const initialMembershipsState: MembershipsContextState = {
  isLoading: true,
}

export const MembershipsContext = createContext<MembershipsContextProps>({
  state: initialMembershipsState,
  actions: defaultActions
})

export const useMemberships = () => useContext(MembershipsContext)
