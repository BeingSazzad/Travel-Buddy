import React, { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { SEARCH_TYPES } from "@/lib/search-data";
import { INTERESTS } from "@/lib/profile-options";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Star, DollarSign, Sparkles, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-xl text-xs border font-medium capitalize transition-all active:scale-95 flex items-center justify-center",
        active
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-card border-border/80 text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
}

export default function FilterSheet({ open, onOpenChange, filters, onChange, onReset }) {
  const [showMoreInterests, setShowMoreInterests] = useState(false);

  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleArr = (key, val) => {
    const arr = filters[key] || [];
    set({ [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  const activeCount =
    (filters.location ? 1 : 0) +
    (filters.date ? 1 : 0) +
    (filters.categories?.length || 0) +
    (filters.rating ? 1 : 0) +
    (filters.prices?.length || 0) +
    (filters.distance ? 1 : 0) +
    (filters.interests?.length || 0);

  const visibleInterests = showMoreInterests ? INTERESTS : INTERESTS.slice(0, 8);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] max-h-[85vh] overflow-y-auto px-0">
        {/* Header */}
        <SheetHeader className="px-6 pb-2 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="font-display text-lg font-bold text-left">Search Filters</SheetTitle>
            <p className="text-xs text-muted-foreground text-left mt-0.5">
              {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active` : "Refine places, events & members"}
            </p>
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline mr-6"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </SheetHeader>

        <div className="space-y-6 px-6 py-4">
          {/* Section: Category */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
            <div className="flex flex-wrap gap-2">
              {SEARCH_TYPES.map((t) => (
                <Chip
                  key={t.value}
                  active={filters.categories?.includes(t.value)}
                  onClick={() => toggleArr("categories", t.value)}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Section: Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span>Location</span>
              </div>
              <Input
                placeholder="City or country"
                value={filters.location}
                onChange={(e) => set({ location: e.target.value })}
                className="h-11 rounded-xl bg-card"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span>Date</span>
              </div>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => set({ date: e.target.value })}
                className="h-11 rounded-xl bg-card text-xs"
              />
            </div>
          </div>

          {/* Section: Rating & Distance */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span>Min Rating</span>
              </div>
              <Select value={String(filters.rating || 0)} onValueChange={(v) => set({ rating: Number(v) })}>
                <SelectTrigger className="h-11 rounded-xl bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="4">★ 4.0+</SelectItem>
                  <SelectItem value="4.5">★ 4.5+</SelectItem>
                  <SelectItem value="4.8">★ 4.8+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span>Distance</span>
              </div>
              <Select value={String(filters.distance || 0)} onValueChange={(v) => set({ distance: Number(v) })}>
                <SelectTrigger className="h-11 rounded-xl bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any distance</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                  <SelectItem value="10">Within 10 km</SelectItem>
                  <SelectItem value="25">Within 25 km</SelectItem>
                  <SelectItem value="50">Within 50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section: Price */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span>Price Range</span>
            </div>
            <div className="flex gap-2">
              {["$", "$$", "$$$"].map((p) => (
                <Chip key={p} active={filters.prices?.includes(p)} onClick={() => toggleArr("prices", p)}>
                  {p}
                </Chip>
              ))}
            </div>
          </div>

          {/* Section: Interests (Progressive Disclosure) */}
          <div className="space-y-3 pt-2 border-t border-border/60 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span>Interests</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleInterests.map((i) => (
                <Chip key={i} active={filters.interests?.includes(i)} onClick={() => toggleArr("interests", i)}>
                  {i}
                </Chip>
              ))}
            </div>
            {INTERESTS.length > 8 && (
              <button
                type="button"
                onClick={() => setShowMoreInterests(!showMoreInterests)}
                className="text-xs font-semibold text-primary flex items-center gap-1 mt-1 hover:underline"
              >
                {showMoreInterests ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show {INTERESTS.length - 8} more interests <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/60 p-4 flex-row gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-2xl font-semibold" onClick={onReset}>
            Reset All
          </Button>
          <Button className="flex-1 h-12 rounded-2xl font-bold" onClick={() => onOpenChange(false)}>
            {activeCount > 0 ? `Apply Filters (${activeCount})` : "Show Results"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}