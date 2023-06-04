import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useUser } from "@/contexts/UserContext/UserContext"
import { useComplexNavigate } from "@/hooks/useComplexNavigate"

export default function HomePage() {
  const {
    state: { authUser },
    actions: { signOut }
  } = useAuth()

  const navigate = useComplexNavigate()

  const { state: { user } } = useUser()

  return (
    <div className="space-y-2">
      {authUser ? "You're logged in" : "You're not logged in"}
      {user?.exists() ? JSON.stringify(user.data()) : "user not found"}
      {
        authUser
          ? <Button onClick={signOut}>Sign out</Button>
          : (
            <div className="flex gap-x-2">
              <Button onClick={() => navigate({ path: "/auth/sign-up", query: { r: "/legal/privacy-policy" } })}>Sign up</Button>
              <Button onClick={() => navigate({ path: "/auth/log-in", query: { r: "/legal/privacy-policy" } })}>Log in</Button>
            </div>
          )
      }
    </div>
  )
}