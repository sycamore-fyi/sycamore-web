import { useUser } from "@/contexts/UserContext/UserContext"
import { FormUtil } from "../components/FormUtil"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import Container from "@/components/layout/Container"
import { userSchema } from "@/schemas/userSchema"
import { FormFieldUtil } from "@/components/FormFieldUtil"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useNavigate } from "react-router-dom"
import { useUpdateState } from "@/hooks/useUpdateState"
import { LoadingDashboard } from "./LoadingDashboard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useClickProps } from "@/hooks/useClickProps"

interface Data {
  isDeletingUser: boolean
}

export default function ProfilePage() {
  const { state: { user, isLoading: isLoadingUser }, actions: { update } } = useUser()
  const { state: { isLoading: isLoadingAuth }, actions: { deleteUser } } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const userData = user?.data()

  const handleDeleteAccount = async () => {
    await deleteUser()
    navigate("/auth/sign-up")
  }

  const clickProps = useClickProps({ onClick: handleDeleteAccount, buttonText: "Delete" })

  if (isLoadingUser || isLoadingAuth) return <LoadingDashboard />

  if (!user || !userData) throw new Error("no user")



  return (
    <Container className="py-12 space-y-12">
      <div className="space-y-4">
        <h1>Your profile</h1>
        <FormUtil
          schema={userSchema}
          onSubmit={async data => {
            await update?.(data)

            toast({
              title: "Profile updated",
              description: "Your edits were saved successfully"
            })
          }}
          defaultValues={{ name: userData.name ?? "" }}
          submitTitle="Save edits"
          successMessage="Profile updated"
          render={(form) => (
            <FormFieldUtil
              control={form.control}
              name="name"
              render={({ field }) => <Input {...field} />}
            />
          )}
        />
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>Deleting your account is non-reversible. You will have to request access to the organisations you have access to if you want to return to them.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400"
              {...clickProps}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}