import Container from "@/components/layout/Container"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { useNavigate, useParams } from "react-router-dom"
import FileUploadDialog from "./FileUploadDialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { timeStringFromMs } from "./[callId]/timeStringFromMs"
import UserAvatar from "@/components/layout/UserAvatar"

export default function CallsPage() {
  const { state: { memberships, calls } } = useOrganisation()
  const { state: { authUser } } = useAuth()
  const { organisationId } = useParams()
  const navigate = useNavigate()

  return (
    <Container className="space-y-4 py-12">
      <div className="flex">
        <h1>Calls</h1>
        <div className="flex-grow"></div>
        <FileUploadDialog organisationId={organisationId!} userId={authUser!.uid!} />
      </div>

      <Table>
        {calls?.length === 0 ? <TableCaption>You have no calls yet.</TableCaption> : null}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Uploaded by</TableHead>
            <TableHead>Created time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls?.map(call => {
            const { createdAt, durationMs, userId } = call.data()!
            const membership = memberships?.find(membership => membership.data()?.userId === userId)
            const { userName, userPhotoUrl } = membership!.data()!

            return (
              <TableRow
                key={call.id}
                onClick={() => navigate(`/org/${organisationId}/calls/${call.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{call.id}</TableCell>
                <TableCell>{timeStringFromMs(durationMs!)}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <UserAvatar name={userName} photoUrl={userPhotoUrl} />
                  {userName}
                </TableCell>
                <TableCell>{format(createdAt, "dd/MM/yy")}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Container>
  )
}