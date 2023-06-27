import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { FormUtil } from "@/components/FormUtil";
import { DocumentSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { z } from "zod";
import { FormFieldUtil } from "@/components/FormFieldUtil";
import { Organisation } from "@sycamore-fyi/shared";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useClickProps } from "@/hooks/useClickProps";
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext";

interface Props {
  isAdmin: boolean,
  organisation: DocumentSnapshot<Organisation>
}

export type Promisify<T extends (...args: any[]) => any> =
  T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : never;




export function DetailsTab({ isAdmin, organisation }: Props) {
  const orgData = organisation.data()!;
  const { actions: { deleteOrg } } = useOrganisation();
  const navigate = useNavigate()

  const handleDeleteOrganisation = async () => {
    await deleteOrg?.()
    navigate("/org")
  }

  const clickProps = useClickProps({
    onClick: handleDeleteOrganisation,
    buttonText: "Delete"
  })

  return (
    <TabsContent value="details" className="space-y-12">
      <div className="space-y-4">
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
          successMessage="Organisation updated"
          render={form => (
            <FormFieldUtil
              control={form.control}
              name="name"
              render={({ field }) => <Input {...field} disabled={!isAdmin} />} />
          )} />
      </div>

      {
        isAdmin
          ? (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Delete organisation</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>If you delete your organisation, all your team members will lose access to Sycamore, and all your recordings will be lost. This action is not reversible.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction {...clickProps} className="bg-red-500 hover:bg-red-400" />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
          : null
      }
    </TabsContent>
  );
}
