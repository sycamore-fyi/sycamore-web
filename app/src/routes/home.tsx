import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext"
import { LoadingDashboard } from "./LoadingDashboard"
import { Navigate } from "react-router-dom"

export default function HomePage() {
  const { state: { authUser, isLoading: isAuthLoading } } = useAuth()
  const { state: { isLoading: areMembershipsLoading, memberships } } = useMemberships()

  console.log("memberships: ", memberships)

  if (isAuthLoading || areMembershipsLoading) return <LoadingDashboard />
  if (!authUser) return <Navigate to="/auth/sign-up" />
  if (!memberships || memberships.length === 0) return <Navigate to="/org/create" />
  return <Navigate to={`/org/${memberships[0].data()!.organisationId}`} />
}