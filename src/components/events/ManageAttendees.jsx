import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { Check, X, MessageCircle, Trash2 } from "lucide-react";

const FALLBACK = "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80";

export default function ManageAttendees({ open, onOpenChange, event, onChange }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!event) return;
    try {
      setLoading(true);
      const res = await base44.functions.invoke("event-attendees", { event_id: event.id });
      setAttendees(res.data?.attendees || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, event?.id]);

  const act = async (action, attendance_id) => {
    await base44.functions.invoke("rsvp-event", { action, event_id: event.id, attendance_id });
    await load();
    onChange?.();
  };

  const message = async (uid) => {
    const res = await base44.functions.invoke("start-conversation", { target_user_id: uid });
    if (res.data?.conversation_id) {
      onOpenChange(false);
      window.location.href = `/conversations/${res.data.conversation_id}`;
    }
  };

  const going = attendees.filter((a) => a.status === "going");
  const pending = attendees.filter((a) => a.status === "pending");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto pb-6">
        <SheetHeader>
          <SheetTitle className="font-display">Attendees</SheetTitle>
        </SheetHeader>
        <div className="px-4 mt-2">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {pending.length > 0 && (
            <>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Requests ({pending.length})</p>
              <div className="space-y-2 mb-4">
                {pending.map((a) => (
                  <div key={a.attendance_id} className="flex items-center gap-3 p-2 rounded-2xl border border-border">
                    <img src={a.avatar || FALLBACK} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      {a.city && <p className="text-xs text-muted-foreground truncate">{a.city}</p>}
                    </div>
                    <button onClick={() => act("approve", a.attendance_id)} className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={1.5} /></button>
                    <button onClick={() => act("reject", a.attendance_id)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><X className="w-4 h-4" strokeWidth={1.5} /></button>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Going ({going.length}/{event?.max_attendees || 0})</p>
          <div className="space-y-2">
            {going.length === 0 && <p className="text-sm text-muted-foreground">No confirmed attendees yet.</p>}
            {going.map((a) => (
              <div key={a.attendance_id} className="flex items-center gap-3 p-2 rounded-2xl border border-border">
                <img src={a.avatar || FALLBACK} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  {a.city && <p className="text-xs text-muted-foreground truncate">{a.city}</p>}
                </div>
                <button onClick={() => message(a.user_id)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><MessageCircle className="w-4 h-4" strokeWidth={1.5} /></button>
                <button onClick={() => act("remove", a.attendance_id)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-destructive"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}