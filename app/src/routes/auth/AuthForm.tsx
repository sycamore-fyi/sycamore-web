import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrDivider } from "@/components/ui/or-divider";
import { Link, useNavigate } from "react-router-dom";
import { Caption } from "@/components/typography/Caption";
import googleUrl from "@/assets/google.svg"
import microsoftUrl from "@/assets/microsoft.svg"
import { useQueryParams } from "@/hooks/useQueryParams";
import { FormUtil } from "../../components/FormUtil";
import { Separator } from "@/components/ui/separator";
import { emailSchema } from "@/schemas/emailSchema";
import { FormFieldUtil } from "@/components/FormFieldUtil";

export enum AuthType {
  SIGN_UP = "SIGN_UP",
  LOG_IN = "LOG_IN"
}

export function AuthForm({ authType }: { authType: AuthType }) {
  const {
    actions: {
      signInWithGoogle,
      sendEmailLink
    }
  } = useAuth()

  const { r } = useQueryParams()
  const returnPath = r ?? "/"

  const navigate = useNavigate()

  async function handleSignInWithGoogle() {
    const credentials = await signInWithGoogle()
    if (!!credentials && !!credentials.user) navigate(returnPath)
  }

  return (
    <div className="max-w-[480px] w-full mx-auto space-y-8">
      <div className="space-y-4">
        <h1>{authType === AuthType.SIGN_UP ? "Create your account" : "Log in"}</h1>
        <div className="space-y-2">
          <Button
            className="w-full gap-x-2"
            variant="outline"
            onClick={handleSignInWithGoogle}
          >
            <img className="h-4 w-4" src={googleUrl} />
            Continue with Google
          </Button>
          <Button className="w-full gap-x-2" variant="outline">
            <img className="h-4 w-4" src={microsoftUrl} />
            Continue with Microsoft
          </Button>
        </div>
        <OrDivider />
        <FormUtil
          schema={emailSchema}
          submitTitle="Email me a sign-in link"
          defaultValues={{ email: "" }}
          onSubmit={async ({ email }) => {
            await sendEmailLink(email, returnPath)
            navigate("/auth/email-link-sent")
          }}
          render={form => (
            <FormFieldUtil
              control={form.control}
              name="email"
              render={({ field }) => <Input {...field} />}
            />
          )}
        />
        {
          authType === AuthType.SIGN_UP
            ? <Caption>
              {`By signing up, you agree to our `}
              <Link to="/legal/terms-of-service" target="_blank" className="font-semibold hover:opacity-80">Terms of Service</Link>
              {` and `}
              <Link to="/legal/privacy-policy" target="_blank" className="font-semibold hover:opacity-80">Privacy Policy</Link>
              .
            </Caption>
            : null
        }
      </div>
      <Separator />
      <p>
        {`${authType === AuthType.SIGN_UP ? "Already" : "Don't"} have an account? `}
        <Link
          to={`/auth/${authType === AuthType.SIGN_UP ? "log-in" : "sign-up"}`}
          className="font-semibold text-purple-500 hover:opacity-80"
        >
          {authType === AuthType.SIGN_UP ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  )
}