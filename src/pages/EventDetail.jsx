import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Globe, ShieldCheck, Flag, Share2, MessageCircle, Bookmark, Pencil, UserX, UserCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import ManageAttendees from "@/components/events/ManageAttendees";
import ReportSheet from "@/components/reports/ReportSheet";
import { capitalize, fmtEventDate } from "@/lib/event-options";
import { useSaved } from "@/lib/SavedContext";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80";

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

  const load = async () => {
    try {
      const e = await base44.entities.Event.get(id);
      setEvent(e);
      const res = await base44.functions.invoke("event-attendees", { event_id: id });
      setAttendees(res.data?.attendees || []);
      if (e?.host_id && e.host_id !== user?.id) {
        const hp = await base44.functions.invoke("member-profile", { user_id: e.host_id });
        setHost(hp.data?.profile || null);
      }
    } catch (e) {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">Loading event…</div>;
  if (!event)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Event not found</p>
        <button onClick={() => navigate("/events")} className="text-sm text-[#A1846B] underline">Back to events</button>
      </div>
    );

  const isHost = event.host_id === user?.id;
  const myAtt = attendees.find((a) => a.user_id === user?.id);
  const going = attendees.filter((a) => a.status === "going");
  const pending = attendees.filter((a) => a.status === "pending");
  const full = going.length >= (event.max_attendees || 0);

  const savedKey = `event:${event.title}`;
  const saved = isSaved(savedKey);
  const savedItem = {
    type: "event", title: event.title,
    location: [event.city, event.country].filter(Boolean).join(", "),
    country: event.country, image: event.image, date: event.date,
  };

  const rsvp = async (action, extra = {}) => {
    try {
      setBusy(true);
      const res = await base44.functions.invoke("rsvp-event", { action, event_id: event.id, ...extra });
      if (res.data?.full) { alert("This event is full."); return; }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const messageUser = async (uid) => {
    const res = await base44.functions.invoke("start-conversation", { target_user_id: uid });
    if (res.data?.conversation_id) navigate(`/conversations/${res.data.conversation_id}`);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: event.title, url }); } catch (e) {}
    } else {
      navigator.clipboard?.writeText(url);
      alert("Link copied");
    }
  };

  const report = () => setReportOpen(true);

  const cancelEvent = async () => {
    if (!window.confirm("Cancel this event? This can't be undone.")) return;
    await base44.functions.invoke("rsvp-event", { action: "cancel", event_id: event.id });
    navigate("/events");
  };

  return (
    <div className="max-w-md mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-4 safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-1">
          <button onClick={share} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={report} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground"><Flag className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-56 -mt-2">
          <Image src={event.image} alt={event.title} fittingType="fill" className="w-full h-full" />
          <div className="absolute bottom-3 left-4">
            <span className="bg-white/90 backdrop-blur text-[11px] uppercase tracking-wide font-medium text-[#7a5c44] px-2.5 py-1 rounded-full">{capitalize(event.category)}</span>
          </div>
        </div>

        <div className="px-5 pt-4">
          <h1 className="font-display font-semibold text-2xl leading-tight">{event.title}</h1>

          {/* Host */}
          <div className="flex items-center gap-3 mt-4">
            <img src={host?.avatar || FALLBACK_AVATAR} alt={event.host_name} className="w-11 h-11 rounded-full object-cover border border-border" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Hosted by</p>
              <p className="font-medium text-sm truncate">{event.host_name}</p>
            </div>
            {!isHost && (
              <Button variant="outline" size="sm" onClick={() => messageUser(event.host_id)} className="gap-1.5">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} /> Message
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#A1846B] shrink-0" strokeWidth={1.5} />
              <span>{fmtEventDate(event.date)}{event.time ? ` · ${event.time}` : ""}{event.end_time ? `–${event.end_time}` : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#A1846B] shrink-0" strokeWidth={1.5} />
              <span>{[event.location, event.city, event.country].filter(Boolean).join(", ")}</span>
            </div>
          </div>

          {/* Map */}
          <div className="mt-4">
            <EventMap query={[event.location, event.city, event.country].filter(Boolean).join(", ")} />
          </div>

          {/* Description */}
          {event.description && (
            <div className="mt-6">
              <h2 className="font-display font-semibold text-base mb-2">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Attendees */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-semibold text-base">Attendees</h2>
              <span className="text-xs text-muted-foreground">{going.length}/{event.max_attendees || 0} going{pending.length > 0 && isHost ? ` · ${pending.length} pending` : ""}</span>
            </div>
            {going.length === 0 ? (
              <p className="text-sm text-muted-foreground">Be the first to join.</p>
            ) : (
              <div className="flex items-center">
                {going.slice(0, 8).map((a) => (
                  <img key={a.attendance_id} src={a.avatar || FALLBACK_AVATAR} alt={a.name} className="w-9 h-9 rounded-full object-cover border-2 border-background -ml-2 first:ml-0" />
                ))}
                {going.length > 8 && <span className="ml-2 text-xs text-muted-foreground">+{going.length - 8}</span>}
              </div>
            )}
          </div>

          {/* Languages */}
          {event.languages && event.languages.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display font-semibold text-base mb-2 flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} /> Languages</h2>
              <div className="flex flex-wrap gap-2">
                {event.languages.map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-[#A1846B]/10 text-[#7a5c44]">{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Paid / external */}
          {event.pricing === "paid_external" && event.external_link && (
            <a href={event.external_link} target="_blank" rel="noreferrer" className="block mt-6 w-full text-center rounded-full border border-border py-2.5 text-sm font-medium">Get tickets ↗</a>
          )}

          {/* Safety */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <h2 className="font-display font-semibold text-base mb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} /> Safety</h2>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>Meet in public spaces; this event should not share private home addresses.</li>
              <li>Friendship and travel focus only — report any inappropriate behaviour.</li>
              <li>Trust your instincts and leave if anything feels unsafe.</li>
              <li>{event.visibility === "approval" ? "The host approves every request before you can attend." : "Anyone in the community can join this event."}</li>
            </ul>
          </div>

          {/* Host panel */}
          {isHost && (
            <div className="mt-6">
              <h2 className="font-display font-semibold text-base mb-2">Host tools</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start gap-2" onClick={() => navigate(`/events/new?edit=${event.id}`)}><Pencil className="w-4 h-4" strokeWidth={1.5} /> Edit</Button>
                <Button variant="outline" className="justify-start gap-2" onClick={() => setManageOpen(true)}><UserCheck className="w-4 h-4" strokeWidth={1.5} /> Attendees</Button>
                <Button variant="outline" className="justify-start gap-2 col-span-2 text-destructive" onClick={cancelEvent}><UserX className="w-4 h-4" strokeWidth={1.5} /> Cancel event</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      {!isHost && (
        <div className="sticky bottom-0 px-5 pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex items-center gap-2">
          <button
            onClick={() => toggle(savedItem)}
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0"
          >
            <Bookmark className={`w-5 h-5 ${saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground"}`} strokeWidth={1.5} />
          </button>
          {myAtt?.status === "going" ? (
            <Button variant="outline" className="flex-1 h-11" onClick={() => rsvp("leave")} disabled={busy}>Leave event</Button>
          ) : myAtt?.status === "pending" ? (
            <Button variant="outline" className="flex-1 h-11" disabled>Request sent</Button>
          ) : (
            <Button className="flex-1 h-11 bg-foreground text-background" onClick={() => rsvp("join")} disabled={busy || full}>
              {full ? "Full" : event.visibility === "approval" ? "Request to join" : "Join event"}
            </Button>
          )}
          {myAtt?.status === "pending" && (
            <Button variant="ghost" className="text-destructive h-11" onClick={() => rsvp("leave")} disabled={busy}>Cancel</Button>
          )}
        </div>
      )}

      <ManageAttendees open={manageOpen} onOpenChange={setManageOpen} event={event} onChange={load} />
      <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "event", id: event.id, title: event.title, ownerId: event.host_id }} />
    </div>
  );
}