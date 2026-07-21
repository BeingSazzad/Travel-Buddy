import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { EVENT_CATEGORIES, defaultEventImage, capitalize } from "@/lib/event-options";

const EMPTY = {
  title: "", category: "coffee", date: "", time: "", location: "",
  city: "", country: "", max_attendees: 10, image: "", description: "",
};

export default function EventForm({ open, onOpenChange, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.city) return;
    try {
      setBusy(true);
      await base44.entities.Event.create({
        ...form,
        image: form.image || defaultEventImage(form.category),
        max_attendees: Number(form.max_attendees) || 10,
        host_name: user?.full_name || "Seluna host",
        host_id: user?.id,
        attendees_count: 0,
      });
      setForm(EMPTY);
      onOpenChange(false);
      onCreated?.();
    } finally {
      setBusy(false);
    }
  };

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const res = await base44.integrations.Core.UploadFile({ file });
    set("image", res.file_url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto pb-6">
        <SheetHeader>
          <SheetTitle className="font-display">Host an event</SheetTitle>
        </SheetHeader>
        <form onSubmit={submit} className="px-4 mt-2 space-y-3">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Event title"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {EVENT_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set("category", c)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${form.category === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
              >
                {capitalize(c)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              placeholder="19:30"
              className="w-28 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </div>
          <input
            required
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Venue / meeting spot"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <div className="flex gap-2">
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="City"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="Country"
              className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </div>
          <input
            type="number"
            min="1"
            value={form.max_attendees}
            onChange={(e) => set("max_attendees", e.target.value)}
            placeholder="Max attendees"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none min-h-[64px] resize-none"
          />
          <label className="block">
            <span className="text-xs text-muted-foreground">Cover image (optional)</span>
            <input type="file" accept="image/*" onChange={onImage} className="block mt-1 text-xs" />
          </label>
          <Button type="submit" disabled={busy} className="w-full bg-foreground text-background">
            Publish event
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}