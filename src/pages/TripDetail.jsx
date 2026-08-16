import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  User,
  MessageCircle,
  Sparkles,
  Flag,
  UserPlus,
  Pencil,
  CalendarDays,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { CONNECT_STROKE } from "@/components/common/ConnectIconButton";
import TripActionsMenu from "@/components/trips/TripActionsMenu";
import TripOverlapMatches from "@/components/trips/TripOverlapMatches";
import EventMap from "@/components/events/EventMap";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { tripStatus, formatDates, imageForCity, tripsOverlap } from "@/lib/trip-utils";
import { findMockTrip, memberIdForTripCreator } from "@/lib/mock-trips";
import { getMockConversationId, findMockMember } from "@/lib/member-profile";
import { eventsForCity, resolveEventId } from "@/lib/mock-events";
import { isSameAppUser } from "@/lib/demo-user";
import { cn } from "@/lib/utils";
import { useTrips } from "@/hooks/useTrips";
import { useFriends } from "@/hooks/useFriends";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import TripForm from "@/components/trips/TripForm";
import ReportSheet from "@/components/reports/ReportSheet";
import { fmtEventDate, fmtEventTime } from "@/lib/event-options";

const STATUS_LABEL = {
  active: "Active now",
  upcoming: "Upcoming",
  previous: "Past trip",
};

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, update, remove } = useTrips();
  const { friends, reload: reloadFriends } = useFriends();
  const { requests, reload: reloadRequests } = useConnectionRequests();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromList = trips.find((t) => t.id === id);
    const mock = findMockTrip(id, user?.id);
    const found = fromList || mock;
    if (found) {
      setTrip(found);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const t = await base44.entities.Trip.get(id);
        if (!cancelled) setTrip(t);
      } catch {
        if (!cancelled) setTrip(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user?.id, trips]);

  const overlapMatches = useMemo(() => {
    if (!trip) return [];
    const byWoman = {};
    const others = trips.filter(
      (t) => t.id !== trip.id && !isSameAppUser(t.created_by_id, trip.created_by_id)
    );
    others.forEach((t) => {
      const sameCity = (t.city || "").toLowerCase() === (trip.city || "").toLowerCase();
      if (sameCity && tripsOverlap(trip, t)) {
        const key = t.created_by_id;
        if (!byWoman[key]) {
          const mockMember = findMockMember(memberIdForTripCreator(key));
          const name =
            typeof t.created_by === "object"
              ? t.created_by?.name
              : (t.created_by || "").split("@")[0];
          const photo =
            typeof t.created_by === "object" ? t.created_by?.main_photo : null;
          byWoman[key] = {
            creatorId: key,
            name: name || mockMember?.name || "Member",
            photo: photo || mockMember?.main_photo,
            trips: [],
          };
        }
        byWoman[key].trips.push(t);
      }
    });
    return Object.values(byWoman);
  }, [trip, trips]);

  const overlapCount = overlapMatches.length;

  const cityEvents = useMemo(() => {
    if (!trip?.city) return [];
    return eventsForCity(trip.city).slice(0, 3);
  }, [trip?.city]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading trip…
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Trip not found</p>
        <button onClick={() => navigate("/trips")} className="text-sm text-primary underline">
          Back to trips
        </button>
      </div>
    );
  }

  const isOwner = isSameAppUser(trip.created_by_id, user?.id);
  const status = tripStatus(trip);
  const cover = trip.cover_image || imageForCity(trip.city);
  const tripDays =
    trip.start_date && trip.end_date
      ? Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1)
      : null;
  const creatorName =
    typeof trip.created_by === "object" ? trip.created_by?.name : trip.created_by;
  const creatorPhoto =
    typeof trip.created_by === "object" ? trip.created_by?.main_photo : null;
  const memberId = memberIdForTripCreator(trip.created_by_id);
  const friendRecord = friends.find((f) => f.memberId === memberId);
  const isFriend = !!friendRecord;
  const pendingRequest = requests.some((r) => r.user_id === memberId);
  const mapLabel = [trip.city, trip.country].filter(Boolean).join(", ");
  const directionsUrl = mapLabel
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLabel)}`
    : null;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: trip.name, url });
      else {
        await navigator.clipboard.writeText(url);
        alert("Link copied");
      }
    } catch {
      /* dismissed */
    }
  };

  const del = async () => {
    if (!window.confirm(`Delete "${trip.name}"?`)) return;
    setBusy(true);
    try {
      await remove(trip.id);
      navigate("/trips");
    } finally {
      setBusy(false);
    }
  };

  const submitEdit = async (data) => {
    await update(trip.id, data);
    setTrip((prev) => ({ ...prev, ...data }));
    setFormOpen(false);
  };

  const openProfile = () => {
    if (isOwner) navigate("/profile");
    else if (memberId) navigate(`/members/${memberId}`);
    else navigate("/discover");
  };

  const openMessage = () => {
    if (isOwner || !isFriend) return;
    const convId = friendRecord?.convId || getMockConversationId(memberId);
    navigate(`/conversations/${convId}`);
  };

  const handleConnect = async () => {
    if (!memberId) return;
    try {
      await base44.functions.invoke("record-like", {
        liked_user_id: memberId,
        action: "like",
      });
    } catch {
      /* demo */
    }
    await reloadFriends();
    await reloadRequests();
  };

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-1">
          {isOwner ? (
            <TripActionsMenu
              onEdit={() => setFormOpen(true)}
              onDelete={del}
              disabled={busy}
              align="end"
            />
          ) : (
            <button
              onClick={() => setReportOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback"
              aria-label="Report"
            >
              <Flag className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <button onClick={share} className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback" aria-label="Share">
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-[232px]">
          <Image src={cover} alt={trip.name} fittingType="fill" className="w-full h-full" />
          <div className="gradient-overlay-soft" />
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white border border-white/20">
            {STATUS_LABEL[status] || status}
          </span>
        </div>

        <div className="detail-body space-y-5">
          <div>
            <h1 className="font-display font-bold text-xl leading-snug">{trip.name}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
              <span>{trip.city}{trip.country ? `, ${trip.country}` : ""}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary/80 shrink-0" strokeWidth={1.5} />
              <span>
                {formatDates(trip)}
                {tripDays != null && ` · ${tripDays} ${tripDays === 1 ? "day" : "days"}`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {trip.travel_style && (
              <span className="inline-block text-xs font-semibold text-primary capitalize px-3 py-1 rounded-full bg-primary/12 border border-primary/20">
                {trip.travel_style} travel style
              </span>
            )}
            {isOwner && (
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border",
                  (trip.visibility || "public") === "public"
                    ? "bg-success/15 text-success border-success/30"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {(trip.visibility || "public") === "public" ? "Public trip" : "Hidden trip"}
              </span>
            )}
          </div>

          {trip.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{trip.description}</p>
          )}

          {trip.looking_for?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Looking for</p>
              <div className="flex flex-wrap gap-1.5">
                {trip.looking_for.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {overlapCount > 0 && (
            <div className="rounded-2xl bg-primary/8 border border-primary/15 p-3 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm">
                {overlapCount} {overlapCount === 1 ? "woman" : "women"} also travelling to {trip.city} on overlapping dates.
              </p>
            </div>
          )}

          {overlapMatches.length > 0 && (
            <TripOverlapMatches matches={overlapMatches} city={trip.city} />
          )}

          {!isOwner && (
            <button
              type="button"
              onClick={openProfile}
              className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 tap-feedback text-left"
            >
              {creatorPhoto ? (
                <img src={creatorPhoto} alt="" className="w-11 h-11 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-medium">
                  {(creatorName || "?")[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Planned by</p>
                <p className="text-sm font-semibold truncate">{creatorName || "Member"}</p>
                {isFriend && (
                  <p className="text-[11px] text-primary font-medium mt-0.5">Friend</p>
                )}
                {!isFriend && pendingRequest && (
                  <p className="text-[11px] text-primary font-medium mt-0.5">Wants to connect</p>
                )}
              </div>
              <User className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            </button>
          )}

          {mapLabel && (
            <section>
              <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Destination map
              </h2>
              <EventMap compact query={mapLabel} label={mapLabel} />
            </section>
          )}

          {cityEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-base flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  While you&apos;re in {trip.city}
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/events")}
                  className="text-xs font-semibold text-primary tap-feedback"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {cityEvents.map((event) => {
                  const eventId = resolveEventId(event);
                  const meta = [fmtEventDate(event.date), fmtEventTime(event.time)].filter(Boolean).join(" · ");
                  return (
                    <button
                      key={event.id || event.title}
                      type="button"
                      onClick={() => navigate(eventId ? `/events/${eventId}` : "/events")}
                      className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 tap-feedback text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{event.title}</p>
                        {meta && <p className="text-xs text-muted-foreground mt-0.5">{meta}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <Button
            variant="ghost"
            className="w-full h-11 text-primary"
            onClick={() => navigate(`/destinations/${encodeURIComponent(trip.city)}`)}
          >
            Explore {trip.city}
          </Button>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 app-px pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        <a
          href={directionsUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
          onClick={(e) => {
            if (!directionsUrl) e.preventDefault();
          }}
        >
          <Button variant="outline" className="w-full" disabled={!directionsUrl}>
            <Navigation className="w-4 h-4" strokeWidth={1.5} /> Directions
          </Button>
        </a>
        {isOwner ? (
          <Button className="flex-1" onClick={() => setFormOpen(true)}>
            <Pencil className="w-4 h-4" strokeWidth={1.5} /> Edit trip
          </Button>
        ) : isFriend ? (
          <Button className="flex-1" onClick={openMessage}>
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} /> Message
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleConnect}>
            <UserPlus className="w-4 h-4" strokeWidth={CONNECT_STROKE} />
            {pendingRequest ? "Connect back" : "Connect"}
          </Button>
        )}
      </div>

      <TripForm open={formOpen} onOpenChange={setFormOpen} initial={trip} onSubmit={submitEdit} />
      {!isOwner && (
        <ReportSheet
          open={reportOpen}
          onOpenChange={setReportOpen}
          target={{ type: "trip", id: trip.id, title: trip.name, ownerId: trip.created_by_id }}
        />
      )}
    </div>
  );
}
