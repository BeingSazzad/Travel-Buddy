import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { ADMIN_NAV } from "@/lib/admin-nav";

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "admin") {
    return (
      <div className="px-5 pt-24 text-center">
        <ShieldAlert className="w-9 h-9 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
        <p className="font-display font-bold text-lg">Admins only</p>
        <p className="text-sm text-muted-foreground mt-1">You don't have access to the Seluna admin dashboard.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-sm text-primary underline">Back to app</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
          <span className="font-display font-semibold text-lg">Seluna Admin</span>
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Exit
          </button>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pb-2 max-w-5xl mx-auto">
          {ADMIN_NAV.map((s) => (
            <NavLink
              key={s.path}
              to={s.path}
              end={s.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                  isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                }`
              }
            >
              <s.icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {s.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="px-4 pt-4 pb-12 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}