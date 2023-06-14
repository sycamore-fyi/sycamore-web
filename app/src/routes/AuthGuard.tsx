import { useAuth } from "@/contexts/AuthContext/AuthContext";
import { useComplexNavigate } from "@/hooks/useComplexNavigate";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoadingDashboard } from "./LoadingDashboard";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { state: { isLoading, authUser } } = useAuth()

  const location = useLocation()
  const navigate = useComplexNavigate()

  useEffect(() => {
    if (isLoading) return
    if (!authUser) {
      navigate({
        path: "/auth/sign-up",
        query: {
          r: location.pathname
        }
      })
    }
  }, [authUser, location.pathname, navigate, isLoading])

  if (isLoading || !authUser) return <LoadingDashboard />

  return <>{children}</>
}