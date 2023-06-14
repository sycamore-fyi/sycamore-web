import { createContext, useContext } from "react"
import { Membership } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { membershipsActions } from "./membershipsActions"

export interface MembershipsContextState {
  isLoading: boolean,
  memberships?: DocumentSnapshot<Membership>[] | null
}

export interface MembershipsContextProps {
  state: MembershipsContextState,
  actions: typeof membershipsActions
}

export const initialMembershipsState: MembershipsContextState = {
  isLoading: true,
}

export const MembershipsContext = createContext<MembershipsContextProps>({
  state: initialMembershipsState,
  actions: membershipsActions
})

export const useMemberships = () => useContext(MembershipsContext)
