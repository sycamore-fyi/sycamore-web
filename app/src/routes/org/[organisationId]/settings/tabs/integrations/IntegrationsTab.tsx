import { TabsContent } from "@/components/ui/tabs";
import { DocumentSnapshot } from "firebase/firestore";
import { OauthConnection } from "@sycamore-fyi/shared";
import { OauthServiceType } from "@sycamore-fyi/shared/build/enums/OauthServiceType";
import { IntegrationChecklistItem } from "./IntegrationChecklistItem";

interface Props {
  connections: DocumentSnapshot<OauthConnection>[],
  isAdmin: boolean,
}

export function IntegrationsTab({ connections, isAdmin }: Props) {
  return (
    <TabsContent value="integrations" className="space-y-4" >
      <h2>Your integrations</h2>
      {Object.values(OauthServiceType).map(serviceType => <IntegrationChecklistItem isAdmin={isAdmin} serviceType={serviceType} connections={connections} />)}
    </TabsContent >
  )
}