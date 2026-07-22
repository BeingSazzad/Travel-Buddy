import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Trips from "@/pages/Trips";
import Friends from "@/pages/Friends";
import Messages from "@/pages/Messages";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import PullToRefresh from "@/components/common/PullToRefresh";
import { emitRefresh } from "@/lib/refresh-bus";

const EASE = [0.22, 1, 0.36, 1];
const ACTIVE = "absolute inset-0 overflow-y-auto pb-28";

// Preserved tab views stay mounted (display:none when inactive) to keep
// scroll position and component state across tab switches.
const PRESERVED = [
  { path: "/trips", Component: Trips, ptr: true },
  { path: "/friends", Component: Friends, ptr: false },
  { path: "/messages", Component: Messages, ptr: true },
  { path: "/events", Component: Events, ptr: true },
  { path: "/profile", Component: Profile, ptr: false },
];
const PRESERVED_PATHS = new Set(PRESERVED.map((t) => t.path));

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isPreserved = PRESERVED_PATHS.has(pathname);

  return (
    <div className="h-dvh bg-background flex justify-center">
      <div className="relative w-full max-w-md bg-background flex flex-col h-dvh shadow-xl safe-x">
        <div className="flex-1 relative overflow-hidden">
          {PRESERVED.map((t) => {
            const cls = pathname === t.path ? ACTIVE : "hidden";
            if (t.ptr) {
              return (
                <PullToRefresh key={t.path} onRefresh={() => emitRefresh(t.path)} className={cls}>
                  <t.Component />
                </PullToRefresh>
              );
            }
            return (
              <div key={t.path} className={cls}>
                <t.Component />
              </div>
            );
          })}

          {!isPreserved &&
            (isHome ? (
              <PullToRefresh key={pathname} onRefresh={() => emitRefresh("/")} className={ACTIVE}>
                <Outlet />
              </PullToRefresh>
            ) : (
              <div key={pathname} className={ACTIVE}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, ease: EASE }}
                >
                  <Outlet />
                </motion.div>
              </div>
            ))}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}