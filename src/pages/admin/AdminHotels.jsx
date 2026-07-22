import React, { useState } from "react";
import { HOTELS } from "@/lib/hotels";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";
import { MapPin, Star } from "lucide-react";

export default function AdminHotels() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const items = HOTELS.filter((h) => !query || `${h.name} ${h.city}`.toLowerCase().includes(query));

  return (
    <div>
      <SectionHeader title="Hotels" subtitle={`${HOTELS.length} curated hotels (managed content)`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search hotels…" />
      <ListState loading={false} empty={items.length === 0} emptyText="No hotels match.">
        <div className="space-y-2">
          {items.map((h) => (
            <div key={h.name} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
              <img src={h.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{h.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} /> {h.city}, {h.country} · {h.stars}★
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="flex items-center gap-1 justify-end"><Star className="w-3 h-3 text-amber-500" strokeWidth={1.5} /> {h.memberRating}</p>
                <p className="text-[11px] text-muted-foreground">${h.pricePerNight}/night</p>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}