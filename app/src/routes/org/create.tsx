import { Input } from "@/components/ui/input"
import { postServer } from "@/lib/callServer"
import { useNavigate } from "react-router-dom"
import { FormUtil } from "../../components/FormUtil"
import Container from "@/components/layout/Container"
import BackLink from "../../components/layout/BackLink"
import { organisationSchema } from "@/schemas/organisationSchema"
import { FormFieldUtil } from "@/components/FormFieldUtil"
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext"

export default function CreateOrganisationPage() {
  const navigate = useNavigate()
  const { actions: { create } } = useMemberships()

  return (
    <Container className="space-y-8 py-12">
      <BackLink to="/org">Back to organisations</BackLink>
      <h1>Create your organisation</h1>
      <FormUtil
        schema={organisationSchema}
        defaultValues={{ name: "" }}
        submitTitle="Create organisation"
        successMessage="Organisation created successfully"
        onSubmit={async (data) => {
          if (!create) return
          const { organisationId } = await create(data)
          navigate(`/org/${organisationId}`)
        }}
        render={form => (
          <FormFieldUtil
            control={form.control}
            name="name"
            render={({ field }) => <Input {...field} />}
          />
        )}
      />
    </Container>
  )
}