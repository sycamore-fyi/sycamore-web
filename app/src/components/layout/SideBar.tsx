import { useUpdateState } from "@/hooks/useUpdateState"
import { cn } from "@/lib/utils"
import { ArrowLeft, Brain, Plus } from "lucide-react"
import { LucideIcon } from "lucide-react"
import { Mic, Settings } from "lucide-react"
import { Link, NavLink, To, useParams } from "react-router-dom"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Building } from "lucide-react"
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

function SideBarLink(props: { to: To, title: string, Icon: LucideIcon, isExpanded: boolean }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) => cn(
        "flex gap-2 h-12 items-center hover:opacity-60 px-4",
        isActive ? "bg-slate-200" : "",
        !props.isExpanded ? "justify-center" : "",
      )}
    >
      <props.Icon size={20} />
      {props.isExpanded ? props.title : null}
    </NavLink>
  )
}

interface Data {
  isExpanded: boolean
}

export default function SideBar() {
  const { organisationId } = useParams()
  const { state: { memberships } } = useMemberships()
  const activeMembership = memberships?.find(m => m.data()?.organisationId === organisationId)
  const activeMembershipData = activeMembership?.data()

  const [state, updateState] = useUpdateState<Data>({
    isExpanded: true
  })

  const ExpandIcon: LucideIcon = state.isExpanded ? ArrowLeft : ArrowRight

  return (
    <div className={cn(
      "bg-slate-50 border-r-2 border-slate-100 w-64 flex-shrink-0 flex flex-col",
      state.isExpanded ? "w-64" : "w-auto"
    )}>
      <div className="p-2">
        {
          activeMembershipData
            ? (

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={cn(
                    "bg-white border-2 border-slate-100 flex items-center h-10 rounded-md gap-2 cursor-pointer",
                    state.isExpanded ? "px-2" : "justify-center"
                  )}>
                    {state.isExpanded ? <Building className="h-5 w-5" /> : null}
                    <h4>
                      {state.isExpanded ? activeMembershipData.organisationName : activeMembershipData.organisationName[0].toUpperCase()}
                    </h4>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Your organisations</DropdownMenuLabel>
                  {
                    memberships?.map(membership => {
                      const { organisationId: mOrgId, organisationName } = membership.data()!
                      return (
                        <Link to={`/org/${mOrgId}`} key={membership.id}>
                          <DropdownMenuItem className={mOrgId === organisationId ? "bg-slate-100" : "cursor-pointer"}>
                            <Building className="mr-2 h-4 w-4" />
                            {organisationName}
                          </DropdownMenuItem>
                        </Link>
                      )
                    })
                  }
                  <DropdownMenuSeparator />
                  <Link to="/org/create">
                    <DropdownMenuItem className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      New organisation
                    </DropdownMenuItem>
                  </Link>

                </DropdownMenuContent>
              </DropdownMenu>

            )
            : <Skeleton className="h-6" />
        }

      </div>
      <SideBarLink
        to={`/org/${organisationId}/calls`}
        title="Calls"
        Icon={Mic}
        isExpanded={state.isExpanded}
      />
      <SideBarLink
        to={`/org/${organisationId}/assistant`}
        title="Assistant"
        Icon={Brain}
        isExpanded={state.isExpanded}
      />
      <SideBarLink
        to={`/org/${organisationId}/settings`}
        title="Settings"
        Icon={Settings}
        isExpanded={state.isExpanded}
      />
      <div className="flex-grow"></div>
      <div className={state.isExpanded ? "text-right" : "text-center"}>
        <Button
          className="p-0 h-12 w-12"
          variant="ghost"
          onClick={() => updateState({ isExpanded: !state.isExpanded })}
        >
          <ExpandIcon size={24} />
        </Button>
      </div>
    </div>
  )
}