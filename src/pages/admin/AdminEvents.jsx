import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";
import { Calendar, MapPin, Users2 } from "lucide-react";

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Event.list("-date", 500);
        setItems(list);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <SectionHeader title="Events" subtitle={`${items.length} events hosted on Seluna`} />
      <ListState loading={loading} empty={items.length === 0} emptyText="No events yet.">
        <div className="space-y-2">
          {items.map((e) => (
            <div key={e.id} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
              {e.image ? (
                <img src={e.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" strokeWidth={1.5} /> {e.date} · {e.time}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} /> {e.city}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="flex items-center gap-1 text-muted-foreground"><Users2 className="w-3 h-3" strokeWidth={1.5} /> {e.attendees_count || 0}/{e.max_attendees || "∞"}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{e.visibility}</span>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}