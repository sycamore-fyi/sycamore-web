import { Button } from "@/components/ui/button";
import { useOrganisations } from "@/contexts/OrganisationsContext/OrganisationsContext";
import { Link } from "react-router-dom";

export default function ListOrganisationsPage() {
  const { state: { organisations } } = useOrganisations()

  return <div>
    List organisations
    {
      organisations?.map(organisation => (
        <Link
          to={`/organisations/${organisation.id}`}
          key={organisation.id}
        >
          {JSON.stringify(organisation.data() ?? {})}
        </Link>
      ))
    }
    <Link to="/organisations/create">
      <Button>Create organisation</Button>
    </Link>
  </div>
}