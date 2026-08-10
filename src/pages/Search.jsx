import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { SEARCH_TYPES, SEARCH_CORPUS } from "@/lib/search-data";
import FilterSheet from "@/components/search/FilterSheet";
import ResultRow from "@/components/search/ResultRow";
import EmptyState from "@/components/common/EmptyState";

const EMPTY_FILTERS = {
  location: "", date: "", categories: [], rating: 0, prices: [], distance: 0, interests: [],
};

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = filters;

    const matches = (item) => {
      if (q) {
        const hay = [item.title, item.location, item.country, ...(item.interests || [])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.location) {
        const loc = [item.location, item.country].join(" ").toLowerCase();
        if (!loc.includes(f.location.toLowerCase())) return false;
      }
      if (f.date) {
        if (!item.date || item.date < f.date) return false;
      }
      if (f.categories.length && !f.categories.includes(item.type)) return false;
      if (f.rating > 0 && (!item.rating || item.rating < f.rating)) return false;
      if (f.prices.length && (!item.price || !f.prices.includes(item.price))) return false;
      if (f.distance > 0 && (item.distance == null || item.distance > f.distance)) return false;
      if (f.interests.length && (!item.interests || !f.interests.some((i) => item.interests.includes(i)))) return false;
      return true;
    };

    const filtered = SEARCH_CORPUS.filter(matches);
    return SEARCH_TYPES.map((t) => ({
      label: t.label,
      items: filtered.filter((i) => i.type === t.value),
    })).filter((g) => g.items.length > 0);
  }, [query, filters]);

  const activeCount =
    (filters.location ? 1 : 0) +
    (filters.date ? 1 : 0) +
    (filters.categories.length ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.prices.length ? 1 : 0) +
    (filters.distance ? 1 : 0) +
    (filters.interests.length ? 1 : 0);

  const hasQuery = query.trim() || activeCount > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-4 safe-pt pb-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-full px-4 h-10">
          <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, places, events or members"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A1846B] text-white text-[10px] font-medium flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </header>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2">
          {filters.location && <ActiveChip label={`Location: ${filters.location}`} onClear={() => setFilters({ ...filters, location: "" })} />}
          {filters.date && <ActiveChip label={`From ${filters.date}`} onClear={() => setFilters({ ...filters, date: "" })} />}
          {filters.rating > 0 && <ActiveChip label={`${filters.rating}+ rating`} onClear={() => setFilters({ ...filters, rating: 0 })} />}
          {filters.distance > 0 && <ActiveChip label={`Within ${filters.distance} km`} onClear={() => setFilters({ ...filters, distance: 0 })} />}
          {filters.categories.map((c) => <ActiveChip key={c} label={c} onClear={() => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) })} />)}
          {filters.prices.map((p) => <ActiveChip key={p} label={p} onClear={() => setFilters({ ...filters, prices: filters.prices.filter((x) => x !== p) })} />)}
          {filters.interests.map((i) => <ActiveChip key={i} label={i} onClear={() => setFilters({ ...filters, interests: filters.interests.filter((x) => x !== i) })} />)}
        </div>
      )}

      {/* Results */}
      <div className="pb-6">
        {results.length === 0 ? (
          <div className="px-5 pt-20">
            <EmptyState
              icon={SearchIcon}
              title="No results found"
              description={hasQuery ? "Try a different search or adjust your filters." : "Start typing to search across Seluna."}
              actionLabel={activeCount > 0 ? "Clear all filters" : undefined}
              onAction={activeCount > 0 ? () => setFilters(EMPTY_FILTERS) : undefined}
            />
          </div>
        ) : (
          results.map((group) => (
            <section key={group.label} className="mt-6">
              <h2 className="font-display font-semibold text-base px-5 mb-1">
                {group.label} <span className="text-xs text-muted-foreground font-normal">({group.items.length})</span>
              </h2>
              <div className="px-3">
                {group.items.map((item) => (
                  <ResultRow key={`${item.type}-${item.title}`} item={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />
    </div>
  );
}

function ActiveChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#A1846B]/10 text-[#A1846B] text-xs font-medium px-2.5 py-1 rounded-full capitalize">
      {label}
      <button onClick={onClear}><X className="w-3 h-3" /></button>
    </span>
  );
}