import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganisationRole } from "@sycamore-fyi/shared";
import { Select } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { SelectGroup } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectLabel } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useSubmitProps } from "@/hooks/useClickProps";
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext";

const inviteItemSchema = z.object({
  role: z.nativeEnum(OrganisationRole),
  email: z.string().email()
})

const createInvitesSchema = z.object({
  invites: z.array(
    inviteItemSchema
  )
})

export type CreateInvite = z.infer<typeof createInvitesSchema>

export function InvitesDialog(props: { organisationId: string, maxInvites?: number }) {
  const { actions: { sendInvites } } = useOrganisation()
  const submitProps = useSubmitProps()
  const strongMaxInvites = props.maxInvites ?? 10
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(createInvitesSchema),
    defaultValues: {
      invites: [{
        role: OrganisationRole.ADMIN,
        email: ""
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invites",
    rules: {
      minLength: 1,
      maxLength: strongMaxInvites
    }
  });

  const generateDefaultInviteItem = () => ({
    role: OrganisationRole.ADMIN,
    email: ""
  });

  if (!props.maxInvites) return null

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) form.reset()
      }}
      open={open}
    >
      <DialogTrigger>
        <Button>Invite teammates</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammates</DialogTitle>
          <DialogDescription>We'll send each teammate an email with a link to join your organisation. They'll have to sign up using the email you specify. The link will expire in 24 hours.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="invite-users"
            onSubmit={form.handleSubmit(async (data) => {
              await sendInvites?.(data)
              setOpen(false)
            })}
            className="max-w-[480px] space-y-4"
          >
            {fields.map((field, index) => {
              const selectRegistration = form.register(`invites.${index}.role`);

              return (
                <div className="flex gap-2 items-center" key={field.id}>
                  <Input {...form.register(`invites.${index}.email`)} />
                  <Select {...selectRegistration} onValueChange={value => selectRegistration.onChange({ target: { name: selectRegistration.name, value } })} defaultValue={OrganisationRole.ADMIN}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value={OrganisationRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={OrganisationRole.MEMBER}>Member</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fields.length > 1
                    ? (
                      <Button variant="secondary" onClick={() => remove(index)}>
                        <X size={16} />
                      </Button>
                    )
                    : null}
                </div>
              );
            })}
            {fields.length < strongMaxInvites
              ? (
                <Button
                  onClick={() => append(generateDefaultInviteItem())}
                  variant="secondary"
                >
                  <Plus size={16} />
                </Button>
              )
              : null
            }
            <Button
              {...submitProps({ isLoading: form.formState.isSubmitting, buttonText: "Invite users" })}
              className="w-full"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
