import { AuthForm, AuthType } from "./AuthForm";

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="bg-gray-500"></div>
      <div className="flex items-center justify-center">
        <AuthForm authType={AuthType.SIGN_UP} />
      </div>
    </div>
  )
}