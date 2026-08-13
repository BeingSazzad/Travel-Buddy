import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  ShieldCheck,
  Share2,
  MessageCircle,
  Bookmark,
  Pencil,
  UserX,
  UserCheck,
  ChevronDown,
  Users,
  UserRound,
  Navigation,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import ManageAttendees from "@/components/events/ManageAttendees";
import ReportSheet from "@/components/reports/ReportSheet";
import { capitalize, fmtEventWhen } from "@/lib/event-options";
import { useSaved } from "@/lib/SavedContext";
import { savedItemKey } from "@/lib/saved-item-key";
import { findMockEvent } from "@/lib/mock-events";
import { getMockConversationId } from "@/lib/member-profile";
import { cn } from "@/lib/utils";
import { FALLBACK_AVATAR_URL } from "@/lib/images";

const FALLBACK_AVATAR = FALLBACK_AVATAR_URL;
const HERO_BTN =
  "w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-95 transition-transform";

function Fact({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-primary/80" strokeWidth={1.75} />}
        {label}
      </p>
      <p className="text-sm text-foreground mt-0.5 leading-snug">{value}</p>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSaved, toggle } = useSaved();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const e = await base44.entities.Event.get(id);
      setEvent(e);
      try {
        const res = await base44.functions.invoke("event-attendees", { event_id: id });
        setAttendees(res.data?.attendees || []);
      } catch {
        setAttendees(e.attendees || []);
      }
      if (e?.host_id && e.host_id !== user?.id) {
        try {
          const hp = await base44.functions.invoke("member-profile", { user_id: e.host_id });
          setHost(hp.data?.profile || null);
        } catch {
          setHost(null);
        }
      } else {
        setHost(null);
      }
    } catch {
      const mock = findMockEvent(id);
      if (mock) {
        setEvent(mock);
        setAttendees(mock.attendees || []);
        if (mock.host_id) {
          setHost({
            name: mock.host_name,
            avatar: mock.host_avatar,
            user_id: mock.host_id,
          });
        } else {
          setHost(null);
        }
      } else {
        setEvent(null);
        setAttendees([]);
        setHost(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading event…
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Event not found</p>
        <button onClick={() => navigate("/events")} className="text-sm text-primary underline">
          Back to events
        </button>
      </div>
    );
  }

  const isHost = event.host_id === user?.id;
  const myAtt = attendees.find((a) => a.user_id === user?.id);
  const going = attendees.filter((a) => a.status === "going");
  const pending = attendees.filter((a) => a.status === "pending");
  const full = going.length >= (event.max_attendees || 0);
  const goingCount = going.length > 0 ? going.length : event.attendees_count || 0;
  const locationLine = [event.location, event.city, event.country].filter(Boolean).join(", ");
  const areaLine = [event.city, event.country].filter(Boolean).join(", ");
  const meetingPoint = event.location || areaLine;
  const directionsUrl = locationLine
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationLine)}`
    : null;

  const savedItem = {
    type: "event",
    title: event.title,
    location: [event.city, event.country].filter(Boolean).join(", "),
    country: event.country,
    image: event.image,
    date: event.date,
    eventId: event.id,
  };
  const savedKey = savedItemKey(savedItem);
  const saved = isSaved(savedKey);

  const dateLine = fmtEventWhen(event);

  const goingAvatars =
    going.length > 0
      ? going.slice(0, 3).map((a) => a.avatar || FALLBACK_AVATAR)
      : [host?.avatar || event.host_avatar].filter(Boolean);

  const rsvp = async (action, extra = {}) => {
    const join = action === "join";
    const prevAttendees = attendees;
    const prevEvent = event;

    if (join && !myAtt) {
      const status = event.visibility === "approval" ? "pending" : "going";
      setAttendees((prev) => [...prev, { user_id: user?.id, status }]);
      if (status === "going") {
        setEvent((e) => ({ ...e, attendees_count: (e.attendees_count || 0) + 1 }));
      }
    } else if (!join && myAtt) {
      setAttendees((prev) => prev.filter((a) => a.user_id !== user?.id));
      if (myAtt.status === "going") {
        setEvent((e) => ({ ...e, attendees_count: Math.max(0, (e.attendees_count || 0) - 1) }));
      }
    }

    try {
      setBusy(true);
      const res = await base44.functions.invoke("rsvp-event", { action, event_id: event.id, ...extra });
      if (res.data?.full) {
        setAttendees(prevAttendees);
        setEvent(prevEvent);
        alert("This event is full.");
        return;
      }
      if (!String(event.id).startsWith("event_mock")) {
        await load();
      }
    } catch {
      if (!String(event.id).startsWith("event_mock")) {
        setAttendees(prevAttendees);
        setEvent(prevEvent);
      }
    } finally {
      setBusy(false);
    }
  };

  const messageUser = async (uid) => {
    if (!uid) return;
    if (!uid.startsWith("mock_")) {
      try {
        const res = await base44.functions.invoke("start-conversation", { target_user_id: uid });
        if (res.data?.conversation_id) {
          navigate(`/conversations/${res.data.conversation_id}`);
          return;
        }
      } catch {
        /* fall through to mock */
      }
    }
    navigate(`/conversations/${getMockConversationId(uid)}`);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, url });
      } catch {
        /* ignore */
      }
    } else {
      navigator.clipboard?.writeText(url);
      alert("Link copied");
    }
  };

  const cancelEvent = async () => {
    if (!window.confirm("Cancel this event? This can't be undone.")) return;
    await base44.functions.invoke("rsvp-event", { action: "cancel", event_id: event.id });
    navigate("/events");
  };

  const primaryCtaLabel = () => {
    if (myAtt?.status === "going") return "You're going";
    if (myAtt?.status === "pending") return "Request sent";
    if (full) return "Event full";
    if (event.visibility === "approval") return "Request to join";
    return "I'm interested";
  };

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      {/* Hero — controls overlaid on image */}
      <div className="relative h-[min(52vh,420px)] shrink-0 bg-muted">
        <Image
          src={event.image}
          alt={event.title}
          fittingType="fill"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75 pointer-events-none" />

        <div className="absolute top-0 inset-x-0 z-20 safe-pt px-4 pb-3 flex items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className={HERO_BTN} aria-label="Back">
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={share} className={HERO_BTN} aria-label="Share">
              <Share2 className="w-4.5 h-4.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => toggle(savedItem)}
              className={HERO_BTN}
              aria-label={saved ? "Remove from saved" : "Save event"}
            >
              <Bookmark
                className={cn("w-4.5 h-4.5", saved && "fill-brand-gold text-brand-gold")}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            {event.category ? capitalize(event.category) : "Event"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto app-scroll pb-6">
        <div className="app-px pt-5 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {event.visibility === "approval" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/12 text-primary border border-primary/25">
                  Approval required
                </span>
              )}
              {event.pricing === "paid_external" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                  Paid tickets
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl leading-tight tracking-tight text-foreground">
              {event.title}
            </h1>
            {areaLine && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 min-w-0">
                <MapPin className="w-4 h-4 shrink-0 text-primary/80" strokeWidth={1.5} />
                <span className="truncate">{areaLine}</span>
              </p>
            )}
          </div>

          {/* Key facts — scannable, not a long divider list */}
          <div className="rounded-2xl border border-border/70 bg-card/40 p-4 space-y-4">
            <Fact icon={Calendar} label="When" value={dateLine} />
            <div className="grid grid-cols-2 gap-4">
              <Fact
                icon={Users}
                label="Spots"
                value={
                  event.max_attendees != null
                    ? `${goingCount}/${event.max_attendees} filled`
                    : goingCount > 0
                      ? `${goingCount} going`
                      : null
                }
              />
              {(event.age_min || event.age_max) && (
                <Fact
                  icon={UserRound}
                  label="Ages"
                  value={`${event.age_min || "any"}–${event.age_max || "any"}`}
                />
              )}
            </div>
          </div>

          {/* Who's interested / going — host can open manage sheet */}
          <button
            type="button"
            onClick={isHost ? () => setManageOpen(true) : undefined}
            className={cn(
              "w-full text-left rounded-2xl border border-border/70 bg-card/40 p-4",
              isHost && "tap-feedback"
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="font-display font-semibold text-sm">
                {isHost && pending.length > 0 ? "Join requests" : "Who's going"}
              </p>
              <span className="text-xs text-muted-foreground shrink-0">
                {isHost && pending.length > 0
                  ? `${pending.length} to review`
                  : goingCount > 0
                    ? `${goingCount} going`
                    : "Be the first"}
              </span>
            </div>
            {goingAvatars.length > 0 || (isHost && pending.length > 0) ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {(isHost && pending.length > 0
                    ? pending.slice(0, 3).map((a) => a.avatar || FALLBACK_AVATAR)
                    : goingAvatars
                  ).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border-2 border-background -ml-2 first:ml-0"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground flex-1 min-w-0">
                  {isHost && pending.length > 0
                    ? "Tap to approve or decline"
                    : (() => {
                        const names = going.slice(0, 2).map((a) => a.name).filter(Boolean);
                        if (!names.length) return `${goingCount} going`;
                        return names.join(", ") + (goingCount > 2 ? ` +${goingCount - 2}` : "");
                      })()}
                </p>
                {isHost && (
                  <ChevronDown className="w-4 h-4 -rotate-90 text-muted-foreground shrink-0" strokeWidth={1.5} />
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No one has joined yet.</p>
            )}
          </button>

          {/* Host */}
          <div className="w-full flex items-center gap-3 rounded-2xl border border-border/70 bg-card/40 p-3.5">
            <button
              type="button"
              onClick={!isHost && event.host_id ? () => navigate(`/members/${event.host_id}`) : undefined}
              className={cn(
                "flex items-center gap-3 flex-1 min-w-0 text-left",
                !isHost && event.host_id && "tap-feedback"
              )}
            >
              <img
                src={host?.avatar || event.host_avatar || FALLBACK_AVATAR}
                alt=""
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Host</p>
                <p className="text-sm font-semibold truncate">{event.host_name || "Seluna host"}</p>
              </div>
            </button>
            {!isHost && event.host_id && (
              <button
                type="button"
                onClick={() => messageUser(event.host_id)}
                className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center shrink-0"
                aria-label="Message host"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {event.description && (
            <section>
              <h2 className="font-display font-semibold text-base mb-2">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
          )}

          {event.languages && event.languages.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-base mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" strokeWidth={1.5} /> Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.languages.map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {l}
                  </span>
                ))}
              </div>
            </section>
          )}

          <EventMap compact query={locationLine || meetingPoint} label={meetingPoint} />

          {event.pricing === "paid_external" && event.external_link && (
            <a
              href={event.external_link}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center rounded-2xl border border-border py-3 text-sm font-semibold"
            >
              Get tickets ↗
            </a>
          )}

          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <button
              type="button"
              onClick={() => setSafetyOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 text-left"
            >
              <h2 className="font-display font-semibold text-base flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.5} /> Safety tips
              </h2>
              <ChevronDown
                className={cn("w-4 h-4 text-muted-foreground transition-transform", safetyOpen && "rotate-180")}
                strokeWidth={1.5}
              />
            </button>
            {safetyOpen && (
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5 mt-3">
                <li>Meet in public spaces; this event should not share private home addresses.</li>
                <li>Friendship and travel focus only — report any inappropriate behaviour.</li>
                <li>Trust your instincts and leave if anything feels unsafe.</li>
                <li>
                  {event.visibility === "approval"
                    ? "The host approves every request before you can attend."
                    : "Anyone in the community can join this event."}
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="text-primary underline underline-offset-2"
                  >
                    Report this event
                  </button>
                </li>
              </ul>
            )}
          </div>

          {isHost && (
            <section>
              <h2 className="font-display font-semibold text-base mb-2">Host tools</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => navigate(`/events/new?edit=${event.id}`)}
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.5} /> Edit
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={() => setManageOpen(true)}>
                  <UserCheck className="w-4 h-4" strokeWidth={1.5} />
                  Attendees{pending.length > 0 ? ` (${pending.length})` : ""}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2 col-span-2 text-destructive"
                  onClick={cancelEvent}
                >
                  <UserX className="w-4 h-4" strokeWidth={1.5} /> Cancel event
                </Button>
              </div>
            </section>
          )}
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
        {isHost ? (
          <Button className="flex-1" onClick={() => setManageOpen(true)}>
            <UserCheck className="w-4 h-4" strokeWidth={1.5} />
            {pending.length > 0 ? `Requests (${pending.length})` : "Attendees"}
          </Button>
        ) : myAtt?.status === "going" ? (
          <Button variant="outline" className="flex-1" onClick={() => rsvp("leave")} disabled={busy}>
            Leave event
          </Button>
        ) : myAtt?.status === "pending" ? (
          <Button variant="outline" className="flex-1" onClick={() => rsvp("leave")} disabled={busy}>
            Cancel request
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => rsvp("join")} disabled={busy || full}>
            {primaryCtaLabel()}
          </Button>
        )}
      </div>

      <ManageAttendees open={manageOpen} onOpenChange={setManageOpen} event={event} onChange={load} />
      <ReportSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        target={{ type: "event", id: event.id, title: event.title, ownerId: event.host_id }}
      />
    </div>
  );
}
