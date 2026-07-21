import React from "react";
import { Bookmark, MapPin } from "lucide-react";
import { useSaved } from "@/lib/SavedContext";
import { useNavigate } from "react-router-dom";

const PLACE_TYPES = ["cafe", "restaurant", "hotel", "destination"];

function pathFor(item) {
  const enc = encodeURIComponent(item.title);
  if (item.type === "cafe") return `/cafes/${enc}`;
  if (item.type === "restaurant") return `/restaurants/${enc}`;
  if (item.type === "hotel") return `/hotels/${enc}`;
  if (item.type === "destination") return `/destinations/${encodeURIComponent(item.location || item.title)}`;
  if (item.type === "event") return `/events`;
  if (item.type === "deal") return `/deals`;
  return null;
}

function Group({ label, items, navigate }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{label} ({items.length})</p>
      <div className="space-y-2">
        {items.map((it) => {
          const to = pathFor(it);
          return (
            <button
              key={it.id}
              onClick={() => to && navigate(to)}
              className="w-full text-left flex items-center gap-3 bg-card border border-border shadow-soft rounded-2xl p-2.5"
            >
              {it.image ? (
                <img src={it.image} alt={it.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0"><Bookmark className="w-4 h-4 text-muted-foreground" /></div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{it.title}</h4>
                {it.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {it.location}{it.country ? `, ${it.country}` : ""}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SavedGroups() {
  const { items, loading } = useSaved();
  const navigate = useNavigate();
  const places = items.filter((i) => PLACE_TYPES.includes(i.type));
  const events = items.filter((i) => i.type === "event");
  const deals = items.filter((i) => i.type === "deal");

  if (loading) return <p className="text-sm text-muted-foreground mt-6">Loading saved…</p>;
  if (places.length === 0 && events.length === 0 && deals.length === 0) return null;

  return (
    <div className="mt-6 space-y-5">
      <h3 className="font-display font-semibold text-base">Saved</h3>
      <Group label="Places" items={places} navigate={navigate} />
      <Group label="Events" items={events} navigate={navigate} />
      <Group label="Deals" items={deals} navigate={navigate} />
    </div>
  );
}