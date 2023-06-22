import TopBar from "@/components/layout/TopBar";
import { useUser } from "@/contexts/UserContext/UserContext";
import { useComplexNavigate } from "@/hooks/useComplexNavigate";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingDashboard } from "./LoadingDashboard";


export function UserGuard({ children }: { children: ReactNode; }) {
  const { state: { isLoading, user } } = useUser();
  const [hasPassedGuard, setHasPassedGuard] = useState(false)

  const location = useLocation();
  const navigate = useComplexNavigate();

  useEffect(() => {

    if (isLoading) return;

    const userData = user?.data();
    console.log({ isLoading, user, userData })

    if (!user || !userData)
      return;

    if (!userData.name) {
      navigate({
        path: "/complete-profile",
        query: {
          r: location.pathname
        }
      });
    } else {
      setHasPassedGuard(true)
    }
  }, [isLoading, user, navigate, location.pathname]);

  console.log({ isLoading, user, hasPassedGuard })

  if (isLoading || !user || !hasPassedGuard)
    return <LoadingDashboard />;

  return (
    <div className="h-full relative">
      <TopBar />
      <div className="flex-grow absolute top-12 w-full bottom-0">
        {children}
      </div>
    </div>
  );
}
