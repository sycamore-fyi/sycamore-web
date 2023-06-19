import sycamoreLogo from "@/assets/logo.svg"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Building, LogOut, LucideChevronDown, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import UserAvatar from "./UserAvatar"
import { useUser } from "@/contexts/UserContext/UserContext"

export default function TopBar() {
  const { actions: { signOut } } = useAuth()
  const { state: { user } } = useUser()
  const userData = user?.data()
  const navigate = useNavigate()

  return (
    <div className="absolute w-full h-12 flex border-b-2 border-slate-100 flex-shrink-0">
      <Link to="/" className="flex gap-3 items-center w-64 h-full px-3 flex-shrink-0">
        <img className="h-8 w-8" src={sycamoreLogo} />
        <h2>Sycamore</h2>
      </Link>
      <div className="flex w-full bg-white">
        <div className="flex-grow"></div>
        {
          userData
            ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex h-full items-center px-3 gap-1 cursor-pointer">
                    <UserAvatar
                      name={userData.name}
                      photoUrl={userData.photoUrl}
                    />
                    <LucideChevronDown size={16} />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/org">
                    <DropdownMenuItem className="cursor-pointer">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Organisations</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut()
                      navigate("/")
                    }}
                    className="cursor-pointer"
                  >
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
    </div>
  )
}