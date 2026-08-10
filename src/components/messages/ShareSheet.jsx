import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Plane } from "lucide-react";

const TABS = [
  { id: "saved", label: "Saved" },
  { id: "trips", label: "Trips" },
  { id: "meet", label: "Meet up" },
];

export default function ShareSheet({ open, onOpenChange, onShare }) {
  const [tab, setTab] = useState("saved");
  const [saved, setSaved] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meetLocation, setMeetLocation] = useState("");
  const [meetNote, setMeetNote] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const [s, t] = await Promise.all([
          base44.entities.SavedItem.list("-created_date", 100).catch(() => []),
          base44.entities.Trip.list("-start_date", 100).catch(() => []),
        ]);
        
        const mockSaved = [
          { id: "mock_s1", type: "cafe", item_key: "cafe_1", title: "Amoudi Sunset Cafe", location: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80", info: "Cozy sunset views over the cliffs" },
          { id: "mock_s2", type: "hotel", item_key: "hotel_1", title: "Copenhagen Boutique Hotel", location: "Copenhagen", country: "Denmark", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", info: "Lovely mid-century interior design" },
          { id: "mock_s3", type: "restaurant", item_key: "rest_1", title: "Marrakech Rooftop Grill", location: "Marrakech", country: "Morocco", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80", info: "Traditional tagines and fresh mint tea" }
        ];
        
        const mockTrips = [
          { id: "mock_t1", name: "Lisbon Getaway", city: "Lisbon", country: "Portugal", start_date: "2026-08-10", end_date: "2026-08-17", cover_image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=400&q=80" },
          { id: "mock_t2", name: "Bali Retreat", city: "Bali", country: "Indonesia", start_date: "2026-08-20", end_date: "2026-08-28", cover_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" }
        ];

        setSaved([...(s || []), ...mockSaved]);
        setTrips([...(t || []).filter((x) => x.visibility !== "hidden"), ...mockTrips]);
      } catch (e) {
        setSaved([
          { id: "mock_s1", type: "cafe", item_key: "cafe_1", title: "Amoudi Sunset Cafe", location: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80", info: "Cozy sunset views over the cliffs" },
          { id: "mock_s2", type: "hotel", item_key: "hotel_1", title: "Copenhagen Boutique Hotel", location: "Copenhagen", country: "Denmark", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", info: "Lovely mid-century interior design" },
          { id: "mock_s3", type: "restaurant", item_key: "rest_1", title: "Marrakech Rooftop Grill", location: "Marrakech", country: "Morocco", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80", info: "Traditional tagines and fresh mint tea" }
        ]);
        setTrips([
          { id: "mock_t1", name: "Lisbon Getaway", city: "Lisbon", country: "Portugal", start_date: "2026-08-10", end_date: "2026-08-17", cover_image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=400&q=80" },
          { id: "mock_t2", name: "Bali Retreat", city: "Bali", country: "Indonesia", start_date: "2026-08-20", end_date: "2026-08-28", cover_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" }
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const shareSaved = (item) => {
    onShare({
      type: "content",
      content_type: item.type,
      content_data: {
        key: item.item_key,
        title: item.title,
        location: [item.location, item.country].filter(Boolean).join(", "),
        image: item.image,
        subtitle: item.info,
      },
    });
  };

  const shareTrip = (trip) => {
    onShare({
      type: "content",
      content_type: "trip",
      content_data: {
        key: trip.id,
        title: trip.name || trip.city,
        location: [trip.city, trip.country].filter(Boolean).join(", "),
        image: trip.cover_image,
        dates: trip.start_date ? `${trip.start_date} → ${trip.end_date}` : "",
      },
    });
  };

  const shareMeet = () => {
    if (!meetLocation.trim()) return;
    onShare({
      type: "content",
      content_type: "meeting",
      content_data: { title: meetLocation.trim(), location: meetNote.trim() },
    });
    setMeetLocation("");
    setMeetNote("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Share in chat</SheetTitle>
        </SheetHeader>

        <div className="flex gap-2 px-4 mt-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${tab === t.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6 mt-3 space-y-2">
          {tab === "saved" &&
            (loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : saved.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved content yet. Save cafés, hotels, destinations and more to share them here.</p>
            ) : (
              saved.map((it) => (
                <button
                  key={it.id || it.item_key}
                  onClick={() => shareSaved(it)}
                  className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/40 text-left"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
                    <Image src={it.image} alt={it.title} fittingType="fill" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{it.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{[it.location, it.country].filter(Boolean).join(", ")}</p>
                  </div>
                  <span className="text-[10px] uppercase text-[#A1846B] capitalize">{it.type}</span>
                </button>
              ))
            ))}

          {tab === "trips" &&
            (loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : trips.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trips to share yet.</p>
            ) : (
              trips.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => shareTrip(tr)}
                  className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/40 text-left"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
                    <Image src={tr.cover_image} alt={tr.name} fittingType="fill" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tr.name || tr.city}</p>
                    <p className="text-xs text-muted-foreground truncate">{[tr.city, tr.country].filter(Boolean).join(", ")}</p>
                  </div>
                  <Plane className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} />
                </button>
              ))
            ))}

          {tab === "meet" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs text-muted-foreground">Approximate area</label>
                <input
                  value={meetLocation}
                  onChange={(e) => setMeetLocation(e.target.value)}
                  placeholder="e.g., Central Lisbon"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">Share a general area only — never an exact private address.</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Note (optional)</label>
                <input
                  value={meetNote}
                  onChange={(e) => setMeetNote(e.target.value)}
                  placeholder="e.g., Morning coffee?"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
              <button
                onClick={shareMeet}
                disabled={!meetLocation.trim()}
                className="w-full rounded-xl bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-40"
              >
                Share meeting spot
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}