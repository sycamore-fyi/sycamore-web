import OrganisationProvider from "@/contexts/OrganisationContext/OrganisationProvider";
import { Outlet } from "react-router-dom";

export default function OrganisationRoot() {
  return (
    <OrganisationProvider>
      <Outlet />
    </OrganisationProvider>
  )
}