import Container from "@/components/layout/Container"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { useNavigate, useParams } from "react-router-dom"
import FileUploadDialog from "./FileUploadDialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { timeStringFromMs } from "./[recordingId]/timeStringFromMs"
import UserAvatar from "@/components/layout/UserAvatar"

export default function RecordingsPage() {
  const { state: { organisation, memberships, recordings } } = useOrganisation()
  const { state: { authUser } } = useAuth()
  const { organisationId } = useParams()
  const navigate = useNavigate()

  return (
    <Container className="space-y-4 py-12">
      <div className="flex">
        <h1>Recordings</h1>
        <div className="flex-grow"></div>
        <FileUploadDialog organisationId={organisationId!} userId={authUser!.uid!} />
      </div>

      <Table>
        {recordings?.length === 0 ? <TableCaption>You have no recordings yet.</TableCaption> : null}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Uploaded by</TableHead>
            <TableHead>Created time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordings?.map(recording => {
            const { createdAt, durationMs, userId } = recording.data()!
            const membership = memberships?.find(membership => membership.data()?.userId === userId)
            const { userName, userPhotoUrl } = membership!.data()!

            return (
              <TableRow
                key={recording.id}
                onClick={() => navigate(`/org/${organisationId}/recordings/${recording.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{recording.id}</TableCell>
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