import UserAvatar from "@/components/layout/UserAvatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { DocumentSnapshot } from "firebase/firestore";
import { toHeaderCase } from "js-convert-case";
import { InvitesDialog } from "../InvitesDialog";
import { FREE_PLAN_MEMBER_LIMIT, Invite, Membership, Organisation } from "@sycamore-fyi/shared";
import { Badge } from "@/components/ui/badge";
import { OrganisationPlanId } from "@sycamore-fyi/shared/build/enums/OrganisationPlanId";

interface Props {
  isAdmin: boolean;
  organisation: DocumentSnapshot<Organisation>;
  memberships: DocumentSnapshot<Membership>[];
  pendingInvites: DocumentSnapshot<Invite>[];
  userId: string;
}

export function TeamTab({ isAdmin, organisation, memberships, pendingInvites, userId }: Props) {
  const maxInvites = organisation.data()?.planId === OrganisationPlanId.STANDARD
    ? undefined
    : FREE_PLAN_MEMBER_LIMIT - memberships.length - pendingInvites.length
  return (
    <TabsContent value="team" className="space-y-4">
      <div className="flex items-center">
        <h2>Team members</h2>
        <div className="flex-grow"></div>
        {isAdmin ? <InvitesDialog organisationId={organisation.id} maxInvites={maxInvites} /> : null}
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
                <TableCell>{format(createdAt, "dd/MM/yyyy")}</TableCell>
              </TableRow>
            );
          })}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TabsContent>
  );
}
