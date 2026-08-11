import React, { useMemo, useState } from "react";
import { CAFE_TAG_FILTERS, PRICE_LABELS } from "@/lib/cafes";
import { useCafes } from "@/lib/useContent";
import CafeCard from "@/components/cafes/CafeCard";
import { Coffee } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
import VenueFilterSheet, { VenueListToolbar, countVenueFilters } from "@/components/common/VenueFilterSheet";

const emptyTags = () => Object.fromEntries(CAFE_TAG_FILTERS.map((t) => [t.key, false]));

const PRICE_OPTIONS = [{ value: "All", label: "Any" }, ...Object.entries(PRICE_LABELS).map(([p, l]) => ({ value: String(p), label: l }))];
const RATING_OPTIONS = [
  { value: "All", label: "Any" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

export default function Cafes() {
  const { items: cafes, loading } = useCafes();
  const [tags, setTags] = useState(emptyTags());
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const activeFilterCount = countVenueFilters(tags, [price, rating]);

  const resetFilters = () => {
    setTags(emptyTags());
    setPrice("All");
    setRating("All");
  };

  const filtered = useMemo(() => {
    let list = cafes.filter((c) =>
      Object.entries(tags).every(([k, v]) => !v || c.tags?.[k]) &&
      (price === "All" || c.price === Number(price)) &&
      (rating === "All" || c.rating >= Number(rating))
    );
    list = [...list].sort((a, b) =>
      sort === "distance" ? (a.distance || 0) - (b.distance || 0) : (b.rating || 0) - (a.rating || 0)
    );
    return list;
  }, [cafes, tags, price, rating, sort]);

  if (loading) {
    return (
      <div className="page-shell">
        <ScreenHeader title="Cafés" subtitle="Coffee spots for women who travel" className="mb-4" />
        <ListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <ScreenHeader title="Cafés" subtitle="Coffee spots for women who travel" />

      <VenueListToolbar
        resultLabel={`${filtered.length} cafés`}
        sort={sort}
        onSortChange={setSort}
        filterOpen={filterOpen}
        onFilterOpen={setFilterOpen}
        activeFilterCount={activeFilterCount}
      />

      <VenueFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Café filters"
        tagItems={CAFE_TAG_FILTERS}
        tagActive={tags}
        onTagToggle={toggle}
        activeCount={activeFilterCount}
        onReset={resetFilters}
        pickers={[
          { title: "Price", value: price, onChange: setPrice, options: PRICE_OPTIONS },
          { title: "Rating", value: rating, onChange: setRating, options: RATING_OPTIONS },
        ]}
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title="No cafés match your filters"
            description="Try widening filters or reset to see all spots."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        ) : (
          filtered.map((c) => <CafeCard key={c.name} cafe={c} />)
        )}
      </div>
    </div>
  );
}
