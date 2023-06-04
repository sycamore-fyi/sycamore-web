import { Input } from "@/components/ui/input"
import { postServer } from "@/lib/callServer"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { FormUtil } from "../auth/FormUtil"
import { FormFieldUtil } from "../auth/FormFieldUtil"

export default function CreateOrganisationPage() {
  const navigate = useNavigate()

  return (
    <div>
      Create organisation
      <FormUtil
        schema={z.object({
          name: z.string()
        })}
        defaultValues={{ name: "" }}
        submitTitle="Create organisation"
        onSubmit={async ({ name }) => {
          const res = await postServer("/organisations", { name })
          const { organisationId } = res.data
          navigate(`/organisations/${organisationId}`)
        }}
        render={form => (
          <FormFieldUtil
            control={form.control}
            name="name"
            render={({ field }) => <Input {...field} />}
          />
        )}
      />
    </div>
  )
}