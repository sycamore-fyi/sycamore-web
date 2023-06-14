import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { onSnapshot, query, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { MembershipsContext, MembershipsContextState, initialMembershipsState } from "./MembershipsContext";
import { membershipsActions } from "./membershipsActions";
import { useAuth } from "../AuthContext/AuthContext";

export default function MembershipsProvider({ children }: { children: ReactNode }) {
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid

  const [state, updateState] = useUpdateState<MembershipsContextState>(initialMembershipsState)

  console.log("rendering memberships provider", state)

  useEffect(() => {
    updateState({
      isLoading: !!authUserId,
      memberships: null
    })

    if (!authUserId) return

    onSnapshot(
      query(Collection.Membership, where("userId", "==", authUserId)),
      ({ docs: memberships }) => {
        updateState({ memberships, isLoading: false })
      }
    )
  }, [updateState, authUserId])

  const value = useMemo(() => ({
    state,
    actions: membershipsActions
  }), [state])

  return (
    <MembershipsContext.Provider value={value}>
      {children}
    </MembershipsContext.Provider>
  )
}
