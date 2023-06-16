import Container from "@/components/layout/Container"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { OrganisationRole } from "@sycamore-fyi/shared"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { DetailsTab } from "./tabs/DetailsTab"
import { BillingTab } from "./tabs/BillingTab"
import { TeamTab } from "./tabs/TeamTab"
import { IntegrationsTab } from "./tabs/IntegrationsTab"

export default function SettingsPage() {
  const { state: { organisation, memberships, userMembership, invites, isLoading } } = useOrganisation()
  const { state: { authUser } } = useAuth()
  const isAdmin = userMembership?.data()?.role === OrganisationRole.ADMIN
  const orgData = organisation?.data()
  if (isLoading || !organisation || !orgData || !invites || !memberships || !authUser) return null

  const pendingInvites = invites?.filter(i => {
    const data = i.data()
    if (!data) return false
    return (!data.isAccepted && !data.isCancelled)
  })

  const userId = authUser.uid

  return <ScrollArea className="h-full">
    <Container className="space-y-8 py-12">
      <h1>Settings</h1>
      <Tabs className="w-full space-y-8" defaultValue="details">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <DetailsTab organisation={organisation} isAdmin={isAdmin} />
        <TeamTab
          organisation={organisation}
          isAdmin={isAdmin}
          memberships={memberships}
          pendingInvites={pendingInvites}
          userId={userId}
        />
        <IntegrationsTab />
        <BillingTab />
      </Tabs>
    </Container>
  </ScrollArea>

}