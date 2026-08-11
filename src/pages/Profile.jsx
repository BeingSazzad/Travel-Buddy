import React, { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import SavedGroups from "@/components/profile/SavedGroups";
import AccountMenu from "@/components/profile/AccountMenu";
import VerificationCard from "@/components/profile/VerificationCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { profilePhotos } from "@/lib/profile-display";

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const photos = profilePhotos(user);
  const [activeTab, setActiveTab] = useState("activity");
  const isPlus =
    user?.subscription_status === "active" || user?.subscription_status === "cancelled_active";
  const isVerified = user?.identity_verified && user?.age_verified;

  useEffect(() => {
    if (location.hash === "#settings") {
      setActiveTab("settings");
    }
  }, [location.hash]);

  return (
    <div className="app-px safe-pt pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-bold text-lg">Profile</h1>
      </div>

      <ProfileHeader />

      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar app-gutter-x mt-4">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover border border-border/80 shrink-0 shadow-soft"
            />
          ))}
        </div>
      )}

      {isPlus && (
        <div className="mt-4 rounded-2xl gradient-brand-horizontal text-white p-3.5 flex items-center justify-between shadow-soft">
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
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
        <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1 rounded-2xl">
          <TabsTrigger
            value="activity"
            className="rounded-xl text-xs font-semibold data-[state=active]:gradient-brand-accent data-[state=active]:text-white transition-all"
          >
            My Activity
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl text-xs font-semibold data-[state=active]:gradient-brand-accent data-[state=active]:text-white transition-all"
          >
            Settings & Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-4 space-y-4">
          <ProfileAbout />
          <SavedGroups />
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-4" id="profile-settings">
          {!isVerified && <VerificationCard />}
          <AccountMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
}
