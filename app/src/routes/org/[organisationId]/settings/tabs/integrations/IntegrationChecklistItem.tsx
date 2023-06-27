import { DocumentSnapshot } from "firebase/firestore";
import { OauthConnection, OauthIntegration } from "@sycamore-fyi/shared";
import { OauthServiceType } from "@sycamore-fyi/shared/build/enums/OauthServiceType";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConnectIntegrationRow } from "./ConnectIntegrationRow";
import { ConnectionRow } from "./ConnectionRow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toHeaderCase, toTextCase } from "js-convert-case";

const integrationChecklistData = {
  [OauthServiceType.CRM]: {
    title: "CRM",
    body: "Connect your CRM (Salesforce, Hubspot etc) to sync your calls and meetings to Sycamore. You'll then be able to select which calls you want analysed.",
    integrations: [OauthIntegration.HUBSPOT, OauthIntegration.SALESFORCE]
  },
  [OauthServiceType.INSTANT_MESSAGE_TOOL]: {
    title: "Instant messaging",
    body: "Connect your instant messaging tool (Slack, Microsoft Teams etc) to send conversations with clients in shared channels to Sycamore. You'll be able to analyse the feedback you're getting by instant message from clients.",
    integrations: [OauthIntegration.SLACK],
  },
  [OauthServiceType.MEETING_TOOL]: {
    title: "Web conferencing",
    body: "Connect your web conferencing tool (Zoom, Google Meet etc) to sync meeting recordings with Sycamore. You'll then be able to select the recordings you want transcribed and analysed.",
    integrations: [OauthIntegration.ZOOM]
  }
}

export function IntegrationChecklistItem({ serviceType, connections, isAdmin }: { serviceType: OauthServiceType; connections: DocumentSnapshot<OauthConnection>[]; isAdmin: boolean; }) {
  const filteredConnections = connections.filter(c => c.data()?.serviceType === serviceType);
  const existingIntegrations = filteredConnections.map(c => c.data()?.integration).filter(i => !!i) as OauthIntegration[];
  const isComplete = filteredConnections.length > 0;
  const { title, body, integrations } = integrationChecklistData[serviceType];
  return <Card
    key={serviceType}
    className=""
  >
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{body}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {
        filteredConnections.length > 0
          ? filteredConnections.map(connection => (
            <ConnectionRow
              connection={connection}
              isAdmin={isAdmin}
            />
          ))
          : (
            <Alert className="bg-slate-100 border-0">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not connected</AlertTitle>
              <AlertDescription>Connecting your CRM helps you keep track of what calls are in your knowledge base.</AlertDescription>
            </Alert>
          )
      }
    </CardContent>
    <CardFooter>
      <Dialog>
        <DialogTrigger>
          <Button variant={isComplete ? "secondary" : "default"}>
            {isComplete ? "Connect another" : "Connect"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect your {toTextCase(title)} tool</DialogTitle>
            <DialogDescription>{body}</DialogDescription>
          </DialogHeader>
          <div>
            {integrations.filter(i => !existingIntegrations.includes(i)).map(integration => <ConnectIntegrationRow integration={integration} />)}
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>;
}
