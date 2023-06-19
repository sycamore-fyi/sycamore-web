import { CenterPage } from "@/components/layout/CenterPage";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useUpdateState } from "@/hooks/useUpdateState";
import { LocalStorageKey } from "@/lib/LocalStorageKey";
import { postServer } from "@/lib/callServer";
import { Collection } from "@/lib/firebase/Collection";
import { SuccessStatus } from "@sycamore-fyi/shared";
import { onSnapshot, query, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Data {
  stateCheckStatus: SuccessStatus,
}

export default function OauthRedirectPage() {
  const { integration } = useParams()
  const { code, state } = useQueryParams()
  const navigate = useNavigate()

  const [componentState, updateState] = useUpdateState<Data>({
    stateCheckStatus: SuccessStatus.PENDING
  })

  useEffect(() => {
    const storedState = localStorage.getItem(LocalStorageKey.OAUTH_STATE_ID)
    const stateCheckStatus = storedState && storedState === state ? SuccessStatus.SUCCEEDED : SuccessStatus.FAILED
    updateState({ stateCheckStatus })
  }, [state, updateState])

  useEffect(() => {
    (async () => {
      if (componentState.stateCheckStatus !== SuccessStatus.SUCCEEDED) return
      const res = await postServer(`/oauth/${integration}/exchange-code`, {
        code,
        state
      })

      const { organisationId } = res.data
      navigate(`/org/${organisationId}/settings`)
    })()
  }, [integration, code, state, componentState.stateCheckStatus, navigate])

  switch (componentState.stateCheckStatus) {
    case SuccessStatus.PENDING, SuccessStatus.SUCCEEDED: return <CenterPage><Loader2 className="animate-spin" /></CenterPage>
    case SuccessStatus.FAILED: return <p>Failed</p>
  }
}