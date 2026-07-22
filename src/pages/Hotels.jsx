import React, { useMemo, useState } from "react";
import { HOTEL_TAG_FILTERS, STAR_OPTIONS } from "@/lib/hotels";
import { useHotels } from "@/lib/useContent";
import HotelCard from "@/components/hotels/HotelCard";
import { cn } from "@/lib/utils";

const emptyTags = () => Object.fromEntries(HOTEL_TAG_FILTERS.map((t) => [t.key, false]));

export default function Hotels() {
  const { items: hotels, loading } = useHotels();
  const [tags, setTags] = useState(emptyTags());
  const [price, setPrice] = useState("All");
  const [stars, setStars] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const filtered = useMemo(() => {
    let list = hotels.filter((h) =>
      Object.entries(tags).every(([k, v]) => !v || h.tags?.[k]) &&
      (price === "All" ||
        (price === "<100" && h.pricePerNight < 100) ||
        (price === "100-250" && h.pricePerNight >= 100 && h.pricePerNight < 250) ||
        (price === "250-400" && h.pricePerNight >= 250 && h.pricePerNight < 400) ||
        (price === "400+" && h.pricePerNight >= 400)) &&
      (stars === "All" || h.stars === Number(stars)) &&
      (rating === "All" || h.memberRating >= Number(rating))
    );
    list = [...list].sort((a, b) =>
      sort === "distance" ? (a.distance || 0) - (b.distance || 0) :
      sort === "rating" ? (b.memberRating || 0) - (a.memberRating || 0) :
      (a.pricePerNight || 0) - (b.pricePerNight || 0)
    );
    return list;
  }, [hotels, tags, price, stars, rating, sort]);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display font-semibold text-2xl">Hotels</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Stays curated for women who travel</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {HOTEL_TAG_FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => toggle(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs whitespace-nowrap border",
              tags[t.key] ? "bg-[#A1846B] text-white border-[#A1846B]" : "border-border text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <select value={price} onChange={(e) => setPrice(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Price: Any</option>
          <option value="<100">Under €100</option>
          <option value="100-250">€100–250</option>
          <option value="250-400">€250–400</option>
          <option value="400+">€400+</option>
        </select>
        <select value={stars} onChange={(e) => setStars(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Stars: Any</option>
          {STAR_OPTIONS.map((s) => <option key={s} value={s}>{s} stars</option>)}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Rating: Any</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="distance">Sort: Nearest</option>
          <option value="rating">Sort: Top rated</option>
          <option value="price">Sort: Price</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground mt-3 mb-3">{filtered.length} hotels</p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No hotels match your filters.</p>
        ) : (
          filtered.map((h) => <HotelCard key={h.name} hotel={h} />)
        )}
      </div>
    </div>
  );
}