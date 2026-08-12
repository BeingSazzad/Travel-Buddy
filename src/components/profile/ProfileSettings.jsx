import React from "react";

import { useNavigate } from "react-router-dom";

import {

  HelpCircle,

  Heart,

  FileText,

  ShieldCheck,

  Trash2,

  ChevronRight,

  BadgeCheck,

  Lock,

  Crown,

} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";



function SettingsGroup({ children }) {

  return (

    <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden divide-y divide-border/60">

      {children}

    </div>

  );

}



function SettingsRow({ icon: Icon, label, hint, onClick, danger }) {

  return (

    <button

      type="button"

      onClick={onClick}

      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted/40 transition text-left"

    >

      <div

        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${

          danger ? "bg-destructive/10" : "bg-primary/10"

        }`}

      >

        <Icon

          className={`w-4 h-4 ${danger ? "text-destructive" : "text-primary"}`}

          strokeWidth={1.75}

        />

      </div>

      <div className="flex-1 min-w-0">

        <p className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</p>

        {hint && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{hint}</p>}

      </div>

      {!danger && <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />}

    </button>

  );

}



export default function ProfileSettings() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const isVerified = user?.identity_verified && user?.age_verified;
  const subStatus = user?.subscription_status || "none";
  const subActive = subStatus === "active" || subStatus === "cancelled_active";
  const subHint = subActive
    ? "Active · deals & priority support"
  : subStatus === "payment_failed"
    ? "Payment failed — update billing"
    : subStatus === "expired"
      ? "Expired — resubscribe to unlock Plus"
      : "Unlock member deals & priority support";



  return (

    <div className="space-y-4">

      <SettingsGroup>

        <div className="px-4 py-3 border-b border-border/60">
          {user?.email && (
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          )}
        </div>

        <SettingsRow

          icon={Lock}

          label="Change password"

          hint="Update your sign-in password"

          onClick={() => navigate("/change-password")}

        />

        {isVerified && (

          <div className="px-4 py-3 flex items-center gap-3 text-sm text-muted-foreground">

            <BadgeCheck className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />

            <span>Identity verified</span>

          </div>

        )}

      </SettingsGroup>



      <SettingsGroup>

        <SettingsRow

          icon={Crown}

          label="Seluna Plus"

          hint={subHint}

          onClick={() => navigate("/subscription-management")}

        />

      </SettingsGroup>



      <SettingsGroup>

        <SettingsRow icon={HelpCircle} label="Help" onClick={() => navigate("/help")} />

        <SettingsRow icon={Heart} label="Community guidelines" onClick={() => navigate("/community-guidelines")} />

        <SettingsRow icon={FileText} label="Terms of service" onClick={() => navigate("/terms")} />

        <SettingsRow icon={ShieldCheck} label="Privacy policy" onClick={() => navigate("/privacy")} />

      </SettingsGroup>



      <SettingsGroup>

        <SettingsRow icon={Trash2} label="Delete account" onClick={() => navigate("/profile/delete")} danger />

      </SettingsGroup>



    </div>

  );

}
