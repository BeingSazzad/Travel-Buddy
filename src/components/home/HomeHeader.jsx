import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Bell } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function HomeHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const photo = user?.main_photo || user?.profile_photos?.[0];
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      try {
        const list = await base44.entities.Notification.filter({ user_id: user.id, read: false }, "-created_date", 50);
        setUnread(list.length);
      } catch (e) {}
    };
    load();
    const unsub = base44.entities.Notification.subscribe(load);
    return unsub;
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-5 py-3 flex items-center justify-between">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 active:scale-95 transition">
        <Moon className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
        <h1 className="font-display font-bold text-lg tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center shadow-soft active:scale-95 transition"
        >
          <Bell className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#A1846B] ring-2 ring-card text-[10px] font-semibold text-white flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
        <button onClick={() => navigate("/profile")} className="w-9 h-9 rounded-full overflow-hidden border border-border shadow-soft active:scale-95 transition">
          {photo ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#A1846B]/15 flex items-center justify-center">
              <Moon className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} />
            </div>
          )}
        </button>
      </div>
    </header>
  );
}