import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Bell, Ban, HelpCircle, FileText, ShieldCheck, Heart, Trash2, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PrivacySheet from "@/components/profile/PrivacySheet";
import NotificationsSheet from "@/components/profile/NotificationsSheet";
import BlockedUsersSheet from "@/components/profile/BlockedUsersSheet";
import DeleteAccountSheet from "@/components/profile/DeleteAccountSheet";

export default function AccountMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);

  const Row = ({ icon: Icon, label, onClick, danger }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 border-b border-border/60 last:border-0 active:bg-muted/40 transition"
    >
      <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-primary"}`} strokeWidth={1.5} />
      <span className={`flex-1 text-left text-xs font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Account Settings */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Account & Preferences</p>
        <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
          <Row icon={Shield} label="Privacy preferences" onClick={() => setSheet("privacy")} />
          <Row icon={Bell} label="Notification preferences" onClick={() => setSheet("notifications")} />
          <Row icon={Ban} label="Blocked members" onClick={() => setSheet("blocked")} />
        </div>
      </div>

      {/* Safety & Legal */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Safety & Legal</p>
        <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
          <Row icon={Heart} label="Community Guidelines" onClick={() => navigate("/community-guidelines")} />
          <Row icon={HelpCircle} label="Help & Support" onClick={() => navigate("/help")} />
          <Row icon={FileText} label="Terms & Conditions" onClick={() => navigate("/terms")} />
          <Row icon={ShieldCheck} label="Privacy Policy" onClick={() => navigate("/privacy")} />
        </div>
      </div>

      {/* Account Actions */}
      <div>
        <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden">
          <Row icon={LogOut} label="Log out" onClick={() => logout()} />
          <Row icon={Trash2} label="Delete account" onClick={() => setSheet("delete")} danger />
        </div>
      </div>

      {sheet === "privacy" && <PrivacySheet onClose={() => setSheet(null)} />}
      {sheet === "notifications" && <NotificationsSheet onClose={() => setSheet(null)} />}
      {sheet === "blocked" && <BlockedUsersSheet onClose={() => setSheet(null)} />}
      {sheet === "delete" && <DeleteAccountSheet onClose={() => setSheet(null)} />}
    </div>
  );
}