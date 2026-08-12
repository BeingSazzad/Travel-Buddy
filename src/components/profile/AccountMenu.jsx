import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Bell, Ban, HelpCircle, Trash2, LogOut,
  ChevronRight, Lock, Bookmark, Crown,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isPlus =
    user?.subscription_status === "active" || user?.subscription_status === "cancelled_active";

  const Row = ({ icon: Icon, label, onClick, danger }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border/60 last:border-0 active:bg-muted/40 transition"
    >
      <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-primary"}`} strokeWidth={1.5} />
      <span className={`flex-1 text-left row-title ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
        <Row icon={Bookmark} label="Saved" onClick={() => navigate("/saved")} />
        {!isPlus && (
          <Row icon={Crown} label="Seluna Plus" onClick={() => navigate("/subscription")} />
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Settings</p>
        <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
          <Row icon={Shield} label="Privacy" onClick={() => navigate("/profile/privacy")} />
          <Row icon={Bell} label="Notifications" onClick={() => navigate("/profile/notifications")} />
          <Row icon={Ban} label="Blocked members" onClick={() => navigate("/profile/blocked")} />
          <Row icon={Lock} label="Change password" onClick={() => navigate("/change-password")} />
        </div>
      </div>

      <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
        <Row icon={HelpCircle} label="Help & Support" onClick={() => navigate("/help")} />
        <Row icon={LogOut} label="Log out" onClick={() => logout()} />
        <Row icon={Trash2} label="Delete account" onClick={() => navigate("/profile/delete")} danger />
      </div>
    </div>
  );
}
