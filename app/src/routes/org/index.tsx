import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext";
import { Membership } from "@sycamore-fyi/shared";
import { format } from "date-fns";
import { DocumentSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

function MembershipTile({ membership }: { membership: DocumentSnapshot<Membership> }) {
  const data = membership.data()
  if (!data) return null
  const { createdAt, organisationId, organisationName } = data

  return (
    <Link
      to={`/org/${organisationId}`}
      className="bg-slate-100 hover:bg-slate-200 rounded-lg p-8 space-y-2"
      key={membership.id}
    >
      <h3>{organisationName}</h3>
      <p className="text-slate-500">Joined {format(createdAt, "d MMM yyyy")}</p>
    </Link>
  )
}

export default function ListOrganisationsPage() {
  const { state: { memberships } } = useMemberships()

  return <Container className="py-12 space-y-8">
    <div className="flex items-center">
      <h1>Your organisations</h1>
      <div className="flex-grow"></div>
      <Link to="/org/create">
        <Button>Create organisation</Button>
      </Link>
    </div>
    {
      memberships && memberships?.length > 0
        ? (
          <div className="grid grid-cols-2 gap-8">
            {memberships?.map(membership => <MembershipTile membership={membership} />)}
          </div>
        )
        : (
          <p>
            {`You're not a member of any organisations yet. Create one `}
            <Link to="/org/create" className="font-semibold text-indigo-500 hover:opacity-60">here</Link>
            .
          </p>
        )
    }

  </Container>
}