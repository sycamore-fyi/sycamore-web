import sycamoreLogo from "@/assets/logo.svg"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { CreditCard, LogOut, LucideChevronDown, Mail, Plus, Settings, User, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

function getInitials(name: string) {
  return name.split(" ")
    .filter(n => n.length > 0)
    .map(n => n[0].toUpperCase())
    .join("")
}

export default function TopBar() {
  const {
    state: { authUser },
    actions: { signOut },
  } = useAuth()

  const navigate = useNavigate()

  return (
    <div className="h-12 fixed w-full flex">
      <Link to="/s/organisations" className="flex gap-3 items-center w-64 h-full px-3">
        <img className="h-8 w-8" src={sycamoreLogo} />
        <h2>Sycamore</h2>
      </Link>
      <div className="flex-grow"></div>
      {
        authUser
          ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex h-full items-center px-3 gap-1 cursor-pointer">
                  <Avatar className="items-center justify-center bg-purple-600">
                    <AvatarImage src={authUser.photoURL ?? undefined} />
                    <AvatarFallback className="text-white">{getInitials(authUser.displayName ?? "U")}</AvatarFallback>
                  </Avatar>
                  <LucideChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/s/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Team</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await signOut()
                  navigate("/")
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
          : (
            <Link to="/auth/log-in">
              <Button>Log in</Button>
            </Link>
          )
      }

    </div>
  )
}