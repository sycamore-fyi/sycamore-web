import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext"
import LoadingPage from "./LoadingPage"
import { ReactNode } from "react"

export default function MembershipGuard({ children }: { children: ReactNode }) {
  const { state: { memberships, isLoading } } = useMemberships()

  if (isLoading || !memberships) return <LoadingPage />
  if (memberships.length === 0) return (
    <p>You're not a member of any organisations. Go to the Sycamore dashboard to create one.</p>
  )

  return children
}