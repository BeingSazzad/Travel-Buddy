import React, { useMemo, useState } from "react";
import { RESTAURANT_TAG_FILTERS, PRICE_LABELS, CUISINES } from "@/lib/restaurants";
import { useRestaurants } from "@/lib/useContent";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

const emptyTags = () => Object.fromEntries(RESTAURANT_TAG_FILTERS.map((t) => [t.key, false]));

export default function Restaurants() {
  const { items: restaurants, loading } = useRestaurants();
  const [tags, setTags] = useState(emptyTags());
  const [cuisine, setCuisine] = useState("All");
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const filtered = useMemo(() => {
    let list = restaurants.filter((r) =>
      Object.entries(tags).every(([k, v]) => !v || r.tags?.[k]) &&
      (cuisine === "All" || r.cuisine === cuisine) &&
      (price === "All" || r.price === Number(price)) &&
      (rating === "All" || r.rating >= Number(rating))
    );
    list = [...list].sort((a, b) => (sort === "distance" ? (a.distance || 0) - (b.distance || 0) : (b.rating || 0) - (a.rating || 0)));
    return list;
  }, [restaurants, tags, cuisine, price, rating, sort]);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display font-semibold text-2xl">Restaurants</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Where to eat, curated for women who travel</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {RESTAURANT_TAG_FILTERS.map((t) => (
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
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background">
          <option value="All">Cuisine: Any</option>
          {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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

      <p className="text-xs text-muted-foreground mt-3 mb-3">{filtered.length} restaurants</p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No restaurants match your filters"
            description="Try removing a filter or widening your search to see more places."
            actionLabel="Reset filters"
            onAction={() => { setTags(emptyTags()); setCuisine("All"); setPrice("All"); setRating("All"); }}
          />
        ) : (
          filtered.map((r) => <RestaurantCard key={r.name} restaurant={r} />)
        )}
      </div>
    </div>
  );
}