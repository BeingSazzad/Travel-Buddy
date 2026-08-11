import React, { useMemo, useState } from "react";
import { HOTEL_TAG_FILTERS, STAR_OPTIONS } from "@/lib/hotels";
import { useHotels } from "@/lib/useContent";
import HotelCard from "@/components/hotels/HotelCard";
import { BedDouble } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
import VenueFilterSheet, { VenueListToolbar, countVenueFilters } from "@/components/common/VenueFilterSheet";

const emptyTags = () => Object.fromEntries(HOTEL_TAG_FILTERS.map((t) => [t.key, false]));

const PRICE_OPTIONS = [
  { value: "All", label: "Any" },
  { value: "<100", label: "Under €100" },
  { value: "100-250", label: "€100–250" },
  { value: "250-400", label: "€250–400" },
  { value: "400+", label: "€400+" },
];
const RATING_OPTIONS = [
  { value: "All", label: "Any" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

export default function Hotels() {
  const { items: hotels, loading } = useHotels();
  const [tags, setTags] = useState(emptyTags());
  const [price, setPrice] = useState("All");
  const [stars, setStars] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const activeFilterCount = countVenueFilters(tags, [price, stars, rating]);

  const resetFilters = () => {
    setTags(emptyTags());
    setPrice("All");
    setStars("All");
    setRating("All");
  };

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
      sort === "distance"
        ? (a.distance || 0) - (b.distance || 0)
        : sort === "rating"
          ? (b.memberRating || 0) - (a.memberRating || 0)
          : (a.pricePerNight || 0) - (b.pricePerNight || 0)
    );
    return list;
  }, [hotels, tags, price, stars, rating, sort]);

  if (loading) {
    return (
      <div className="page-shell">
        <ScreenHeader title="Hotels" subtitle="Stays curated for women who travel" className="mb-4" />
        <ListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <ScreenHeader title="Hotels" subtitle="Stays curated for women who travel" />

      <VenueListToolbar
        resultLabel={`${filtered.length} hotels`}
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "distance", label: "Nearest" },
          { value: "rating", label: "Top rated" },
          { value: "price", label: "Price" },
        ]}
        filterOpen={filterOpen}
        onFilterOpen={setFilterOpen}
        activeFilterCount={activeFilterCount}
      />

      <VenueFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Hotel filters"
        tagItems={HOTEL_TAG_FILTERS}
        tagActive={tags}
        onTagToggle={toggle}
        activeCount={activeFilterCount}
        onReset={resetFilters}
        pickers={[
          { title: "Price", value: price, onChange: setPrice, options: PRICE_OPTIONS },
          { title: "Stars", value: stars, onChange: setStars, options: [{ value: "All", label: "Any" }, ...STAR_OPTIONS.map((s) => ({ value: String(s), label: `${s} stars` }))] },
          { title: "Rating", value: rating, onChange: setRating, options: RATING_OPTIONS },
        ]}
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No hotels match your filters"
            description="Try widening filters or reset to see more stays."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        ) : (
          filtered.map((h) => <HotelCard key={h.name} hotel={h} />)
        )}
      </div>
    </div>
  );
}
