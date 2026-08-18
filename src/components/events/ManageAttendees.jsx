import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { Check, ChevronRight, MessageCircle, Trash2, X } from "lucide-react";
import { findMockEvent, padDemoAttendees } from "@/lib/mock-events";

const FALLBACK = "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80";

function fallbackAttendees(event, initialAttendees) {
  if (initialAttendees?.length) return initialAttendees;
  if (event?.attendees?.length) return event.attendees;
  const mock = event?.id ? findMockEvent(event.id) : null;
  return mock?.attendees || [];
}

export function AttendeeProfileRow({ attendee, onOpen, actions }) {
  const name = attendee.name || "Seluna member";
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-3 py-2.5 shadow-soft">
      <button
        type="button"
        onClick={() => attendee.user_id && onOpen?.(attendee.user_id)}
        className="flex flex-1 min-w-0 items-center gap-3 text-left rounded-xl py-0.5 pr-1 tap-feedback"
        disabled={!attendee.user_id}
      >
        <img
          src={attendee.avatar || FALLBACK}
          alt=""
          className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{attendee.city || "Going"}</p>
        </div>
        {attendee.user_id && (
          <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" strokeWidth={1.5} aria-hidden />
        )}
      </button>
      {actions}
    </div>
  );
}

export default function ManageAttendees({ open, onOpenChange, event, initialAttendees, onChange, isHost }) {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const openProfile = (uid) => {
    onOpenChange(false);
    navigate(`/members/${uid}`);
  };

  const load = async () => {
    if (!event) return;
    const local = padDemoAttendees(
      event.id,
      fallbackAttendees(event, initialAttendees),
      event.attendees_count
    );
    try {
      setLoading(true);
      const res = await base44.functions.invoke("event-attendees", { event_id: event.id });
      const remote = res.data?.attendees || [];
      setAttendees(
        padDemoAttendees(event.id, remote.length ? remote : local, event.attendees_count)
      );
    } catch {
      setAttendees(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, event?.id]);

  const act = async (action, attendance_id) => {
    try {
      await base44.functions.invoke("rsvp-event", { action, event_id: event.id, attendance_id });
      await load();
      onChange?.();
    } catch {
      if (action === "approve") {
        setAttendees((prev) =>
          prev.map((a) => (a.attendance_id === attendance_id ? { ...a, status: "going" } : a))
        );
      } else if (action === "reject" || action === "remove") {
        setAttendees((prev) => prev.filter((a) => a.attendance_id !== attendance_id));
      }
      onChange?.();
    }
  };

  const message = async (uid) => {
    try {
      const res = await base44.functions.invoke("start-conversation", { target_user_id: uid });
      if (res.data?.conversation_id) {
        onOpenChange(false);
        window.location.href = `/conversations/${res.data.conversation_id}`;
      }
    } catch {
      /* ignore */
    }
  };

  const going = attendees.filter((a) => a.status === "going");
  const pending = attendees.filter((a) => a.status === "pending");
  const max = event?.max_attendees;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto pb-6">
        <SheetHeader>
          <SheetTitle className="font-display">Who’s coming</SheetTitle>
          <SheetDescription>
            {going.length} going
            {max != null ? ` · max ${max}` : ""}
            {isHost && pending.length > 0 ? ` · ${pending.length} interested` : ""}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 mt-2">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {isHost && pending.length > 0 && (
            <>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
                Interested — waiting for you ({pending.length})
              </p>
              <div className="space-y-2 mb-4">
                {pending.map((a) => (
                  <AttendeeProfileRow
                    key={a.attendance_id || a.user_id}
                    attendee={a}
                    onOpen={openProfile}
                    actions={
                      <>
                        <button
                          type="button"
                          onClick={() => act("approve", a.attendance_id)}
                          className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0"
                          aria-label="Approve"
                        >
                          <Check className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => act("reject", a.attendance_id)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0"
                          aria-label="Decline"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </>
                    }
                  />
                ))}
              </div>
            </>
          )}

          <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
            Going ({going.length}{max != null ? ` of max ${max}` : ""})
          </p>
          <div className="space-y-2">
            {going.length === 0 && (
              <p className="text-sm text-muted-foreground">No confirmed attendees yet.</p>
            )}
            {going.map((a) => (
              <AttendeeProfileRow
                key={a.attendance_id || a.user_id}
                attendee={a}
                onOpen={openProfile}
                actions={
                  isHost ? (
                    <>
                      <button
                        type="button"
                        onClick={() => message(a.user_id)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0"
                        aria-label="Message"
                      >
                        <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => act("remove", a.attendance_id)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-destructive shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </>
                  ) : null
                }
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
