import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { FormUtil } from "@/components/FormUtil";
import { DocumentSnapshot, updateDoc } from "firebase/firestore";
import { z } from "zod";
import { FormFieldUtil } from "@/components/FormFieldUtil";
import { Organisation } from "@sycamore-fyi/shared";

interface Props {
  isAdmin: boolean,
  organisation: DocumentSnapshot<Organisation>
}

export function DetailsTab({ isAdmin, organisation }: Props) {
  const orgData = organisation.data()!;

  return (
    <TabsContent value="details" className="space-y-4">
      <h2>Organisation details</h2>
      {!isAdmin ? <p>Only admins can edit organisation details.</p> : null}
      <FormUtil
        schema={z.object({
          name: z.string().nonempty()
        })}
        disabled={!isAdmin}
        defaultValues={{
          name: orgData.name
        }}
        onSubmit={async (data) => {
          await updateDoc(organisation.ref, data);
        }}
        submitTitle="Save changes"
        render={form => (
          <FormFieldUtil
            control={form.control}
            name="name"
            render={({ field }) => <Input {...field} disabled={!isAdmin} />} />
        )} />
    </TabsContent>
  );
}
