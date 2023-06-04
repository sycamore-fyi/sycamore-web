import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { OrganisationContext, OrganisationContextState, initialOrganisationState } from "./OrganisationContext";
import { organisationActions } from "./organisationActions";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

export default function OrganisationProvider({ children }: { children: ReactNode }) {
  const { organisationId } = useParams()
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid

  const [state, updateState] = useUpdateState<OrganisationContextState>(initialOrganisationState)

  console.log("rendering organisation provider", state)

  useEffect(() => {
    updateState({
      isLoading: !!organisationId && !!authUserId,
      organisation: null,
      memberships: null
    })

    if (!organisationId || !authUserId) {
      console.log("no organisation id or auth user id in provider, returning")
      return
    }

    onSnapshot(doc(Collection.Organisation, organisationId), organisation => {
      updateState({
        organisation,
      })
    })

    onSnapshot(query(Collection.Membership, where("organisationId", "==", organisationId)), ({ docs: memberships }) => {
      updateState({
        memberships
      })
    })
  }, [updateState, organisationId, authUserId])

  useEffect(() => {
    if (!state.organisation || !state.memberships) return

    updateState({ isLoading: false })
    if (state.organisation?.exists() && !!state.memberships && state.memberships?.length > 0) {
      return
    }

    throw new Error(`Organisation with id ${organisationId} either doesn't exist, or you don't have permission to view`)
  }, [state.memberships, state.organisation, updateState, organisationId])

  const value = useMemo(() => ({
    state,
    actions: organisationActions
  }), [state])

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  )
}
