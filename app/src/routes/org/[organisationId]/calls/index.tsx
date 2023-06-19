import Container from "@/components/layout/Container"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { useNavigate, useParams } from "react-router-dom"
import FileUploadDialog from "./FileUploadDialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { timeStringFromMs } from "./[callId]/timeStringFromMs"
import UserAvatar from "@/components/layout/UserAvatar"
import { Call, STANDARD_PLAN_TRANSCRIPTION_HOUR_LIMIT, calculateCurrentMonthStartDate } from "@sycamore-fyi/shared"
import { Progress } from "@/components/ui/progress"

function calculateCallHours(organisationCreatedAt: Date, userId: string, calls: Call[]) {
  const startOfMonth = calculateCurrentMonthStartDate(organisationCreatedAt)
  const userCallsInMonth = calls.filter(call => call.userId === userId && call.createdAt > startOfMonth)
  return userCallsInMonth.reduce((count, call) => count + (call.durationMs ?? 0) / (1000 * 60 * 60), 0)
}

export default function CallsPage() {
  const { state: { memberships, calls, organisation } } = useOrganisation()
  const { state: { authUser } } = useAuth()
  const { organisationId } = useParams()
  const navigate = useNavigate()

  const orgCreatedAt = organisation?.data()?.createdAt ?? new Date()

  const startOfMonth = calculateCurrentMonthStartDate(orgCreatedAt)

  const maxHours = STANDARD_PLAN_TRANSCRIPTION_HOUR_LIMIT
  const callHours = calculateCallHours(
    startOfMonth,
    authUser!.uid,
    calls?.map(call => call.data()!) ?? []
  )

  return (
    <Container className="space-y-4 py-12">
      <div className="flex items-center gap-4">
        <h1>Calls</h1>
        <div className="flex items-center gap-2">
          <Progress className="w-20" value={(callHours / maxHours) * 100} />
          <p><span className="font-semibold">{callHours.toFixed(1)}</span> / {maxHours} transcription hours used this month</p>
        </div>
        <div className="flex-grow"></div>
        <FileUploadDialog
          organisationId={organisationId!}
          userId={authUser!.uid!}
          isWithinLimit={callHours < maxHours}
        />
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