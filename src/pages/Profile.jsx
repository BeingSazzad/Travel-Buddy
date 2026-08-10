import React, { useState } from "react";
import { Crown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileTrips from "@/components/profile/ProfileTrips";
import ProfileEvents from "@/components/profile/ProfileEvents";
import SavedGroups from "@/components/profile/SavedGroups";
import AccountMenu from "@/components/profile/AccountMenu";
import VerificationCard from "@/components/profile/VerificationCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Profile() {
  const { user } = useAuth();
  const photos = user?.profile_photos || [];
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="app-px safe-pt pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-bold text-lg">Profile</h1>
      </div>

      {/* Main Profile Header */}
      <ProfileHeader />

      {/* Photos Strip */}
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

      {/* Compact Membership Banner */}
      <div className="mt-4 rounded-2xl gradient-brand-horizontal text-white p-3.5 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 text-[#F5C99A]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display font-semibold text-xs text-white">Seluna Plus Member</p>
            <p className="text-[10px] text-white/70">Exclusive deals & verified travel community</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-[#F5C99A] border border-white/20">
          Active
        </span>
      </div>

      {/* Segmented Tabs: Activity vs Settings */}
      <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab} className="mt-5">
        <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1 rounded-2xl">
          <TabsTrigger value="activity" className="rounded-xl text-xs font-semibold data-[state=active]:gradient-brand-accent data-[state=active]:text-white transition-all">
            My Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl text-xs font-semibold data-[state=active]:gradient-brand-accent data-[state=active]:text-white transition-all">
            Settings & Support
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Activity */}
        <TabsContent value="activity" className="mt-4 space-y-4">
          <ProfileAbout />
          <ProfileTrips />
          <ProfileEvents />
          <SavedGroups />
        </TabsContent>

        {/* Tab 2: Settings */}
        <TabsContent value="settings" className="mt-4 space-y-4">
          <VerificationCard />
          <AccountMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
}