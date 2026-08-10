import React, { useMemo, useState } from "react";
import { CAFE_TAG_FILTERS, PRICE_LABELS } from "@/lib/cafes";
import { useCafes } from "@/lib/useContent";
import CafeCard from "@/components/cafes/CafeCard";
import { Coffee } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import FilterPicker from "@/components/common/FilterPicker";
import ListFilterBar from "@/components/common/ListFilterBar";
import ListSkeleton from "@/components/common/ListSkeleton";

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

  if (loading) return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Cafés</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Curated coffee spots for women who travel</p>
      <ListSkeleton count={4} />
    </div>
  );

  return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-bold text-lg">Cafés</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Curated coffee spots for women who travel</p>

      <ListFilterBar tagItems={CAFE_TAG_FILTERS} tagActive={tags} onTagToggle={toggle}>
        <FilterPicker title="Price" value={price} onChange={setPrice} options={[{ value: "All", label: "Any" }, ...Object.entries(PRICE_LABELS).map(([p, l]) => ({ value: String(p), label: l }))]} />
        <FilterPicker title="Rating" value={rating} onChange={setRating} options={[{ value: "All", label: "Any" }, { value: "4", label: "4.0+" }, { value: "4.5", label: "4.5+" }]} />
        <FilterPicker title="Sort" value={sort} onChange={setSort} options={[{ value: "distance", label: "Nearest" }, { value: "rating", label: "Top rated" }]} />
      </ListFilterBar>

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} cafés</p>

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
