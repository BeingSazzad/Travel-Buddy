import React, { useMemo, useState } from "react";
import { RESTAURANT_TAG_FILTERS, PRICE_LABELS, CUISINES } from "@/lib/restaurants";
import { useRestaurants } from "@/lib/useContent";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import ListFilterBar from "@/components/common/ListFilterBar";
import { UtensilsCrossed } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import FilterPicker from "@/components/common/FilterPicker";
import ListSkeleton from "@/components/common/ListSkeleton";

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

  if (loading) return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Restaurants</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Where to eat, curated for women who travel</p>
      <ListSkeleton count={4} />
    </div>
  );

  return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Restaurants</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Where to eat, curated for women who travel</p>

      <ListFilterBar tagItems={RESTAURANT_TAG_FILTERS} tagActive={tags} onTagToggle={toggle}>
        <FilterPicker title="Cuisine" value={cuisine} onChange={setCuisine} options={[{ value: "All", label: "Any" }, ...CUISINES.map((c) => ({ value: c, label: c }))]} />
        <FilterPicker title="Price" value={price} onChange={setPrice} options={[{ value: "All", label: "Any" }, ...Object.entries(PRICE_LABELS).map(([p, l]) => ({ value: String(p), label: l }))]} />
        <FilterPicker title="Rating" value={rating} onChange={setRating} options={[{ value: "All", label: "Any" }, { value: "4", label: "4.0+" }, { value: "4.5", label: "4.5+" }]} />
        <FilterPicker title="Sort" value={sort} onChange={setSort} options={[{ value: "distance", label: "Nearest" }, { value: "rating", label: "Top rated" }]} />
      </ListFilterBar>

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} restaurants</p>

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