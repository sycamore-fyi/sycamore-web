import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@fontsource-variable/jost';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Root from "./routes/root.tsx";
import HomePage from "./routes/home.tsx";
import SignUpPage from "./routes/auth/sign-up.tsx";
import LogInPage from "./routes/auth/log-in.tsx";
import TermsOfServicePage from "./routes/legal/terms-of-service.tsx";
import PrivacyPolicyPage from "./routes/legal/privacy-policy.tsx";
import EmailLinkPage from "./routes/auth/email-link.tsx";
import EmailLinkSentPage from "./routes/auth/email-link-sent.tsx";
import CreateOrganisationPage from "./routes/organisations/create.tsx";
import ListOrganisationsPage from "./routes/organisations/index.tsx";
import OrganisationPage from "./routes/organisations/organisation/index.tsx";
import OrganisationRoot from "./routes/organisations/organisation/OrganisationRoot.tsx";
import OrganisationsRoot from "./routes/organisations/OrganisationsRoot.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "auth/sign-up",
        element: <SignUpPage />
      },
      {
        path: "auth/log-in",
        element: <LogInPage />
      },
      {
        path: "auth/email-link",
        element: <EmailLinkPage />
      },
      {
        path: "auth/email-link-sent",
        element: <EmailLinkSentPage />
      },
      {
        path: "legal/terms-of-service",
        element: <TermsOfServicePage />
      },
      {
        path: "legal/privacy-policy",
        element: <PrivacyPolicyPage />
      },
      {
        path: "organisations/create",
        element: <CreateOrganisationPage />
      },
      {
        path: "organisations",
        element: <OrganisationsRoot />,
        children: [
          {
            index: true,
            element: <ListOrganisationsPage />
          }
        ]
      },
      {
        path: "organisations/:organisationId",
        element: <OrganisationRoot />,
        children: [
          {
            index: true,
            element: <OrganisationPage />
          }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
