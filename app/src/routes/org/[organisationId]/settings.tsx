import Container from "@/components/layout/Container"
import UserAvatar from "@/components/layout/UserAvatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { FormFieldUtil } from "@/routes/auth/FormFieldUtil"
import { FormUtil } from "@/routes/auth/FormUtil"
import { format } from "date-fns"
import { updateDoc } from "firebase/firestore"
import { z } from "zod"
import { toHeaderCase } from "js-convert-case"
import { InvitesDialog } from "./InvitesDialog"
import { OrganisationRole } from "@sycamore-fyi/shared"

export default function SettingsPage() {
  const { state: { organisation, memberships, userMembership, invites, isLoading } } = useOrganisation()
  const isAdmin = userMembership?.data()?.role === OrganisationRole.ADMIN
  const orgData = organisation?.data()
  if (isLoading || !orgData) return null

  const pendingInvites = invites?.filter(i => {
    const data = i.data()
    if (!data) return false
    return (!data.isAccepted && !data.isCancelled)
  })

  return <ScrollArea className="h-full">
    <Container className="space-y-8 py-12">
      <h1>Settings</h1>
      <Tabs className="w-full space-y-8" defaultValue="details">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <h2>Organisation details</h2>
          {!isAdmin ? <p>Only admins can edit organisation details.</p> : null}
          <FormUtil
            schema={z.object({
              name: z.string()
            })}
            disabled={!isAdmin}
            defaultValues={{
              name: orgData.name
            }}
            onSubmit={async data => {
              await updateDoc(organisation!.ref, data)
            }}
            submitTitle="Save changes"
            render={form => (
              <FormFieldUtil
                control={form.control}
                name="name"
                render={({ field }) => <Input {...field} disabled={!isAdmin} />}
              />
            )}
          />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center">
            <h2>Team members</h2>
            <div className="flex-grow"></div>
            {isAdmin ? <InvitesDialog organisationId={organisation!.id} /> : null}
          </div>
          <Table>
            {memberships?.length === 0 ? <TableCaption>No memberships</TableCaption> : null}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                memberships?.map(membership => {
                  const { userName, userPhotoUrl, createdAt, role } = membership.data()!
                  return (
                    <TableRow>
                      <TableCell className="flex gap-2 items-center">
                        <UserAvatar name={userName} photoUrl={userPhotoUrl} />
                        {userName}
                      </TableCell>
                      <TableCell>{toHeaderCase(role)}</TableCell>
                      <TableCell>{format(createdAt, "dd/MM/yyyy")}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <h2>Pending invites</h2>
          <Table>
            {pendingInvites?.length === 0 ? <TableCaption>No pending invites</TableCaption> : null}
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited by</TableHead>
                <TableHead>Invited at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                pendingInvites?.map(invite => {
                  const { createdAt, email, role, invitingUserId } = invite.data()!
                  const invitingUserMembership = memberships?.find(m => m.data()?.userId === invitingUserId)
                  const { userName, userPhotoUrl } = invitingUserMembership!.data()!

                  return (
                    <TableRow>
                      <TableCell>{email}</TableCell>
                      <TableCell>{toHeaderCase(role)}</TableCell>
                      <TableCell className="flex gap-2 items-center">
                        <UserAvatar name={userName} photoUrl={userPhotoUrl} />
                        <span>{userName}</span>
                      </TableCell>
                      <TableCell>{format(createdAt, "dd/MM/yyyy")}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <h2>Billing</h2>
          <p>You're on the free plan.</p>
        </TabsContent>
      </Tabs>
    </Container>
  </ScrollArea>

}