import { createContext, useContext } from "react"
import { Membership } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"

export interface MembershipsContextState {
  isLoading: boolean,
  memberships?: DocumentSnapshot<Membership>[] | null
}

export interface MembershipsContextActions {
  create?: (data: { name: string }) => Promise<{ organisationId: string }>
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
  actions: {}
})

export const useMemberships = () => useContext(MembershipsContext)
