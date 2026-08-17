import React, { useMemo, useState } from "react";
import { RESTAURANT_TAG_FILTERS, PRICE_LABELS, CUISINES } from "@/lib/restaurants";
import { useRestaurants } from "@/lib/useContent";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { UtensilsCrossed } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
import VenueFilterSheet, { VenueListToolbar, countVenueFilters } from "@/components/common/VenueFilterSheet";

const emptyTags = () => Object.fromEntries(RESTAURANT_TAG_FILTERS.map((t) => [t.key, false]));

const PRICE_OPTIONS = [{ value: "All", label: "Any" }, ...Object.entries(PRICE_LABELS).map(([p, l]) => ({ value: String(p), label: l }))];
const RATING_OPTIONS = [
  { value: "All", label: "Any" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

export default function Restaurants() {
  const { items: restaurants, loading } = useRestaurants();
  const [tags, setTags] = useState(emptyTags());
  const [cuisine, setCuisine] = useState("All");
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const activeFilterCount = countVenueFilters(tags, [cuisine, price, rating]);

  const resetFilters = () => {
    setTags(emptyTags());
    setCuisine("All");
    setPrice("All");
    setRating("All");
  };

  const filtered = useMemo(() => {
    let list = restaurants.filter((r) =>
      Object.entries(tags).every(([k, v]) => !v || r.tags?.[k]) &&
      (cuisine === "All" || r.cuisine === cuisine) &&
      (price === "All" || r.price === Number(price)) &&
      (rating === "All" || r.rating >= Number(rating))
    );
    list = [...list].sort((a, b) =>
      sort === "distance" ? (a.distance || 0) - (b.distance || 0) : (b.rating || 0) - (a.rating || 0)
    );
    return list;
  }, [restaurants, tags, cuisine, price, rating, sort]);

  if (loading) {
    return (
      <div className="page-shell">
        <ScreenHeader title="Restaurants" subtitle="Where to eat, curated for travelers" showBack className="mb-4" />
        <ListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <ScreenHeader title="Restaurants" subtitle="Where to eat, curated for travelers" showBack />

      <VenueListToolbar
        resultLabel={`${filtered.length} restaurants`}
        sort={sort}
        onSortChange={setSort}
        filterOpen={filterOpen}
        onFilterOpen={setFilterOpen}
        activeFilterCount={activeFilterCount}
      />

      <VenueFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Restaurant filters"
        tagItems={RESTAURANT_TAG_FILTERS}
        tagActive={tags}
        onTagToggle={toggle}
        activeCount={activeFilterCount}
        onReset={resetFilters}
        pickers={[
          { title: "Cuisine", value: cuisine, onChange: setCuisine, options: [{ value: "All", label: "Any" }, ...CUISINES.map((c) => ({ value: c, label: c }))] },
          { title: "Price", value: price, onChange: setPrice, options: PRICE_OPTIONS },
          { title: "Rating", value: rating, onChange: setRating, options: RATING_OPTIONS },
        ]}
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No restaurants match your filters"
            description="Try widening filters or reset to see more places."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        ) : (
          filtered.map((r) => <RestaurantCard key={r.name} restaurant={r} />)
        )}
      </div>
    </div>
  );
}
