import { ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import AuthPage from "@/app/AuthPage"
import LoadingPage from "./LoadingPage"
import { useUser } from "@/contexts/UserContext/UserContext"

export default function UserGuard({ children }: { children: ReactNode }) {
  const { state: { authUser, isLoading: isLoadingAuth } } = useAuth()
  const { state: { isLoading: isLoadingUser } } = useUser()

  if (isLoadingAuth || isLoadingUser) return <LoadingPage />
  if (!authUser) return <AuthPage />
  return children
}