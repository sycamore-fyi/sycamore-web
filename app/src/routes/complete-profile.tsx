import Container from "@/components/layout/Container";
import { FormUtil } from "../components/FormUtil";
import { Input } from "@/components/ui/input";
import { updateDoc } from "firebase/firestore";
import { useUser } from "@/contexts/UserContext/UserContext";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useNavigate } from "react-router-dom";
import { FormFieldUtil } from "@/components/FormFieldUtil";
import { userSchema } from "@/schemas/userSchema";

export default function CompleteProfilePage() {
  const { state: { isLoading, user } } = useUser()
  const navigate = useNavigate()
  const { r } = useQueryParams()
  const returnPath = r ?? "/"

  if (isLoading || !user) return null

  return (
    <Container className="py-12 space-y-4">
      <h1>Complete your profile</h1>
      <FormUtil
        schema={userSchema}
        defaultValues={{ name: "" }}
        onSubmit={async ({ name }) => {
          await updateDoc(user.ref, { name })
          navigate(returnPath)
        }}
        submitTitle="Save"
        render={form => (
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