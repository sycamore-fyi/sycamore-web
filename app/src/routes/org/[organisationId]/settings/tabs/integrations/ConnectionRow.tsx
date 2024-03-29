import { DocumentSnapshot, deleteDoc } from "firebase/firestore";
import { OauthConnection } from "@sycamore-fyi/shared";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { format } from "date-fns";
import { toHeaderCase } from "js-convert-case";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUpdateState } from "@/hooks/useUpdateState";
import { logoUrlFromIntegration } from "./logoUrlFromIntegration";
import { useClickProps } from "@/hooks/useClickProps";

export function ConnectionRow({ connection, isAdmin }: { connection: DocumentSnapshot<OauthConnection>; isAdmin: boolean; }) {
  const { integration, createdAt } = connection.data()!;

  const [state, updateState] = useUpdateState({
    open: false
  });

  const handleDeleteConnection = async () => {
    await deleteDoc(connection.ref)
  }

  const clickProps = useClickProps({
    onClick: handleDeleteConnection,
    buttonText: "Delete"
  })

  return (
    <div key={integration} className="flex items-center gap-4">
      <img alt={integration} src={logoUrlFromIntegration(integration)} className="w-6 h-6 rounded-sm" />
      <h4>{toHeaderCase(integration)}</h4>
      <div className="flex-grow" />
      <p>Connected {format(createdAt, "dd/MM/yyyy")}</p>
      {isAdmin
        ? (
          <AlertDialog open={state.open} onOpenChange={(isOpen) => updateState({ open: isOpen })}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="w-9 h-9 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="cursor-pointer hover:bg-slate-100">
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete integration
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>Deleting this integration will also delete all data associated with it. This action isn't reversible</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500"
                  {...clickProps}
                />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
        : null}
    </div>
  );
}
