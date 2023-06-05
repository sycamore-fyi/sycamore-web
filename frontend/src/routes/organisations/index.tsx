import { Button } from "@/components/ui/button";
import { useOrganisations } from "@/contexts/OrganisationsContext/OrganisationsContext";
import { Link } from "react-router-dom";

export default function ListOrganisationsPage() {
  const { state: { organisations } } = useOrganisations()

  return <div className="pt-12">
    List organisations
    {
      organisations?.map(organisation => (
        <Link
          to={`/s/organisations/${organisation.id}`}
          key={organisation.id}
        >
          {JSON.stringify(organisation.data() ?? {})}
        </Link>
      ))
    }
    <Link to="/s/organisations/create">
      <Button>Create organisation</Button>
    </Link>
  </div>
}