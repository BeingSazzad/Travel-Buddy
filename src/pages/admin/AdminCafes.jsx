import React, { useState } from "react";
import { CAFES } from "@/lib/cafes";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";
import { MapPin, Star } from "lucide-react";

export default function AdminCafes() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const items = CAFES.filter((c) => !query || `${c.name} ${c.city}`.toLowerCase().includes(query));

  return (
    <div>
      <SectionHeader title="Cafés" subtitle={`${CAFES.length} curated cafés (managed content)`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search cafés…" />
      <ListState loading={false} empty={items.length === 0} emptyText="No cafés match.">
        <div className="space-y-2">
          {items.map((c) => (
            <div key={c.name} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
              <img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} /> {c.city}, {c.country}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="flex items-center gap-1 justify-end"><Star className="w-3 h-3 text-amber-500" strokeWidth={1.5} /> {c.rating}</p>
                <p className="text-[11px] text-muted-foreground">{c.reviews} reviews</p>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}