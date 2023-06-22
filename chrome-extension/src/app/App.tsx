import AuthProvider from "@/contexts/AuthContext/AuthProvider";
import UserProvider from "@/contexts/UserContext/UserProvider";
import React from "react";
import UserGuard from "./UserGuard";
import MembershipsProvider from "@/contexts/MembershipsContext/MembershipsProvider";
import MembershipGuard from "./MembershipGuard";
import OrganisationLayout from "./OrganisationLayout";
import RecordingPage from "./RecordingPage";

export default function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <UserProvider>
          <UserGuard>
            <MembershipsProvider>
              <MembershipGuard>
                <OrganisationLayout>
                  <RecordingPage />
                </OrganisationLayout>
              </MembershipGuard>
            </MembershipsProvider>
          </UserGuard>
        </UserProvider>
      </AuthProvider>
    </React.StrictMode>
  )
}
