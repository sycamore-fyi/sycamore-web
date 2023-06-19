import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useQueryParams } from "@/hooks/useQueryParams"
import { useUpdateState } from "@/hooks/useUpdateState"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FormUtil } from "../../components/FormUtil"
import { emailSchema } from "@/schemas/emailSchema"
import { FormFieldUtil } from "@/components/FormFieldUtil"
import { LocalStorageKey } from "@/lib/LocalStorageKey"

interface Data {
  email: string | null,
}

export default function EmailLinkPage() {
  const { actions: { handleEmailLink } } = useAuth()
  const navigate = useNavigate()
  const { r } = useQueryParams()
  const returnPath = r ?? "/"

  const [state, updateState] = useUpdateState<Data>({
    email: localStorage.getItem(LocalStorageKey.EMAIL_FOR_SIGN_IN),
  })

  useEffect(() => {
    if (!state.email) return

    handleEmailLink(state.email, window.location.href)
      .then(() => navigate(returnPath))
  }, [state.email, returnPath, handleEmailLink, navigate])

  if (state.email) return <div>Email link</div>

  return (
    <div className="grid grid-cols-2 h-full">
      <div className="bg-slate-500"></div>
      <div className="flex items-center justify-center">
        <div className="max-w-[480px] w-full mx-auto space-y-4">
          <FormUtil
            schema={emailSchema}
            defaultValues={{ email: "" }}
            onSubmit={({ email }) => updateState({ email })}
            render={form => (
              <FormFieldUtil
                control={form.control}
                name="email"
                render={({ field }) => <Input {...field} />}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}