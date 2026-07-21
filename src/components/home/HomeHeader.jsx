import React from "react";
import { Moon, Bell } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function HomeHeader() {
  const { user } = useAuth();
  const photo = user?.main_photo || user?.profile_photos?.[0];

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Moon className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
        <h1 className="font-display font-semibold text-xl tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center shadow-soft active:scale-95 transition">
          <Bell className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#A1846B] ring-2 ring-card" />
        </button>
        <button className="w-9 h-9 rounded-full overflow-hidden border border-border shadow-soft active:scale-95 transition">
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