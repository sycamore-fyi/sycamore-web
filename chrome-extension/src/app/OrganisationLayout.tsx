import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext/AuthContext";
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext";
import { useUser } from "@/contexts/UserContext/UserContext";
import { User } from "@sycamore-fyi/shared";
import { DocumentSnapshot } from "firebase/firestore";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { ReactNode } from "react";

function getInitials(name: string) {
  return name.split(" ")
    .filter(n => n.length > 0)
    .map(n => n[0].toUpperCase())
    .join("");
}

function UserAvatar({ user }: { user: DocumentSnapshot<User> }) {
  const { photoUrl, name } = user.data()!

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={photoUrl} />
      <AvatarFallback
        className="bg-purple-200 text-purple-600"
      >
        {getInitials(name ?? "Unknown")}
      </AvatarFallback>
    </Avatar>
  )
}

export default function OrganisationLayout({ children }: { children: ReactNode }) {
  const { state: { user } } = useUser()
  const { actions: { signOut } } = useAuth()
  const { state: { memberships, selectedMembership }, actions: { selectMembership } } = useMemberships()

  const orgName = memberships?.[0].data()?.organisationName ?? "Missing org name"

  return (
    <div className="flex flex-col">
      <div className="flex items-center h-12 px-2 border-slate-100 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">{orgName}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Switch organisation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              memberships?.map(membership => {
                const { organisationName } = membership.data()!
                return (
                  <DropdownMenuItem
                    key={membership.id}
                    onClick={() => selectMembership(membership.id)}
                    className={membership.id === selectedMembership?.id ? "bg-slate-100" : "cursor-pointer"}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    {organisationName}
                  </DropdownMenuItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-grow"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-full items-center gap-1 cursor-pointer hover:opacity-60">
              <UserAvatar user={user!} />
              <ChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.data()?.name ?? "My account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      {children}
    </div>
  )
}