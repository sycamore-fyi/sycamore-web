import { Outlet } from "react-router-dom"

function Sidebar() {
  return (
    <div className="bg-gray-100 w-64 h-full">

    </div>
  )
}

export default function Root() {

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <Outlet />
    </div>
  )
}