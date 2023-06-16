import { Input } from "@/components/ui/input"
import { postServer } from "@/lib/callServer"
import { useNavigate } from "react-router-dom"
import { FormUtil } from "../../components/FormUtil"
import Container from "@/components/layout/Container"
import BackLink from "../../components/layout/BackLink"
import { organisationSchema } from "@/schemas/organisationSchema"
import { FormFieldUtil } from "@/components/FormFieldUtil"

export default function CreateOrganisationPage() {
  const navigate = useNavigate()

  return (
    <Container className="space-y-8 py-12">
      <BackLink to="/org">Back to organisations</BackLink>
      <h1>Create your organisation</h1>
      <FormUtil
        schema={organisationSchema}
        defaultValues={{ name: "" }}
        submitTitle="Create organisation"
        onSubmit={async (data) => {
          const res = await postServer("/organisations", data)
          const { organisationId } = res.data
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