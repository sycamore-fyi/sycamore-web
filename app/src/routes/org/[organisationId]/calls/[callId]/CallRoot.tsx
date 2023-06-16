import CallProvider from "@/contexts/CallContext/CallProvider";
import { Outlet } from "react-router-dom";

export default function CallRoot() {
  return (
    <CallProvider>
      <Outlet />
    </CallProvider>
  )
}