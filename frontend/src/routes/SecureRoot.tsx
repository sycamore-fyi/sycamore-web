import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext/AuthContext";
import { useComplexNavigate } from "@/hooks/useComplexNavigate";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function SecureRoot() {
  const { state: { isLoading, authUser } } = useAuth()
  const location = useLocation()
  const navigate = useComplexNavigate()

  useEffect(() => {
    if (isLoading) return
    if (!authUser) {
      navigate({
        path: "/auth/log-in",
        query: {
          r: location.pathname
        }
      })
    }
  }, [authUser, location.pathname, navigate, isLoading])

  if (isLoading) return <p>Loading</p>

  if (!authUser) return <p>Unauthenticated</p>

  return (
    <>
      <TopBar />
      <Outlet />
    </>
  )
}