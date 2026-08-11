import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, BadgeCheck, Crown, MapPin, Globe } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO, FALLBACK_AVATAR_URL } from "@/lib/images";
import { useTrips } from "@/hooks/useTrips";
import { useFriends } from "@/hooks/useFriends";
import { useEvents } from "@/hooks/useEvents";
import {
  profileDisplayName,
  profileBiography,
  profileLanguages,
  profileTravelStyles,
  profileInterests,
  profilePhotos,
  profileMainPhoto,
  profileLocationText,
  profileNationality,
  profileAge,
  profileHandle,
} from "@/lib/profile-display";

function Stat({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 min-w-[4.5rem] tap-feedback active:opacity-80"
    >
      <span className="font-display font-bold text-lg text-foreground leading-none">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </button>
  );
}

export default function ProfileHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const { friends } = useFriends();
  const { events, joined } = useEvents();

  const photos = profilePhotos(user);
  const main = profileMainPhoto(user, FALLBACK_AVATAR_URL);
  const cover = user?.cover_photo || main || HERO.profileCover;
  const name = profileDisplayName(user);
  const handle = profileHandle(user);
  const age = profileAge(user, { viewerIsOwner: true });
  const location = profileLocationText(user, { viewerIsOwner: true });
  const nationality = profileNationality(user, { viewerIsOwner: true });
  const languages = profileLanguages(user);
  const isVerified = user?.identity_verified && user?.age_verified;
  const isPlus =
    user?.subscription_status === "active" || user?.subscription_status === "cancelled_active";

  const uid = user?.id || "mock-user-123";
  const tripCount = trips.filter((t) => t.created_by_id === uid).length;
  const connectionCount = friends.length;
  const hostedCount = events.filter((e) => e.host_id === uid || e.created_by_id === uid).length;
  const eventCount = hostedCount + joined.length;

  const tagLine = [...profileTravelStyles(user).slice(0, 2), ...profileInterests(user).slice(0, 2)]
    .slice(0, 3)
    .join(" · ");

  const bio = profileBiography(user);

  return (
    <div className="min-w-0">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-background pointer-events-none" />
      </div>

      <div className="app-px relative pb-5">
        <div className="relative -mt-14 flex items-end gap-3">
          <div className="relative shrink-0">
            <div
              className={cn(
                "rounded-full",
                isPlus && "p-[3px] bg-gradient-to-br from-brand-gold via-primary to-brand-walnut shadow-soft"
              )}
            >
              <img
                src={main}
                alt={name}
                className={cn(
                  "w-[88px] h-[88px] rounded-full object-cover shadow-premium",
                  isPlus ? "border-2 border-card" : "border-4 border-background"
                )}
              />
            </div>
            {isVerified && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-sm"
                aria-label="Verified"
              >
                <BadgeCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
            {isPlus && !isVerified && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-gradient-to-br from-brand-gold to-primary border-2 border-background flex items-center justify-center shadow-sm"
                aria-label="Seluna Plus"
              >
                <Crown className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            )}
            <button
              type="button"
              onClick={() => navigate("/profile-setup")}
              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-card border border-border shadow-soft flex items-center justify-center active:scale-95 transition"
              aria-label="Change photo"
            >
              <Camera className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl tracking-tight mt-3 text-foreground">
          {name}
          {age !== null && (
            <span className="text-muted-foreground font-normal text-lg"> · {age}</span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">@{handle}</p>

        {(location || nationality) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {location && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.5} />
                {location}
              </span>
            )}
            {nationality && nationality !== user?.country && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {nationality}
              </span>
            )}
          </div>
        )}

        {languages.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground">
              {languages.join(" · ")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-5 py-4 border-y border-border/50">
          <Stat label="Trips" value={tripCount} onClick={() => navigate("/trips")} />
          <Stat label="Connections" value={connectionCount} onClick={() => navigate("/friends")} />
          <Stat label="Events" value={eventCount} onClick={() => navigate("/events")} />
        </div>

        <div className="mt-4 space-y-1">
          {tagLine && (
            <p className="text-sm text-foreground/90 leading-relaxed capitalize">{tagLine}</p>
          )}
          {bio && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {bio}
            </p>
          )}
        </div>

        <Button
          className="w-full h-11 rounded-full mt-5 text-sm font-semibold shadow-md"
          onClick={() => navigate("/profile-setup")}
        >
          Edit profile
        </Button>
      </div>
    </div>
  );
}
