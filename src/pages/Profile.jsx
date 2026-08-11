import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileTrips from "@/components/profile/ProfileTrips";
import ProfileEvents from "@/components/profile/ProfileEvents";
import ProfileSettings from "@/components/profile/ProfileSettings";
import VerificationCard from "@/components/profile/VerificationCard";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import { profilePhotos } from "@/lib/profile-display";

function SectionTitle({ children }) {
  return (
    <h2 className="font-display font-semibold text-base text-foreground mb-3">{children}</h2>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const photos = profilePhotos(user);
  const isVerified = user?.identity_verified && user?.age_verified;
  const showTrips = user?.show_upcoming_trips !== false;

  useEffect(() => {
    if (location.hash === "#settings") {
      const el = document.getElementById("profile-settings");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="pb-8 min-w-0 max-w-full overflow-x-hidden">
      <ProfileHeader />

      {photos.length > 1 && (
        <div className="mt-2 mb-2">
          <HorizontalScroll innerClassName="pl-app gap-2">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                alt=""
                className="w-[72px] h-[88px] rounded-2xl object-cover border border-border/80 shrink-0 shadow-soft"
              />
            ))}
          </HorizontalScroll>
        </div>
      )}

      <div className="app-px pt-4 space-y-8">
        {!isVerified && <VerificationCard />}

        <section>
          <SectionTitle>About you</SectionTitle>
          <ProfileAbout embedded />
        </section>

        {showTrips && (
          <section>
            <SectionTitle>My trips</SectionTitle>
            <ProfileTrips embedded />
          </section>
        )}

        <section>
          <SectionTitle>My events</SectionTitle>
          <ProfileEvents embedded />
        </section>

        <section id="profile-settings" className="scroll-mt-4">
          <SectionTitle>Account & settings</SectionTitle>
          <ProfileSettings />
        </section>
      </div>
    </div>
  );
}
