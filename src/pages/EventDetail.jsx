import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  ShieldCheck,
  MessageCircle,
  Bookmark,
  Pencil,
  UserCheck,
  ChevronDown,
  Users,
  UserRound,
  Navigation,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { AttendeeProfileRow } from "@/components/events/ManageAttendees";
import ReportSheet from "@/components/reports/ReportSheet";
import DeleteEventDialog from "@/components/events/DeleteEventDialog";
import { capitalize, fmtEventWhen } from "@/lib/event-options";
import { useSaved } from "@/lib/SavedContext";
import { savedItemKey } from "@/lib/saved-item-key";
import { findMockEvent, isLocalEventId, hydrateEventPeople, hideEvent } from "@/lib/mock-events";
import { isSameAppUser, isEventHost } from "@/lib/demo-user";
import { getMockConversationId } from "@/lib/member-profile";
import { cn } from "@/lib/utils";
import { FALLBACK_AVATAR_URL } from "@/lib/images";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";

const FALLBACK_AVATAR = FALLBACK_AVATAR_URL;
const HERO_BTN =
  "w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-95 transition-transform";

function Meta({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <p className="flex items-center gap-2 text-sm text-foreground min-w-0">
      <Icon className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      <span className="min-w-0">{children}</span>
    </p>
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
  const [reportOpen, setReportOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const applyRecord = (record) => {
      if (!record) {
        setEvent(null);
        setAttendees([]);
        setHost(null);
        return false;
      }
      const people = hydrateEventPeople(record);
      setEvent(people);
      setAttendees(people.attendees || []);
      const mine =
        isSameAppUser(people.host_id, user?.id) ||
        isSameAppUser(people.created_by_id, user?.id) ||
        isSameAppUser(people.created_by?.id, user?.id);
      if (people.host_id && !mine) {
        setHost({
          name: people.host_name,
          avatar: people.host_avatar,
          user_id: people.host_id,
        });
      } else {
        setHost(null);
      }
      return true;
    };

    if (isLocalEventId(id)) {
      applyRecord(findMockEvent(id));
      setLoading(false);
      return;
    }

    const overlayLocal = (e) => {
      const local = findMockEvent(id);
      if (!local) return hydrateEventPeople(e);
      return hydrateEventPeople({
        ...e,
        host_id: e.host_id || local.host_id,
        created_by_id: e.created_by_id || local.created_by_id,
        host_name: e.host_name || local.host_name,
        host_avatar: e.host_avatar || local.host_avatar,
        lat: e.lat ?? local.lat,
        lng: e.lng ?? local.lng,
        attendees: e.attendees?.length ? e.attendees : local.attendees,
        attendees_count: e.attendees_count || local.attendees_count,
      });
    };

    try {
      const e = overlayLocal(await base44.entities.Event.get(id));
      setEvent(e);
      try {
        const attendeesRes = await base44.functions.invoke("event-attendees", { event_id: id });
        const remote = attendeesRes.data?.attendees;
        setAttendees(
          hydrateEventPeople({
            ...e,
            attendees: remote?.length ? remote : e.attendees,
          }).attendees
        );
      } catch {
        setAttendees(hydrateEventPeople(e).attendees || []);
      }
      const mine =
        isSameAppUser(e.host_id, user?.id) ||
        isSameAppUser(e.created_by_id, user?.id) ||
        isSameAppUser(e.created_by?.id, user?.id);
      if (e?.host_id && !mine) {
        const fallbackHost = {
          name: e.host_name,
          avatar: e.host_avatar,
          user_id: e.host_id,
        };
        try {
          const hp = await base44.functions.invoke("member-profile", { user_id: e.host_id });
          const profile = hp.data?.profile;
          setHost(
            profile
              ? {
                  ...profile,
                  name: profile.name || e.host_name,
                  avatar: profile.avatar || profile.main_photo || e.host_avatar,
                  user_id: profile.user_id || e.host_id,
                }
              : fallbackHost
          );
        } catch {
          setHost(fallbackHost);
        }
      } else {
        setHost(null);
      }
    } catch {
      applyRecord(findMockEvent(id));
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoading />;

  if (!event) {
    return (
      <PageNotFound title="Event not found" backLabel="Back to events" onBack={() => navigate("/events")} />
    );
  }

  const isHost = isEventHost(event, user);
  const myAtt = attendees.find((a) => a.user_id === user?.id);
  const going = attendees.filter((a) => a.status === "going");
  const pending = attendees.filter((a) => a.status === "pending");
  const full = going.length >= (event.max_attendees || 0);
  const goingCount = going.length > 0 ? going.length : event.attendees_count || 0;
  const locationLine = [event.location, event.city, event.country].filter(Boolean).join(", ");
  const areaLine = [event.city, event.country].filter(Boolean).join(", ");
  const meetingPoint = event.location || areaLine;
  const eventLat = event.lat != null ? Number(event.lat) : null;
  const eventLng =
    event.lng != null ? Number(event.lng) : event.lon != null ? Number(event.lon) : null;
  const hasSavedCoords =
    Number.isFinite(eventLat) && Number.isFinite(eventLng);
  const mapCoords = hasSavedCoords ? [eventLat, eventLng] : null;
  const directionsUrl = hasSavedCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${eventLat},${eventLng}`
    : locationLine
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

  const rsvp = async (action, extra = {}) => {
    const join = action === "join";
    const prevAttendees = attendees;
    const prevEvent = event;

    if (join && !myAtt) {
      const status = event.visibility === "approval" ? "pending" : "going";
      setAttendees((prev) => [
        ...prev,
        {
          user_id: user?.id,
          status,
          name: user?.profile_name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "You",
          avatar: user?.main_photo || user?.profile_photos?.[0] || FALLBACK_AVATAR,
          city: user?.current_city,
          attendance_id: `att_${user?.id}`,
        },
      ]);
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

  const cancelEvent = async () => {
    setBusy(true);
    hideEvent(event.id);
    try {
      await base44.functions.invoke("rsvp-event", { action: "cancel", event_id: event.id });
    } catch {
      /* local / demo events have no backend row */
    } finally {
      setBusy(false);
    }
    navigate("/events?tab=mine");
  };

  const primaryCtaLabel = () => {
    if (myAtt?.status === "going") return "You're going";
    if (myAtt?.status === "pending") return "Request sent";
    if (full) return "Event full";
    if (event.visibility === "approval") return "Request to join";
    return "Join event";
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
            {isHost && (
              <button
                type="button"
                onClick={() => navigate(`/events/new?edit=${event.id}`)}
                className={HERO_BTN}
                aria-label="Edit event"
              >
                <Pencil className="w-4.5 h-4.5" strokeWidth={2} />
              </button>
            )}
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
        <div className="app-px pt-5 space-y-5">
          <header>
            <h1 className="font-display font-bold text-2xl leading-tight tracking-tight">
              {event.title}
            </h1>
          </header>

          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          )}

          <div className="space-y-1.5">
            <Meta icon={Calendar}>{dateLine}</Meta>
            <Meta icon={MapPin}>
              {[event.location, event.city, event.country].filter(Boolean).join(" · ")}
            </Meta>
            <Meta icon={Users}>
              {event.max_attendees != null
                ? goingCount > 0
                  ? goingCount >= event.max_attendees
                    ? `${goingCount} going · full (max ${event.max_attendees})`
                    : `${goingCount} going · max ${event.max_attendees}`
                  : `Max ${event.max_attendees} people`
                : goingCount > 0
                  ? `${goingCount} going`
                  : null}
            </Meta>
            {(event.age_min || event.age_max) && (
              <Meta icon={UserRound}>
                Ages {event.age_min || "18"}–{event.age_max || "any"}
              </Meta>
            )}
            {event.languages?.length > 0 && (
              <Meta icon={Globe}>Languages · {event.languages.join(", ")}</Meta>
            )}
            <p className="text-sm text-muted-foreground">
              {event.visibility === "approval" ? "Host approves each request" : "Open to join"}
              {event.pricing === "paid_external" ? " · Paid tickets" : ""}
            </p>
          </div>

          {isHost && (
          <section className="rounded-2xl border border-border bg-card/50 p-4">
            <button
              type="button"
              onClick={() => navigate(`/events/${event.id}/attendees`)}
              className="w-full text-left flex items-start justify-between gap-2 tap-feedback"
            >
              <div className="min-w-0">
                <p className="section-header mb-0.5">
                  {pending.length > 0 ? "Join requests & who’s coming" : "Who’s coming"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {goingCount > 0
                    ? `${goingCount} going${
                        event.max_attendees != null ? ` · max ${event.max_attendees}` : ""
                      }`
                    : event.max_attendees != null
                      ? `No one yet · max ${event.max_attendees}`
                      : "No one has joined yet"}
                  {pending.length > 0 ? ` · ${pending.length} interested` : ""}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
            </button>

            {going.length > 0 ? (
              <div className="space-y-2 mt-3">
                {going.map((a) => (
                  <AttendeeProfileRow
                    key={a.attendance_id || a.user_id}
                    attendee={a}
                    onOpen={(uid) => navigate(`/members/${uid}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-3">
                People who join will show up here.
              </p>
            )}

            {pending.length > 0 && (
              <button
                type="button"
                onClick={() => navigate(`/events/${event.id}/attendees`)}
                className="text-xs font-medium text-primary mt-3 tap-feedback"
              >
                Review {pending.length} interested
              </button>
            )}
          </section>
          )}

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft">
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
                className="w-11 h-11 rounded-full object-cover object-top border border-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{isHost ? "You’re hosting" : "Hosted by"}</p>
                <p className="text-sm font-semibold truncate">{event.host_name || "Seluna host"}</p>
              </div>
            </button>
            {!isHost && event.host_id && (
              <button
                type="button"
                onClick={() => messageUser(event.host_id)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0 tap-feedback"
                aria-label="Message host"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <EventMap
            compact
            coords={mapCoords}
            query={locationLine || meetingPoint}
            label={meetingPoint}
          />

          {event.pricing === "paid_external" && event.external_link && (
            <a
              href={event.external_link}
              target="_blank"
              rel="noreferrer"
              className="block text-sm font-semibold text-primary"
            >
              Get tickets
            </a>
          )}

          <div>
            <button
              type="button"
              onClick={() => setSafetyOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              Safety tips
              <ChevronDown
                className={cn("w-3.5 h-3.5 transition-transform", safetyOpen && "rotate-180")}
                strokeWidth={1.5}
              />
            </button>
            {safetyOpen && (
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5 mt-2">
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
              <h2 className="section-header mb-2">Host tools</h2>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => setDeleteOpen(true)}
                disabled={busy}
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Delete event
              </Button>
            </section>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 app-px pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        {isHost ? (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/events/${event.id}/attendees`)}
            >
              <UserCheck className="w-4 h-4" strokeWidth={1.5} />
              {pending.length > 0 ? `Requests (${pending.length})` : "Who’s coming"}
            </Button>
            <Button className="flex-1" onClick={() => navigate(`/events/new?edit=${event.id}`)}>
              <Pencil className="w-4 h-4" strokeWidth={1.5} /> Edit
            </Button>
          </>
        ) : (
          <>
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
        {myAtt?.status === "going" ? (
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
          </>
        )}
      </div>

      <ReportSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        target={{ type: "event", id: event.id, title: event.title, ownerId: event.host_id }}
      />
      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        event={event}
        onConfirm={cancelEvent}
      />
    </div>
  );
}
