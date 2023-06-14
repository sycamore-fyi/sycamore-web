import AuthProvider from "@/contexts/AuthContext/AuthProvider"
import MembershipsProvider from "@/contexts/MembershipsContext/MembershipsProvider"
import UserProvider from "@/contexts/UserContext/UserProvider"
import { Outlet } from "react-router-dom"

export default function Root() {
  return (
    <AuthProvider>
      <UserProvider>
        <MembershipsProvider>
          <Outlet />
        </MembershipsProvider>
      </UserProvider>
    </AuthProvider>
  )
}