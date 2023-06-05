import { useUser } from "@/contexts/UserContext/UserContext"
import { FormUtil } from "./auth/FormUtil"
import { FormFieldUtil } from "./auth/FormFieldUtil"
import { z } from "zod"
import { Collection } from "@/lib/firebase/Collection"
import { doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const { state: { user, isLoading } } = useUser()
  const { toast } = useToast()

  const userData = user?.data()

  if (isLoading) return <p>Loading</p>

  if (!user || !userData) throw new Error("no user")

  return (
    <div>
      {JSON.stringify(user?.data() ?? {})}
      <FormUtil
        schema={z.object({
          name: z.string()
        })}
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
        defaultValues={{
          name: userData.name ?? ""
        }}

        submitTitle="Save edits"
        render={(form) => (
          <>
            <FormFieldUtil
              control={form.control}
              name="name"
              render={({ field }) => <Input {...field} />}
            />
          </>
        )}
      />
    </div>
  )
}