import { CenterPage } from "@/components/layout/CenterPage";
import { AuthForm, AuthType } from "./AuthForm";

export default function SignUpPage() {
  return (
    <CenterPage>
      <AuthForm authType={AuthType.SIGN_UP} />
    </CenterPage>
  )
}