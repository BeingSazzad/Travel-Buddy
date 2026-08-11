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
  Tag,
  UserRound,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import ManageAttendees from "@/components/events/ManageAttendees";
import ReportSheet from "@/components/reports/ReportSheet";
import { capitalize, fmtEventDateLong } from "@/lib/event-options";
import { useSaved } from "@/lib/SavedContext";
import { savedItemKey } from "@/lib/saved-item-key";
import { findMockEvent } from "@/lib/mock-events";
import { getMockConversationId } from "@/lib/member-profile";
import { cn } from "@/lib/utils";
import { FALLBACK_AVATAR_URL, memberAvatar } from "@/lib/images";

const FALLBACK_AVATAR = FALLBACK_AVATAR_URL;
const HERO_BTN =
  "w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-95 transition-transform";

function MetaRow({ children, onClick, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3.5 min-w-0",
        onClick && "cursor-pointer active:opacity-90",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
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
      const res = await base44.functions.invoke("event-attendees", { event_id: id });
      setAttendees(res.data?.attendees || []);
      if (e?.host_id && e.host_id !== user?.id) {
        const hp = await base44.functions.invoke("member-profile", { user_id: e.host_id });
        setHost(hp.data?.profile || null);
      }
    } catch {
      const mock = findMockEvent(id);
      if (mock) {
        setEvent(mock);
        if (mock.host_id) {
          setHost({
            name: mock.host_name,
            avatar: mock.host_avatar,
            user_id: mock.host_id,
          });
        }
      } else {
        setEvent(null);
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

  const dateLine = [
    fmtEventDateLong(event.date),
    event.end_date && event.end_date !== event.date ? `– ${fmtEventDateLong(event.end_date)}` : null,
    event.time,
    event.end_time ? `– ${event.end_time}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const goingAvatars =
    going.length > 0
      ? going.slice(0, 3).map((a) => a.avatar || FALLBACK_AVATAR)
      : [host?.avatar || event.host_avatar, memberAvatar("mock_1"), memberAvatar("mock_2")].filter(Boolean).slice(0, 3);

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

      <div className="flex-1 overflow-y-auto app-scroll pb-28">
        <div className="app-px pt-5">
          <h1 className="font-display font-bold text-2xl leading-tight tracking-tight text-foreground">
            {event.title}
          </h1>
          {locationLine && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 min-w-0">
              <MapPin className="w-4 h-4 shrink-0 text-primary/80" strokeWidth={1.5} />
              <span className="truncate">{locationLine}</span>
            </p>
          )}

          {/* Meta rows with dividers */}
          <div className="mt-5 border-t border-border/60 divide-y divide-border/60">
            {dateLine && (
              <MetaRow>
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-foreground">{dateLine}</span>
              </MetaRow>
            )}

            {event.max_attendees != null && (
              <MetaRow>
                <Users className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-foreground">
                  Up to {event.max_attendees} attendees
                  {event.visibility === "approval" ? " · approval required" : ""}
                </span>
              </MetaRow>
            )}

            <MetaRow>
              <Tag className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-foreground">
                {event.pricing === "paid_external" ? "Paid (external tickets)" : "Free to join"}
              </span>
            </MetaRow>

            {(event.age_min || event.age_max) && (
              <MetaRow>
                <UserRound className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-foreground">
                  Ages {event.age_min || "any"}–{event.age_max || "any"}
                </span>
              </MetaRow>
            )}

            {goingCount > 0 && (
              <MetaRow>
                <div className="flex items-center shrink-0">
                  {goingAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border-2 border-background -ml-2 first:ml-0"
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground">{goingCount} going</span>
              </MetaRow>
            )}

            <MetaRow
              onClick={!isHost && event.host_id ? () => navigate(`/members/${event.host_id}`) : undefined}
            >
              <img
                src={host?.avatar || event.host_avatar || FALLBACK_AVATAR}
                alt={event.host_name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <span className="text-sm text-foreground">
                Hosted by <span className="font-medium">{event.host_name}</span>
              </span>
            </MetaRow>
          </div>

          {event.description && (
            <section className="mt-7">
              <h2 className="font-display font-semibold text-base mb-2">About this event</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
          )}

          <div className="mt-6">
            <EventMap
              compact
              query={locationLine}
              label={locationLine}
            />
          </div>

          {going.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-semibold text-base">Who&apos;s going</h2>
                <span className="text-xs text-muted-foreground">
                  {going.length}/{event.max_attendees || 0}
                  {pending.length > 0 && isHost ? ` · ${pending.length} pending` : ""}
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {going.slice(0, 10).map((a) => (
                  <img
                    key={a.attendance_id || a.user_id}
                    src={a.avatar || FALLBACK_AVATAR}
                    alt={a.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-background"
                  />
                ))}
                {going.length > 10 && (
                  <span className="text-xs text-muted-foreground">+{going.length - 10}</span>
                )}
              </div>
            </section>
          )}

          {event.languages && event.languages.length > 0 && (
            <section className="mt-6">
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

          {event.pricing === "paid_external" && event.external_link && (
            <a
              href={event.external_link}
              target="_blank"
              rel="noreferrer"
              className="block mt-6 w-full text-center rounded-full border border-border py-2.5 text-sm font-medium"
            >
              Get tickets ↗
            </a>
          )}

          <div className="mt-6 rounded-2xl border border-border/60 bg-card/50 p-4">
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
            <section className="mt-6">
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
                  <UserCheck className="w-4 h-4" strokeWidth={1.5} /> Attendees
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

      {!isHost && (
        <div className="fixed bottom-0 left-0 right-0 z-30 max-w-app mx-auto app-px pt-3 safe-pb bg-background/92 backdrop-blur-xl border-t border-border/60">
          <div className="flex items-center gap-3">
            {myAtt?.status === "going" ? (
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full text-sm font-semibold"
                onClick={() => rsvp("leave")}
                disabled={busy}
              >
                Leave event
              </Button>
            ) : myAtt?.status === "pending" ? (
              <div className="flex-1 flex gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-full" disabled>
                  Request sent
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive h-12 px-4"
                  onClick={() => rsvp("leave")}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="flex-1 h-12 rounded-full text-sm font-semibold shadow-md"
                onClick={() => rsvp("join")}
                disabled={busy || full}
              >
                {primaryCtaLabel()}
              </Button>
            )}
            <button
              type="button"
              onClick={() => messageUser(event.host_id)}
              className="w-12 h-12 shrink-0 rounded-full border border-border bg-card flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Message host"
            >
              <MessageCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      <ManageAttendees open={manageOpen} onOpenChange={setManageOpen} event={event} onChange={load} />
      <ReportSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        target={{ type: "event", id: event.id, title: event.title, ownerId: event.host_id }}
      />
    </div>
  );
}
