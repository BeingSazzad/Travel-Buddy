import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/common/SplashScreen";
import { markSplashSeen, pathAfterSplash } from "@/lib/launch-flow";

/** Cold start brand beat → onboarding (first visit) or welcome. */
export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    markSplashSeen();
    const timer = setTimeout(() => {
      navigate(pathAfterSplash(), { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <SplashScreen />;
}
