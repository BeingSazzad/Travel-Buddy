import React, { useMemo, useState } from "react";
import { HOTEL_TAG_FILTERS, STAR_OPTIONS } from "@/lib/hotels";
import { useHotels } from "@/lib/useContent";
import HotelCard from "@/components/hotels/HotelCard";
import { cn } from "@/lib/utils";
import { BedDouble } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import FilterPicker from "@/components/common/FilterPicker";
import ListSkeleton from "@/components/common/ListSkeleton";

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

  if (loading) return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Hotels</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Stays curated for women who travel</p>
      <ListSkeleton count={4} />
    </div>
  );

  return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Hotels</h1>
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
        <FilterPicker title="Price" value={price} onChange={setPrice} options={[{ value: "All", label: "Any" }, { value: "<100", label: "Under €100" }, { value: "100-250", label: "€100–250" }, { value: "250-400", label: "€250–400" }, { value: "400+", label: "€400+" }]} />
        <FilterPicker title="Stars" value={stars} onChange={setStars} options={[{ value: "All", label: "Any" }, ...STAR_OPTIONS.map((s) => ({ value: String(s), label: `${s} stars` }))]} />
        <FilterPicker title="Rating" value={rating} onChange={setRating} options={[{ value: "All", label: "Any" }, { value: "4", label: "4.0+" }, { value: "4.5", label: "4.5+" }]} />
        <FilterPicker title="Sort" value={sort} onChange={setSort} options={[{ value: "distance", label: "Nearest" }, { value: "rating", label: "Top rated" }, { value: "price", label: "Price" }]} />
      </div>

      <p className="text-xs text-muted-foreground mt-3 mb-3">{filtered.length} hotels</p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No hotels match your filters"
            description="Try removing a filter or widening your search to see more stays."
            actionLabel="Reset filters"
            onAction={() => { setTags(emptyTags()); setPrice("All"); setStars("All"); setRating("All"); }}
          />
        ) : (
          filtered.map((h) => <HotelCard key={h.name} hotel={h} />)
        )}
      </div>
    </div>
  );
}