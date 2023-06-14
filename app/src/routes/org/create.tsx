import { Input } from "@/components/ui/input"
import { postServer } from "@/lib/callServer"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { FormUtil } from "../auth/FormUtil"
import { FormFieldUtil } from "../auth/FormFieldUtil"
import Container from "@/components/layout/Container"
import BackLink from "../../components/layout/BackLink"
import { useAuth } from "@/contexts/AuthContext/AuthContext"

export default function CreateOrganisationPage() {
  const navigate = useNavigate()

  return (
    <Container className="space-y-8 py-12">
      <BackLink to="/org">Back to organisations</BackLink>
      <h1>Create your organisation</h1>
      <FormUtil
        schema={z.object({
          name: z.string()
        })}
        defaultValues={{ name: "" }}
        submitTitle="Create organisation"
        onSubmit={async ({ name }) => {
          const res = await postServer("/organisations", { name })
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