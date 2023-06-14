import { useUpdateState } from "@/hooks/useUpdateState";
import { putServer } from "@/lib/callServer";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

interface Data {
  organisationId?: string,
  errorMessage?: string,
}

export default function AcceptInvitePage() {
  const { inviteId } = useParams()
  const [state, updateState] = useUpdateState<Data>({})

  useEffect(() => {
    (async () => {
      if (!inviteId) return

      try {
        const res = await putServer(`/invites/${inviteId}/accept`)
        const { organisationId } = res.data

        updateState({ organisationId })
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err.response?.data)

          updateState({
            errorMessage: err.response?.data.message
          })
        }
      }

    })()
  }, [inviteId, updateState])

  if (state.errorMessage) {
    return (
      <p>{state.errorMessage}</p>
    )
  }

  if (!state.organisationId) return <p>Loading</p>

  return <Navigate to={`/org/${state.organisationId}`} />
}