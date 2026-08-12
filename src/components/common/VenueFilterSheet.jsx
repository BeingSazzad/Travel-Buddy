import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import TagFilterChips from "@/components/common/TagFilterChips";
import FilterPicker from "@/components/common/FilterPicker";
import { cn } from "@/lib/utils";

export default function VenueFilterSheet({
  open,
  onOpenChange,
  title = "Filters",
  description = "Narrow results by amenities, price & rating",
  tagLabel = "Amenities",
  tagItems,
  tagActive,
  onTagToggle,
  pickers = [],
  onReset,
  activeCount = 0,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[28px] max-h-[80vh] overflow-y-auto px-0">
        <SheetHeader className="sheet-gutter pb-3 border-b border-border/50 flex flex-row items-start justify-between gap-3">
          <div>
            <SheetTitle className="font-display text-lg font-bold text-left">{title}</SheetTitle>
            <p className="text-xs text-muted-foreground text-left mt-0.5">
              {activeCount > 0 ? `${activeCount} active` : description}
            </p>
          </div>
          {activeCount > 0 && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-primary flex items-center gap-1 shrink-0 mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </SheetHeader>

        <div className="sheet-gutter py-4 space-y-5">
          {tagItems?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {tagLabel}
              </p>
              <TagFilterChips items={tagItems} active={tagActive} onToggle={onTagToggle} />
            </div>
          )}

          {pickers.length > 0 && (
            <div className="space-y-2">
              {pickers.map((p) => (
                <div key={p.title}>
                  <p className="text-[11px] font-medium text-muted-foreground mb-1.5">{p.title}</p>
                  <FilterPicker
                    title={p.title}
                    value={p.value}
                    onChange={p.onChange}
                    options={p.options}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="sheet-gutter pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-border/50 pt-3">
          <Button className="w-full h-11 rounded-full" onClick={() => onOpenChange(false)}>
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function VenueListToolbar({
  resultLabel,
  sort,
  onSortChange,
  sortOptions = [
    { value: "distance", label: "Nearest" },
    { value: "rating", label: "Top rated" },
  ],
  filterOpen,
  onFilterOpen,
  activeFilterCount = 0,
}) {
  const showSort = Boolean(onSortChange && sortOptions?.length);

  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <p className="text-xs text-muted-foreground shrink-0">{resultLabel}</p>

      <div className="flex items-center gap-1.5 min-w-0">
        {showSort && (
          <div className="flex items-center rounded-full border border-border/60 bg-card/50 p-0.5 shrink-0">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSortChange(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors",
                  sort === opt.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => onFilterOpen(true)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border shrink-0 transition-colors",
            activeFilterCount > 0
              ? "border-primary/40 bg-primary/10 text-brand-strong"
              : "border-border/60 bg-card/50 text-foreground"
          )}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export function countVenueFilters(tags, pickersValues) {
  let n = 0;
  if (tags) n += Object.values(tags).filter(Boolean).length;
  pickersValues?.forEach((v) => {
    if (v !== "All" && v != null && v !== "") n += 1;
  });
  return n;
}
