import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import googleUrl from "@/assets/google-logo.png"
import microsoftUrl from "@/assets/microsoft-logo.png"
import { OrDivider } from "@/components/ui/or-divider"
import { Input } from "@/components/ui/input"
import { useUpdateState } from "@/hooks/useUpdateState"
import { Label } from "@/components/ui/label"

interface Data {
  email: string,
  hasSentEmailLink: boolean
}

export default function AuthPage() {
  const {
    actions: {
      signInWithGoogle,
      signInWithMicrosoft,
      sendEmailLink
    }
  } = useAuth()

  const [state, updateState] = useUpdateState<Data>({
    email: "",
    hasSentEmailLink: false
  })

  const handleSubmitEmail = async () => {
    if (state.email.length < 1) return
    await sendEmailLink(state.email)
    updateState({ hasSentEmailLink: true })
  }

  if (state.hasSentEmailLink) return (
    <p>Email link sent</p>
  )

  return (
    <div className="p-4 space-y-4">
      <h1>Log in</h1>
      <div className="space-y-2">
        <Button
          className="w-full gap-x-2"
          variant="outline"
          onClick={signInWithGoogle}
        >
          <img className="h-4 w-4" src={googleUrl} />
          Continue with Google
        </Button>
        <Button
          className="w-full gap-x-2"
          variant="outline"
          onClick={signInWithMicrosoft}
        >
          <img className="h-4 w-4" src={microsoftUrl} />
          Continue with Microsoft
        </Button>
      </div>
      <OrDivider />
      <div className="space-y-2">
        <Label>Email</Label>
        <Input name="email" value={state.email} onChange={e => updateState({ email: e.target.value })} />
        <Button
          onClick={handleSubmitEmail}
          className="w-full"
        >
          Email me a signin link
        </Button>
      </div>
    </div>
  )
}