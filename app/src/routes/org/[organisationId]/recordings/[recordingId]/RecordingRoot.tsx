import RecordingProvider from "@/contexts/RecordingContext/RecordingProvider";
import { Outlet } from "react-router-dom";

export default function RecordingRoot() {
  return (
    <RecordingProvider>
      <Outlet />
    </RecordingProvider>
  )
}