import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"

export default function OrganisationPage() {
  const { state: { organisation } } = useOrganisation()

  return (
    <div>Organisation: {JSON.stringify(organisation?.data() ?? {})}</div>
  )
}