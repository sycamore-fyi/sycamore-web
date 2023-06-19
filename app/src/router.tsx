import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import SignUpPage from "./routes/auth/sign-up.tsx";
import LogInPage from "./routes/auth/log-in.tsx";
import TermsOfServicePage from "./routes/legal/terms-of-service.tsx";
import PrivacyPolicyPage from "./routes/legal/privacy-policy.tsx";
import EmailLinkPage from "./routes/auth/email-link.tsx";
import EmailLinkSentPage from "./routes/auth/email-link-sent.tsx";
import CreateOrganisationPage from "./routes/org/create.tsx";
import ListOrganisationsPage from "./routes/org/index.tsx";
import CallsPage from "./routes/org/[organisationId]/calls/index.tsx";
import OrganisationRoot from "./routes/org/[organisationId]/OrganisationRoot.tsx";
import OrganisationsRoot from "./routes/org/OrganisationsRoot.tsx";
import ProfilePage from "./routes/profile.tsx";
import AuthGuard from "./routes/AuthGuard.tsx";
import CallRoot from "./routes/org/[organisationId]/calls/[callId]/CallRoot.tsx";
import CallPage from "./routes/org/[organisationId]/calls/[callId]/index.tsx";
import HomePage from "./routes/home.tsx";
import Root from "./routes/root.tsx";
import SettingsPage from "./routes/org/[organisationId]/settings/index.tsx";
import AcceptInvitePage from "./routes/invites/[inviteId]/accept.tsx";
import { UserGuard } from "./routes/UserGuard.tsx";
import CompleteProfilePage from "./routes/complete-profile.tsx";
import AssistantPage from "./routes/org/[organisationId]/assistant/index.tsx";
import OauthRedirectPage from "./routes/oauth/[integration]/index.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth/sign-up", element: <SignUpPage /> },
      { path: "auth/log-in", element: <LogInPage /> },
      { path: "auth/email-link", element: <EmailLinkPage /> },
      { path: "auth/email-link-sent", element: <EmailLinkSentPage /> },
      { path: "legal/terms-of-service", element: <TermsOfServicePage /> },
      { path: "oauth/:integration", element: <OauthRedirectPage /> },
      { path: "legal/privacy-policy", element: <PrivacyPolicyPage /> },
      {
        path: "complete-profile",
        element: (
          <AuthGuard>
            <CompleteProfilePage />
          </AuthGuard>
        )
      },
      {
        path: "profile",
        element: (
          <AuthGuard>
            <UserGuard>
              <ProfilePage />
            </UserGuard>
          </AuthGuard>
        )
      },
      {
        path: "invites/:inviteId/accept",
        element: (
          <AuthGuard>
            <UserGuard>
              <AcceptInvitePage />
            </UserGuard>
          </AuthGuard>
        )
      },
      {
        path: "org",
        element: (
          <AuthGuard>
            <UserGuard>
              <OrganisationsRoot />
            </UserGuard>
          </AuthGuard>
        ),
        children: [
          { index: true, element: <ListOrganisationsPage /> },
          { path: "create", element: <CreateOrganisationPage /> },
          {
            path: ":organisationId",
            element: <OrganisationRoot />,
            children: [
              { index: true, element: <CallsPage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "calls", element: <CallsPage /> },
              { path: "assistant", element: <AssistantPage /> },
              {
                path: "calls/:callId",
                element: <CallRoot />,
                children: [
                  {
                    index: true,
                    element: <CallPage />
                  }
                ]
              }
            ]
          },
        ]
      },
    ]
  },
]);