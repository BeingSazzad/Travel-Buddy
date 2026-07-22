import React, { useState } from "react";
import { DESTINATIONS } from "@/lib/destinations";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";
import { MapPin } from "lucide-react";

export default function AdminDestinations() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const items = DESTINATIONS.filter(
    (d) => !query || `${d.city} ${d.country}`.toLowerCase().includes(query)
  );

  return (
    <div>
      <SectionHeader title="Destinations" subtitle={`${DESTINATIONS.length} curated destinations (managed content)`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search destinations…" />
      <ListState loading={false} empty={items.length === 0} emptyText="No destinations match.">
        <div className="grid grid-cols-2 gap-3">
          {items.map((d) => (
            <div key={d.city} className="rounded-2xl border border-border bg-card overflow-hidden">
              {d.image && <img src={d.image} alt="" className="w-full h-28 object-cover" />}
              <div className="p-3">
                <p className="text-sm font-medium truncate">{d.city}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} /> {d.country}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {d.counts.members} members · {d.counts.events} events
                </p>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}