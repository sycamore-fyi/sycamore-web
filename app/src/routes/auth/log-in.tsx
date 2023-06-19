import { CenterPage } from "@/components/layout/CenterPage";
import { AuthForm, AuthType } from "./AuthForm";

export default function LogInPage() {
  return (
    <CenterPage>
      <AuthForm authType={AuthType.LOG_IN} />
    </CenterPage>
  )
}