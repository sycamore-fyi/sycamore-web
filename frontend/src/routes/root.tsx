import AuthProvider from "@/contexts/AuthContext/AuthProvider"
import UserProvider from "@/contexts/UserContext/UserProvider"
import { Outlet } from "react-router-dom"

export default function Root() {
  return (
    <div className="h-full min-h-screen">
      <AuthProvider>
        <UserProvider>
          <Outlet />
        </UserProvider>
      </AuthProvider>
    </div>
  )
}