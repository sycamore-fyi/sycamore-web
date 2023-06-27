import {
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { OrganisationContext, OrganisationContextProps, OrganisationContextState, initialOrganisationState } from "./OrganisationContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { setGroup } from "@amplitude/analytics-browser";

export default function OrganisationProvider({ children }: { children: ReactNode }) {
  const { organisationId } = useParams()
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid
  const errorMessage = "Organisation either doesn't exist, or you don't have permission to view"

  const [state, updateState] = useUpdateState<OrganisationContextState>(initialOrganisationState)
  const [error, setError] = useState<string>()

  const handleError = (err: unknown) => {
    console.error(err)
    setError(errorMessage)
  }

  console.log("rendering organisation provider", state)

  const realOrgId = state.organisation?.id

  useEffect(() => {
    console.log("org id or auth user id changed")
    setError(undefined)

    updateState({
      isLoading: !!organisationId && !!authUserId,
      organisation: null,
      memberships: null,
      userMembership: null,
      invites: null,
      calls: null
    })

    if (!organisationId || !authUserId) {
      console.log("no organisation id or auth user id in provider, returning")
      setError("No organisation found")
      return
    }

    const orgUnsub = onSnapshot(
      doc(Collection.Organisation, organisationId),
      organisation => updateState({ organisation }),
      handleError
    )

    const membershipsUnsub = onSnapshot(
      query(Collection.Membership, where("organisationId", "==", organisationId)),
      ({ docs: memberships }) => updateState({
        memberships,
        userMembership: memberships.find(m => m.data().userId === authUserId)
      }),
      handleError
    )

    const callsUnsub = onSnapshot(
      query(Collection.Call, where("organisationId", "==", organisationId)),
      ({ docs: calls }) => updateState({ calls }),
      handleError
    )

    const invitesUnsub = onSnapshot(
      query(Collection.Invite, where("organisationId", "==", organisationId)),
      ({ docs: invites }) => updateState({ invites }),
      handleError
    )

    const connectionsUnsub = onSnapshot(
      query(Collection.OauthConnection, where("organisationId", "==", organisationId)),
      ({ docs: oauthConnections }) => updateState({ oauthConnections }),
      handleError
    )

    return () => {
      orgUnsub()
      membershipsUnsub()
      callsUnsub()
      invitesUnsub()
      connectionsUnsub()
    }
  }, [updateState, organisationId, authUserId])

  useEffect(() => {
    if (!state.organisation || !state.memberships || !state.userMembership || !state.calls || !state.invites || !state.oauthConnections) return

    updateState({ isLoading: false })

    if (state.organisation?.exists() && state.memberships?.length > 0) { return }

    setError(errorMessage)
  }, [state.memberships, state.userMembership, state.organisation, state.calls, state.invites, state.oauthConnections, updateState])

  useEffect(() => {
    setGroup("organisationId", realOrgId ?? "null")
  }, [realOrgId])

  const value: OrganisationContextProps = useMemo(() => ({
    state,
    actions: {
      async leave() {
        const membershipRef = state.userMembership?.ref
        if (!membershipRef) return
        return deleteDoc(membershipRef)
      },
      async deleteOrg() {
        const orgRef = state.organisation?.ref
        if (!orgRef) return
        return deleteDoc(orgRef)
      },
      async cancelInvite(inviteId) {
        return updateDoc(
          doc(Collection.Invite, inviteId),
          { isCancelled: true }
        )
      },
      async removeMember(membershipId) {
        return deleteDoc(doc(Collection.Membership, membershipId))
      },
      async changeMemberRole(membershipId, role) {
        return updateDoc(
          doc(Collection.Membership, membershipId),
          { role }
        )
      }
    }
  }), [state])

  if (error) return <p>{error}</p>

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  )
}
