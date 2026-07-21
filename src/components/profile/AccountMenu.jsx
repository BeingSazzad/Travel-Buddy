import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil, Plane, CalendarHeart, MessageCircle, Crown, Shield, Bell,
  Ban, HelpCircle, FileText, ShieldCheck, Trash2, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PrivacySheet from "@/components/profile/PrivacySheet";
import NotificationsSheet from "@/components/profile/NotificationsSheet";
import BlockedUsersSheet from "@/components/profile/BlockedUsersSheet";
import LegalSheet from "@/components/profile/LegalSheet";
import DeleteAccountSheet from "@/components/profile/DeleteAccountSheet";

export default function AccountMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);

  const Row = ({ icon: Icon, label, onClick, danger }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 active:bg-muted/50 transition">
      <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-[#A1846B]"}`} strokeWidth={1.5} />
      <span className={`flex-1 text-left text-sm ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
    </button>
  );

  return (
    <div className="mt-6">
      <h3 className="font-display font-semibold text-base mb-3">Account & settings</h3>
      <div className="bg-card border border-border shadow-soft rounded-2xl overflow-hidden">
        <Row icon={Pencil} label="Edit profile" onClick={() => navigate("/profile-setup")} />
        <Row icon={Plane} label="My trips" onClick={() => navigate("/trips")} />
        <Row icon={CalendarHeart} label="My events" onClick={() => navigate("/events")} />
        <Row icon={MessageCircle} label="Messages" onClick={() => navigate("/messages")} />
        <Row icon={Crown} label="Subscription" onClick={() => navigate("/subscription-management")} />
        <Row icon={Shield} label="Privacy" onClick={() => setSheet("privacy")} />
        <Row icon={Bell} label="Notifications" onClick={() => setSheet("notifications")} />
        <Row icon={Ban} label="Blocked users" onClick={() => setSheet("blocked")} />
        <Row icon={HelpCircle} label="Help" onClick={() => setSheet("help")} />
        <Row icon={FileText} label="Terms" onClick={() => setSheet("terms")} />
        <Row icon={ShieldCheck} label="Privacy policy" onClick={() => setSheet("privacy_policy")} />
        <Row icon={Trash2} label="Delete account" onClick={() => setSheet("delete")} danger />
        <Row icon={LogOut} label="Log out" onClick={() => logout()} />
      </div>

      {sheet === "privacy" && <PrivacySheet onClose={() => setSheet(null)} />}
      {sheet === "notifications" && <NotificationsSheet onClose={() => setSheet(null)} />}
      {sheet === "blocked" && <BlockedUsersSheet onClose={() => setSheet(null)} />}
      {sheet === "help" && <LegalSheet kind="help" onClose={() => setSheet(null)} />}
      {sheet === "terms" && <LegalSheet kind="terms" onClose={() => setSheet(null)} />}
      {sheet === "privacy_policy" && <LegalSheet kind="privacy" onClose={() => setSheet(null)} />}
      {sheet === "delete" && <DeleteAccountSheet onClose={() => setSheet(null)} />}
    </div>
  );
}