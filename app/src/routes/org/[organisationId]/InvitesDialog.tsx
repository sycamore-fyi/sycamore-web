import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { postServer } from "@/lib/callServer";
import { useState } from "react";

export function InvitesDialog(props: { organisationId: string; }) {
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(z.object({
      invites: z.array(
        z.object({
          role: z.enum([OrganisationRole.ADMIN, OrganisationRole.MEMBER]),
          email: z.string().email()
        })
      )
    })),
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
      maxLength: 10
    }
  });

  const generateDefaultInviteItem = () => ({
    role: OrganisationRole.ADMIN,
    email: ""
  });

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
            onSubmit={form.handleSubmit(async ({ invites }) => {
              await postServer(`/organisations/${props.organisationId}/invites`, {
                inviteItems: invites
              });
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
            {fields.length < 10
              ? (
                <Button
                  onClick={() => append(generateDefaultInviteItem())}
                  variant="secondary"
                >
                  <Plus size={16} />
                </Button>
              )
              : null}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="invite-users">Invite users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
