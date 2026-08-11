import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  SlidersHorizontal,
  User,
  ChevronRight,
  X,
  LogOut,
  CalendarHeart,
  Bookmark,
  HelpCircle,
  HeartHandshake,
  Map,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import { cn } from "@/lib/utils";

export default function HomeDrawer({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { requests } = useConnectionRequests();
  const photo = user?.main_photo || user?.profile_photos?.[0];
  const displayName = user?.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name.charAt(0)}.` : ""}`
    : "Your profile";

  const ACCOUNT_NAV = [
    { label: "Settings", icon: SlidersHorizontal, onClick: () => navigate("/profile#settings") },
  ];

  const LIBRARY_NAV = [
    { label: "My trips", icon: Map, to: "/trips" },
    { label: "My events", icon: CalendarHeart, to: "/events" },
    { label: "Saved", icon: Bookmark, to: "/saved" },
  ];

  const SUPPORT_NAV = [
    { label: "Help & support", icon: HelpCircle, to: "/help" },
    { label: "Community guidelines", icon: HeartHandshake, to: "/community-guidelines" },
  ];

  const close = () => onOpenChange(false);
  const go = (path) => {
    close();
    navigate(path);
  };

  const NavRow = ({ icon: Icon, label, onClick, badge }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl active:bg-muted/50 transition text-left group"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-active:scale-95 transition">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
      </div>
      <span className="flex-1 min-w-0 text-sm font-medium text-foreground">{label}</span>
      {badge != null && badge > 0 && (
        <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-[10px] font-semibold text-white flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
    </button>
  );

  const SectionLabel = ({ children, className }) => (
    <p
      className={cn(
        "px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className={cn(
          "p-0 gap-0 flex flex-col border-r border-border/60 shadow-2xl [&>button.absolute]:hidden",
          "!left-[max(0px,calc(50%-215px))] !right-auto",
          "w-[min(300px,calc(100vw-32px))] max-w-[300px]"
        )}
      >
        <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border/50 bg-gradient-to-b from-primary/8 to-transparent">
          <div className="flex items-center justify-between gap-2 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Menu</p>
            <button
              type="button"
              onClick={close}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground active:bg-muted/60 transition"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => go("/profile")}
            className="w-full flex items-center gap-3 p-2 -mx-2 rounded-2xl active:bg-card/80 transition text-left"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-border shadow-soft shrink-0">
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/15 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <span className="font-display font-semibold text-base truncate flex-1">{displayName}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
          <SectionLabel>Account</SectionLabel>
          {ACCOUNT_NAV.map((item) => (
            <NavRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                close();
                item.onClick();
              }}
            />
          ))}

          <SectionLabel className="pt-3">Social</SectionLabel>
          <NavRow
            icon={Users}
            label="Friends"
            badge={requests.length}
            onClick={() => go("/friends")}
          />

          <SectionLabel className="pt-3">Your library</SectionLabel>
          {LIBRARY_NAV.map((item) => (
            <NavRow
              key={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => go(item.to)}
            />
          ))}

          <SectionLabel className="pt-3">Support</SectionLabel>
          {SUPPORT_NAV.map((item) => (
            <NavRow
              key={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => go(item.to)}
            />
          ))}
        </div>

        <div className="shrink-0 px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-border/50">
          <NavRow
            icon={LogOut}
            label="Log out"
            onClick={() => {
              close();
              logout();
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
