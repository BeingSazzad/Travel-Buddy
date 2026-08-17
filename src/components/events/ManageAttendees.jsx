import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { Check, X, MessageCircle, Trash2 } from "lucide-react";
import { findMockEvent } from "@/lib/mock-events";

const FALLBACK = "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80";

function fallbackAttendees(event, initialAttendees) {
  if (initialAttendees?.length) return initialAttendees;
  if (event?.attendees?.length) return event.attendees;
  const mock = event?.id ? findMockEvent(event.id) : null;
  return mock?.attendees || [];
}

export default function ManageAttendees({ open, onOpenChange, event, initialAttendees, onChange }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!event) return;
    const local = fallbackAttendees(event, initialAttendees);
    try {
      setLoading(true);
      const res = await base44.functions.invoke("event-attendees", { event_id: event.id });
      const remote = res.data?.attendees || [];
      setAttendees(remote.length ? remote : local);
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
      /* demo: update local list */
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
            {pending.length > 0 ? ` · ${pending.length} interested` : ""}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 mt-2">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {pending.length > 0 && (
            <>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
                Interested — waiting for you ({pending.length})
              </p>
              <div className="space-y-2 mb-4">
                {pending.map((a) => (
                  <div key={a.attendance_id || a.user_id} className="flex items-center gap-3 p-2 rounded-2xl border border-border">
                    <img src={a.avatar || FALLBACK} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      {a.city && <p className="text-xs text-muted-foreground truncate">{a.city}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => act("approve", a.attendance_id)}
                      className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center"
                      aria-label="Approve"
                    >
                      <Check className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => act("reject", a.attendance_id)}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                      aria-label="Decline"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
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
              <div key={a.attendance_id || a.user_id} className="flex items-center gap-3 p-2 rounded-2xl border border-border">
                <img src={a.avatar || FALLBACK} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  {a.city && <p className="text-xs text-muted-foreground truncate">{a.city}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => message(a.user_id)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                  aria-label="Message"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => act("remove", a.attendance_id)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
