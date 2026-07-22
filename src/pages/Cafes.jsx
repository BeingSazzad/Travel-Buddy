import React, { useMemo, useState } from "react";
import { CAFE_TAG_FILTERS, PRICE_LABELS } from "@/lib/cafes";
import { useCafes } from "@/lib/useContent";
import CafeCard from "@/components/cafes/CafeCard";
import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

const emptyTags = () => Object.fromEntries(CAFE_TAG_FILTERS.map((t) => [t.key, false]));

export default function Cafes() {
  const { items: cafes, loading } = useCafes();
  const [tags, setTags] = useState(emptyTags());
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const filtered = useMemo(() => {
    let list = cafes.filter((c) =>
      Object.entries(tags).every(([k, v]) => !v || c.tags?.[k]) &&
      (price === "All" || c.price === Number(price)) &&
      (rating === "All" || c.rating >= Number(rating))
    );
    list = [...list].sort((a, b) => (sort === "distance" ? (a.distance || 0) - (b.distance || 0) : (b.rating || 0) - (a.rating || 0)));
    return list;
  }, [cafes, tags, price, rating, sort]);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display font-semibold text-2xl">Cafés</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Curated coffee spots for women who travel</p>

      {/* Tag filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {CAFE_TAG_FILTERS.map((t) => (
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

      {/* Selects */}
      <div className="flex flex-wrap gap-2 mt-2">
        <select value={price} onChange={(e) => setPrice(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Price: Any</option>
          {Object.entries(PRICE_LABELS).map(([p, l]) => <option key={p} value={p}>{l}</option>)}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Rating: Any</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="distance">Sort: Nearest</option>
          <option value="rating">Sort: Top rated</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground mt-3 mb-3">{filtered.length} cafés</p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title="No cafés match your filters"
            description="Try removing a filter or widening your search to see more spots."
            actionLabel="Reset filters"
            onAction={() => { setTags(emptyTags()); setPrice("All"); setRating("All"); }}
          />
        ) : (
          filtered.map((c) => <CafeCard key={c.name} cafe={c} />)
        )}
      </div>
    </div>
  );
}