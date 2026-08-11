import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Trips from "@/pages/Trips";
import Messages from "@/pages/Messages";
import Events from "@/pages/Events";
import Discover from "@/pages/Discover";
import PullToRefresh from "@/components/common/PullToRefresh";
import { emitRefresh } from "@/lib/refresh-bus";

const SCROLL_PAD = "pb-[calc(5.5rem+env(safe-area-inset-bottom))]";
const ACTIVE = `absolute inset-0 h-full min-h-0 flex flex-col overflow-hidden min-w-0 max-w-full`;
const SCROLLABLE = `flex-1 min-h-0 overflow-y-auto overscroll-contain app-scroll ${SCROLL_PAD}`;
const FILL = `flex-1 min-h-0 flex flex-col overflow-hidden min-w-0 max-w-full ${SCROLL_PAD}`;

// Preserved tab views stay mounted (display:none when inactive) to keep
// scroll position and component state across tab switches.
const PRESERVED = [
  { path: "/discover", Component: Discover, ptr: true, layout: "fill" },
  { path: "/trips", Component: Trips, ptr: true },
  { path: "/messages", Component: Messages, ptr: true },
  { path: "/events", Component: Events, ptr: true },
];
const PRESERVED_PATHS = new Set(PRESERVED.map((t) => t.path));

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isPreserved = PRESERVED_PATHS.has(pathname);

  return (
    <div className="relative w-full flex flex-col h-full min-h-0 safe-x overflow-x-hidden min-w-0 max-w-full">
      <div className="flex-1 min-h-0 relative overflow-hidden min-w-0 max-w-full">
        {PRESERVED.map((t) => {
          const cls = pathname === t.path ? ACTIVE : "hidden";
          const innerCls = t.layout === "fill" ? FILL : SCROLLABLE;
          if (t.ptr) {
            return (
              <PullToRefresh key={t.path} onRefresh={() => emitRefresh(t.path)} className={cls}>
                <div className={innerCls}>
                  <t.Component />
                </div>
              </PullToRefresh>
            );
          }
          return (
            <div key={t.path} className={cls}>
              <div className={innerCls}>
                <t.Component />
              </div>
            </div>
          );
        })}

        {!isPreserved &&
          (isHome ? (
            <PullToRefresh key={pathname} onRefresh={() => emitRefresh("/")} className={ACTIVE}>
              <div className={SCROLLABLE}>
                <Outlet />
              </div>
            </PullToRefresh>
          ) : (
            <div key={pathname} className={ACTIVE}>
              <div className={SCROLLABLE}>
                <Outlet />
              </div>
            </div>
          ))}
      </div>
      <BottomNav />
    </div>
  );
}
