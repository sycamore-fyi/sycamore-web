import OrganisationsProvider from "@/contexts/OrganisationsContext/OrganisationsProvider";
import { Outlet } from "react-router-dom";

export default function OrganisationsRoot() {
  return (
    <OrganisationsProvider>
      <Outlet />
    </OrganisationsProvider>
  )
}