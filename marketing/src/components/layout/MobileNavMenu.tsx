"use client"

import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { dashboardLink, getStartedLink } from "@/lib/links";

export default function MobileNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="sm:hidden w-10 h-10 flex items-center justify-center">
        <Menu size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <Link href={getStartedLink}>
          <DropdownMenuItem className="cursor-pointer">
            Get started
          </DropdownMenuItem>
        </Link>
        <Link href={dashboardLink}>
          <DropdownMenuItem className="cursor-pointer">
            Dashboard
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}