import SideBar from "@/components/layout/SideBar";
import OrganisationProvider from "@/contexts/OrganisationContext/OrganisationProvider";
import { Outlet } from "react-router-dom";

export default function OrganisationRoot() {
  return (
    <OrganisationProvider>
      <div className="flex h-full">
        <SideBar />
        <div className="flex-grow h-full">
          <Outlet />
        </div>
      </div>
    </OrganisationProvider>
  )
}