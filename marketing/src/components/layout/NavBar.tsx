import { Button } from "@/components/ui/button";
import { dashboardLink, getStartedLink } from "@/lib/links";
import Link from "next/link";
import MobileNavMenu from "./MobileNavMenu";

export default function NavBar() {
  return (
    <div className="fixed w-full top-0 h-16 bg-white px-4 flex items-center">
      <Link href="/" className="flex items-center flex-shrink-0 gap-2">
        <img src="/logo.svg" className="h-8 w-8" alt="" />
        <h2>Sycamore</h2>
      </Link>
      <div className="flex-grow"></div>
      <div className=" gap-2 hidden sm:flex">
        <Link href={getStartedLink}>
          <Button>Get started</Button>
        </Link>
        <Link href={dashboardLink}>
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
      <MobileNavMenu />
    </div>
  )
}