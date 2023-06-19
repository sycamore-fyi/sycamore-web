import { useUser } from "@/contexts/UserContext/UserContext"
import { FormUtil } from "../components/FormUtil"
import { Collection } from "@/lib/firebase/Collection"
import { doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import Container from "@/components/layout/Container"
import { userSchema } from "@/schemas/userSchema"
import { FormFieldUtil } from "@/components/FormFieldUtil"

export default function ProfilePage() {
  const { state: { user, isLoading } } = useUser()
  const { toast } = useToast()

  const userData = user?.data()

  if (isLoading) return <p>Loading</p>

  if (!user || !userData) throw new Error("no user")

  return (
    <Container className="py-12 space-y-4">
      <h1>Your profile</h1>
      <FormUtil
        schema={userSchema}
        onSubmit={async data => {
          await updateDoc(
            doc(Collection.User, user.id),
            data
          )

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
    </Container>
  )
}