import UserAvatar from "@/components/layout/UserAvatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { DocumentSnapshot } from "firebase/firestore";
import { toHeaderCase } from "js-convert-case";
import { InvitesDialog } from "./InvitesDialog";
import { FREE_PLAN_MEMBER_LIMIT, Invite, Membership, Organisation, OrganisationRole } from "@sycamore-fyi/shared";
import { Badge } from "@/components/ui/badge";
import { OrganisationPlanId } from "@sycamore-fyi/shared/build/enums/OrganisationPlanId";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUpdateState } from "@/hooks/useUpdateState";
import { Edit2, MoreHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useClickProps } from "@/hooks/useClickProps";
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormUtil } from "@/components/FormUtil";
import { z } from "zod";
import { FormFieldUtil } from "@/components/FormFieldUtil";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  isAdmin: boolean;
  organisation: DocumentSnapshot<Organisation>;
  memberships: DocumentSnapshot<Membership>[];
  pendingInvites: DocumentSnapshot<Invite>[];
  userId: string;
}

interface Data {
  membershipIdToDelete?: string,
  membershipIdToEditRole?: string,
  inviteIdToDelete?: string
}

export function TeamTab({ isAdmin, organisation, memberships, pendingInvites, userId }: Props) {
  const isStandardPlan = organisation.data()?.planId === OrganisationPlanId.STANDARD
  const membershipLimit = isStandardPlan ? undefined : FREE_PLAN_MEMBER_LIMIT
  const membershipCount = memberships.length + pendingInvites.length
  const maxInvites = isStandardPlan ? undefined : (membershipLimit ?? 0) - membershipCount
  const { actions: { removeMember, changeMemberRole, cancelInvite } } = useOrganisation()
  const [state, updateState] = useUpdateState<Data>({})

  const deleteMemberClickProps = useClickProps({
    async onClick() {
      const id = state.membershipIdToDelete
      if (!id || !removeMember) return
      await removeMember(id)
      updateState({ membershipIdToDelete: undefined })
    },
    buttonText: "Remove teammate"
  })

  const deleteInviteClickProps = useClickProps({
    async onClick() {
      const id = state.inviteIdToDelete
      if (!id || !cancelInvite) return
      await cancelInvite(id)
      updateState({ inviteIdToDelete: undefined })
    },
    buttonText: "Cancel invite"
  })

  return (
    <TabsContent value="team" className="space-y-12">
      <Dialog open={!!state.membershipIdToDelete} onOpenChange={open => {
        if (!open) updateState({ membershipIdToDelete: undefined })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>The user will lose access to the organisation. This action isn't reversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" {...deleteMemberClickProps}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!state.inviteIdToDelete} onOpenChange={open => {
        if (!open) updateState({ inviteIdToDelete: undefined })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" {...deleteInviteClickProps}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!state.membershipIdToEditRole} onOpenChange={open => {
        if (!open) updateState({ membershipIdToEditRole: undefined })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user role</DialogTitle>
          </DialogHeader>
          <FormUtil
            schema={z.object({
              role: z.nativeEnum(OrganisationRole)
            })}
            onSubmit={async ({ role }) => {
              const { membershipIdToEditRole: id } = state
              if (!id || !changeMemberRole) return
              await changeMemberRole(id, role)
              updateState({ membershipIdToEditRole: undefined })
            }}
            submitTitle="Change role"
            defaultValues={{ role: memberships.find(m => m.id === state.membershipIdToEditRole)?.data()?.role ?? OrganisationRole.ADMIN }}
            render={form => (
              <FormFieldUtil
                name="role"
                control={form.control}
                render={({ field }) => <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={OrganisationRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={OrganisationRole.MEMBER}>Member</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>}
              />
            )}
          />
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        <div className="flex items-center">
          <h2>Team members</h2>
          <div className="flex-grow"></div>
          {isAdmin && (!membershipLimit || membershipCount < membershipLimit) ? <InvitesDialog organisationId={organisation.id} maxInvites={maxInvites} /> : null}
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
            {memberships?.map(membership => {
              const { userName, userPhotoUrl, createdAt, role, userId: membershipUserId } = membership.data()!;
              return (
                <TableRow key={membership.id}>
                  <TableCell className="flex gap-4 items-center">
                    <UserAvatar name={userName} photoUrl={userPhotoUrl} />
                    {userName}
                    {membershipUserId === userId ? <Badge>You</Badge> : null}
                  </TableCell>
                  <TableCell>{toHeaderCase(role)}</TableCell>
                  <TableCell>
                    {format(createdAt, "dd/MM/yyyy")}
                  </TableCell>
                  {
                    membershipUserId !== userId && isAdmin
                      ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => updateState({ membershipIdToEditRole: membership.id })}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Change role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => updateState({ membershipIdToDelete: membership.id })}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null
                  }


                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {
          membershipLimit
            ? (
              <div className="flex gap-2 items-center">
                <Progress className="w-20" value={(membershipCount / membershipLimit) * 100} />
                <p><span className="font-semibold">{membershipCount}</span> / {membershipLimit} members</p>
                <div className="flex-grow"></div>
                {/* <p>Need more team members?</p>
              <Button>Upgrade</Button> */}
              </div>
            )
            : null
        }
      </div>
      <div className="space-y-4">
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
            {pendingInvites?.map(invite => {
              const { createdAt, email, role, invitingUserId } = invite.data()!;
              const invitingUserMembership = memberships?.find(m => m.data()?.userId === invitingUserId);
              const { userName, userPhotoUrl } = invitingUserMembership!.data()!;

              return (
                <TableRow>
                  <TableCell>{email}</TableCell>
                  <TableCell>{toHeaderCase(role)}</TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <UserAvatar name={userName} photoUrl={userPhotoUrl} />
                    <span>{userName}</span>
                  </TableCell>
                  <TableCell>{format(createdAt, "dd/MM/yyyy")}</TableCell>
                  {
                    isAdmin
                      ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button size="icon" variant="ghost">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => updateState({ inviteIdToDelete: invite.id })}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel invite
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                      : null
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}
