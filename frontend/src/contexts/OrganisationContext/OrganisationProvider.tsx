import {
  ReactNode,
  useEffect,
  useMemo,
  useState
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
  const errorMessage = "Organisation either doesn't exist, or you don't have permission to view"

  const [state, updateState] = useUpdateState<OrganisationContextState>(initialOrganisationState)
  const [error, setError] = useState<string>()

  console.log("rendering organisation provider", state)

  useEffect(() => {
    console.log("org id or auth user id changed")
    setError(undefined)

    updateState({
      isLoading: !!organisationId && !!authUserId,
      organisation: null,
      memberships: null
    })

    if (!organisationId || !authUserId) {
      console.log("no organisation id or auth user id in provider, returning")
      setError("No organisation found")
      return
    }

    onSnapshot(doc(Collection.Organisation, organisationId),
      organisation => updateState({ organisation }),
      () => setError(errorMessage)
    )

    onSnapshot(query(Collection.Membership, where("organisationId", "==", organisationId)), ({ docs: memberships }) => {
      updateState({ memberships }),
        () => setError(errorMessage)
    })
  }, [updateState, organisationId, authUserId])

  useEffect(() => {
    if (!state.organisation || !state.memberships) return

    updateState({ isLoading: false })

    if (state.organisation?.exists() && !!state.memberships && state.memberships?.length > 0) { return }

    setError(errorMessage)
  }, [state.memberships, state.organisation, updateState])

  const value = useMemo(() => ({
    state,
    actions: organisationActions
  }), [state])

  console.log(error)

  if (error) return <p>{error}</p>

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  )
}
