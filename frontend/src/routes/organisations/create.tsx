import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { postServer } from "@/lib/callServer"
import { zodResolver } from "@hookform/resolvers/zod"
import { Environment } from "@sycamore-fyi/shared"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const createOrgFormSchema = z.object({
  name: z.string()
})

type CreateOrgFormData = z.infer<typeof createOrgFormSchema>

export default function CreateOrganisationPage() {
  const emailLinkForm = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgFormSchema),
    defaultValues: {
      name: "",
    },
  })

  console.log(Environment)


  const navigate = useNavigate()

  const onSubmitCreateOrgForm = async ({ name }: CreateOrgFormData) => {
    const res = await postServer("/organisations", {
      name
    })

    const { organisationId } = res.data

    navigate(`/organisations/${organisationId}`)
  }

  return (
    <div>
      Create organisation
      <Form {...emailLinkForm}>
        <form onSubmit={emailLinkForm.handleSubmit(onSubmitCreateOrgForm)} className="space-y-4">
          <FormField
            control={emailLinkForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Create organisation
          </Button>
        </form>
      </Form>
    </div>
  )
}