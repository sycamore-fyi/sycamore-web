import { AuthForm, AuthType } from "./AuthForm";

export default function LogInPage() {
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="bg-gray-500"></div>
      <div className="flex items-center justify-center">
        <AuthForm authType={AuthType.LOG_IN} />
      </div>
    </div>
  )
}