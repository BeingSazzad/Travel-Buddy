import React from "react";
import { Crown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileTrips from "@/components/profile/ProfileTrips";
import ProfileEvents from "@/components/profile/ProfileEvents";
import SavedGroups from "@/components/profile/SavedGroups";
import AccountMenu from "@/components/profile/AccountMenu";
import VerificationCard from "@/components/profile/VerificationCard";

export default function Profile() {
  const { user } = useAuth();
  const photos = user?.profile_photos || [];

  return (
    <div className="px-5 safe-pt pb-10">
      <h1 className="font-display font-semibold text-2xl mb-4">Profile</h1>

      <ProfileHeader />

      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-4">
          {photos.map((p, i) => (
            <img key={i} src={p} alt="" className="w-24 h-24 rounded-2xl object-cover border border-border shrink-0" />
          ))}
        </div>
      )}

      {/* Subscription badge */}
      <div className="mt-5 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-4">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-90">Seluna Plus</span>
        </div>
        <p className="font-display font-semibold">Active member</p>
        <p className="text-xs opacity-80 mt-0.5">Exclusive deals & verified community</p>
      </div>

      <VerificationCard />

      <ProfileAbout />
      <ProfileTrips />
      <ProfileEvents />
      <SavedGroups />
      <AccountMenu />
    </div>
  );
}