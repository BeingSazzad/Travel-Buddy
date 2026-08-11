import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import HomeDrawer from "@/components/home/HomeDrawer";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const photo = user?.main_photo || user?.profile_photos?.[0];
  const firstName = user?.first_name || "traveler";
  const [unread, setUnread] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      try {
        const list = await base44.entities.Notification.filter(
          { user_id: user.id, read: false },
          "-created_date",
          50
        );
        setUnread(list.length);
      } catch {
        setUnread(0);
      }
    };
    load();
    const unsub = base44.entities.Notification.subscribe(load);
    return unsub;
  }, [user?.id]);

  return (
    <>
      <header className="pb-1">
        <div className="safe-pt app-px">
          {/* Nav chrome — separated from greeting */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/80 active:scale-95 transition shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-foreground/80 active:scale-95 transition"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center leading-none">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
          </div>

          {/* Identity + headline */}
          <div className="flex items-center gap-3.5 mb-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/25 shadow-sm shrink-0 active:scale-95 transition"
              aria-label="Profile"
            >
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/15 flex items-center justify-center text-primary text-sm font-semibold">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-snug">
                {getGreeting()}, {firstName}
              </p>
              <h1 className="font-display font-bold text-[1.25rem] leading-tight tracking-tight text-foreground mt-0.5">
                Where are you going next?
              </h1>
            </div>
          </div>

          {/* Search — inset field, not a separate floating card */}
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="w-full flex items-center gap-3 rounded-2xl bg-muted/35 border border-border/30 px-4 py-3 text-left active:scale-[0.99] transition-transform tap-feedback"
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-sm text-muted-foreground">
              Search destinations, events, members…
            </span>
          </button>
        </div>
      </header>

      <HomeDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
