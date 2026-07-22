import React, { useState } from "react";
import { RESTAURANTS } from "@/lib/restaurants";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";
import { MapPin, Star } from "lucide-react";

export default function AdminRestaurants() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const items = RESTAURANTS.filter((r) => !query || `${r.name} ${r.city} ${r.cuisine}`.toLowerCase().includes(query));

  return (
    <div>
      <SectionHeader title="Restaurants" subtitle={`${RESTAURANTS.length} curated restaurants (managed content)`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search restaurants…" />
      <ListState loading={false} empty={items.length === 0} emptyText="No restaurants match.">
        <div className="space-y-2">
          {items.map((r) => (
            <div key={r.name} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
              <img src={r.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} /> {r.city}, {r.country} · {r.cuisine}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="flex items-center gap-1 justify-end"><Star className="w-3 h-3 text-amber-500" strokeWidth={1.5} /> {r.rating}</p>
                <p className="text-[11px] text-muted-foreground">{r.reviews} reviews</p>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}