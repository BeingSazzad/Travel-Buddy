import React from "react";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import AccountMenu from "@/components/profile/AccountMenu";
import VerificationCard from "@/components/profile/VerificationCard";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPlus =
    user?.subscription_status === "active" || user?.subscription_status === "cancelled_active";
  const isVerified = user?.identity_verified && user?.age_verified;

  return (
    <div className="app-px safe-pt pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-bold text-lg">Profile</h1>
      </div>

      <ProfileHeader />

      <div className="mt-4">
        <ProfileAbout />
      </div>

      {isPlus && (
        <button
          type="button"
          onClick={() => navigate("/subscription-management")}
          className="mt-4 w-full rounded-2xl gradient-brand-horizontal text-white p-3.5 flex items-center justify-between shadow-soft text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-brand-gold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display font-semibold text-xs text-white">Seluna Plus Member</p>
              <p className="text-[10px] text-white/70">Exclusive deals & verified travel community</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-brand-gold border border-white/20">
            Active
          </span>
        </button>
      )}

      <div className="mt-5 space-y-4" id="profile-settings">
        {!isVerified && <VerificationCard />}
        <AccountMenu />
      </div>
    </div>
  );
}
