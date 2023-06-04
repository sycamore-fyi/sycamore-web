import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { documentId, onSnapshot, query, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { OrganisationsContext, OrganisationsContextState, initialOrganisationsState } from "./OrganisationsContext";
import { organisationsActions } from "./organisationsActions";
import { useAuth } from "../AuthContext/AuthContext";

export default function OrganisationsProvider({ children }: { children: ReactNode }) {
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid

  const [state, updateState] = useUpdateState<OrganisationsContextState>(initialOrganisationsState)

  console.log("rendering organisation provider", state)

  useEffect(() => {
    updateState({
      isLoading: !!authUserId,
      organisations: null,
      memberships: null
    })

    if (!authUserId) return

    onSnapshot(
      query(Collection.Membership, where("userId", "==", authUserId)),
      ({ docs }) => {
        const hasMemberships = docs.length > 0

        updateState({
          memberships: docs,
          isLoading: hasMemberships,
        })
      }
    )
  }, [updateState, authUserId])

  useEffect(() => {
    if (!state.memberships) return

    if (state.memberships.length === 0) {
      updateState({ organisations: [] })
      return
    }

    const organisationIds = state.memberships
      .map((doc) => doc.data()?.organisationId)
      .filter(x => !!x) as string[]

    return onSnapshot(
      query(
        Collection.Organisation,
        where(documentId(), "in", organisationIds)
      ),
      ({ docs }) => {
        updateState({
          organisations: docs,
          isLoading: false
        })
      }
    )
  }, [state.memberships, updateState])

  const value = useMemo(() => ({
    state,
    actions: organisationsActions
  }), [state])

  return (
    <OrganisationsContext.Provider value={value}>
      {children}
    </OrganisationsContext.Provider>
  )
}
