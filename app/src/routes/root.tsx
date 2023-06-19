import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import AuthProvider from "@/contexts/AuthContext/AuthProvider"
import MembershipsProvider from "@/contexts/MembershipsContext/MembershipsProvider"
import UserProvider from "@/contexts/UserContext/UserProvider"
import { Outlet } from "react-router-dom"

export default function Root() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <UserProvider>
          <MembershipsProvider>
            <Outlet />
            <Toaster />
          </MembershipsProvider>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>

  )
}