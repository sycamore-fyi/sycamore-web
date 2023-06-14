import { AuthForm, AuthType } from "./AuthForm";

export default function LogInPage() {
  return (
    // <div className="grid grid-cols-2 h-full">
    //   <div className="bg-slate-500"></div>
    //   <div className="flex items-center justify-center">
    //     <AuthForm authType={AuthType.LOG_IN} />
    //   </div>
    // </div>
    <div className="flex h-full items-center justify-center">
      <AuthForm authType={AuthType.LOG_IN} />
    </div>
  )
}