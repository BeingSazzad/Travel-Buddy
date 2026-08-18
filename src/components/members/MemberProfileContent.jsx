import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plane,
  Compass,
  MessageCircle,
  BadgeCheck,
  Globe,
  X,
} from "lucide-react";
import { ConnectIcon, CONNECT_STROKE } from "@/components/common/ConnectIconButton";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import ReportSheet from "@/components/reports/ReportSheet";
import MemberProfileMenu from "@/components/members/MemberProfileMenu";
import { base44 } from "@/api/base44Client";
import { getMockConversationId, normalizeMemberData } from "@/lib/member-profile";
import {
  profileDisplayName,
  profileBiography,
  profileLocationText,
  profileAge,
} from "@/lib/profile-display";
import { cn } from "@/lib/utils";

function ChipRow({ label, items, tone, icon: Icon }) {
  const list = Array.isArray(items) ? items : items ? [items] : [];
  if (!list.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />}
        <span>{label}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {list.map((it) => (
          <span
            key={it}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full font-medium capitalize border",
              tone === "accent"
                ? "bg-primary/12 text-primary border-primary/25"
                : "bg-card border-border/80 text-foreground"
            )}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatTripDates(trip) {
  if (trip.dates) return trip.dates;
  if (trip.start_date && trip.end_date) return `${trip.start_date} – ${trip.end_date}`;
  return trip.start_date || "";
}

export default function MemberProfileContent({
  data,
  memberId: memberIdProp,
  onBack,
  isFriend = false,
  pendingRequest,
  onConnect,
  onDecline,
  friendRecord,
  onRemoveFriend,
  onBlockMember,
}) {
  const navigate = useNavigate();
  const [reportTarget, setReportTarget] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const normalized = normalizeMemberData(data);
  if (!normalized) {
    return (
      <div className="flex flex-col min-h-[50vh] items-center justify-center gap-2 px-6 text-center text-muted-foreground">
        <p className="font-display font-semibold text-foreground">Profile unavailable</p>
        <p className="text-sm">Try again later or go back.</p>
      </div>
    );
  }

  const { profile: p, trips, photos, memberId } = normalized;
  const resolvedId = memberIdProp || memberId;
  const heroPhoto = photos[activePhoto] || photos[0];
  const showTrips = p.show_upcoming_trips !== false;
  const upcomingTrip = showTrips ? (trips[0] || p.trip) : null;
  const displayName = profileDisplayName(p);
  const displayAge = profileAge(p);
  const displayLocation = profileLocationText(p);
  const displayBio = profileBiography(p);

  const reportMember = () =>
    setReportTarget({ type: "profile", id: resolvedId, title: p?.name || "Member", ownerId: resolvedId });

  const handleRemoveFriend = () => {
    if (!window.confirm(`Remove ${p.name} from your friends? You can connect again on Match.`)) return;
    onRemoveFriend?.(friendRecord);
    onBack?.();
  };

  const handleBlockMember = () => {
    onBlockMember?.(resolvedId);
    onBack?.();
  };

  const handleMessage = async () => {
    if (!resolvedId?.startsWith("mock_")) {
      try {
        const res = await base44.functions.invoke("start-conversation", { target_user_id: resolvedId });
        if (res.data?.conversation_id) {
          navigate(`/conversations/${res.data.conversation_id}`);
          return;
        }
      } catch {
        /* fall through to mock */
      }
    }
    navigate(`/conversations/${getMockConversationId(resolvedId)}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-full">
        {/* Full-bleed hero */}
        <div className="relative w-full aspect-[4/5] max-h-[min(72vh,440px)] bg-muted shrink-0">
          {heroPhoto && (
            <Image
              src={heroPhoto}
              alt={p.name}
              fittingType="fill"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="gradient-overlay-card" />

          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 safe-pt pb-2">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <MemberProfileMenu
              isConnected={isFriend}
              overlay
              blockName={p?.name}
              onReport={reportMember}
              onRemoveFriend={isFriend && onRemoveFriend ? handleRemoveFriend : undefined}
              onBlockMember={onBlockMember ? handleBlockMember : undefined}
            />
          </div>

          <div className="absolute bottom-0 inset-x-0 z-20 px-5 pb-5 text-white">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
                {displayName}{displayAge != null ? `, ${displayAge}` : ""}
              </h1>
              {(p.verified ?? true) && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
                  <BadgeCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {displayLocation && (
                <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
                  <span className="font-medium">{displayLocation}</span>
                </div>
              )}
              {upcomingTrip && (
                <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/85 backdrop-blur-md font-medium">
                  <Plane className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>
                    {upcomingTrip.city}
                    {upcomingTrip.country ? `, ${upcomingTrip.country}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo gallery — fills width when multiple shots */}
        {photos.length > 1 && (
          <div className="px-5 pt-4 pb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Photos</p>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((ph, i) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={cn(
                    "relative aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all active:scale-[0.98]",
                    activePhoto === i
                      ? "border-primary shadow-md ring-2 ring-primary/30"
                      : "border-border/60 opacity-90"
                  )}
                >
                  <Image src={ph} alt="" fittingType="fill" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 py-5 space-y-6 flex-1">
          {displayBio && (
            <section className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">About</p>
              <div className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft">
                <p className="text-sm text-foreground/90 leading-relaxed">&ldquo;{displayBio}&rdquo;</p>
              </div>
            </section>
          )}

          {p.interests?.length > 0 && (
            <section className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Interests</p>
              <div className="flex flex-wrap gap-2">
                {p.interests.slice(0, 6).map((i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium capitalize"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(p.languages?.length || p.travel_style?.length) && (
            <section className="space-y-4 rounded-2xl bg-card border border-border/70 p-4 shadow-soft">
              <ChipRow label="Languages" items={p.languages} icon={Globe} />
              <ChipRow label="Travel style" items={p.travel_style} icon={Compass} />
            </section>
          )}

          <section className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
              <span>Upcoming trips</span>
            </p>
            {showTrips && trips.length > 0 ? (
              <div className="space-y-2">
                {trips.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft"
                  >
                    <p className="text-sm font-display font-bold text-foreground">
                      {t.city}{t.country ? `, ${t.country}` : ""}
                    </p>
                    {formatTripDates(t) && (
                      <p className="text-xs text-muted-foreground mt-1">{formatTripDates(t)}</p>
                    )}
                    {t.travel_style && (
                      <span className="inline-block text-[10px] font-semibold text-primary capitalize px-2 py-0.5 rounded-full bg-primary/12 mt-2">
                        {t.travel_style}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-2 py-1">
                <Compass className="w-4 h-4 text-primary shrink-0" />
                {showTrips ? "No upcoming trips shared yet" : "Trips hidden on this profile"}
              </p>
            )}
          </section>
        </div>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/60 p-4 px-5 safe-pb">
          {isFriend ? (
            <Button
              onClick={handleMessage}
              className="w-full h-11 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" strokeWidth={2} />
              <span>Send message</span>
            </Button>
          ) : pendingRequest ? (
            <div className="flex gap-2">
              <Button
                onClick={() => onConnect?.()}
                className="flex-1 h-11 rounded-xl font-semibold gradient-brand-button text-white gap-1.5"
              >
                <ConnectIcon className="w-4 h-4" strokeWidth={CONNECT_STROKE} />
                Connect
              </Button>
              <Button
                variant="ghost"
                onClick={() => onDecline?.()}
                className="flex-1 h-11 rounded-xl font-semibold bg-white/15 text-white hover:bg-white/20 hover:text-white gap-1.5"
              >
                <X className="w-4 h-4" strokeWidth={2} />
                Decline
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onConnect?.()}
              className="w-full h-11 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <ConnectIcon className="w-5 h-5" strokeWidth={CONNECT_STROKE} />
              <span>Connect</span>
            </Button>
          )}
        </div>
      </div>

      <ReportSheet open={!!reportTarget} onOpenChange={(o) => !o && setReportTarget(null)} target={reportTarget} />
    </>
  );
}
