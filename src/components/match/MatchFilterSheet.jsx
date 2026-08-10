import React, { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERESTS, LANGUAGES } from "@/lib/profile-options";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Sparkles, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-xl text-xs border font-medium capitalize transition-all active:scale-95 flex items-center justify-center",
        active
          ? "bg-[#A1846B] text-white border-[#A1846B] shadow-sm"
          : "bg-card border-border/80 text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
}

export default function MatchFilterSheet({ open, onOpenChange, filters, onChange, onReset }) {
  const [showMoreInterests, setShowMoreInterests] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleArr = (key, val) => {
    const arr = filters[key] || [];
    set({ [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  // Calculate active filter count
  const activeCount =
    (filters.ageMin ? 1 : 0) +
    (filters.ageMax ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.destination ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.interests?.length || 0) +
    (filters.languages?.length || 0);

  const visibleInterests = showMoreInterests ? INTERESTS : INTERESTS.slice(0, 8);
  const visibleLanguages = showMoreLanguages ? LANGUAGES : LANGUAGES.slice(0, 6);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] max-h-[85vh] overflow-y-auto px-0">
        {/* Header */}
        <SheetHeader className="px-6 pb-2 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="font-display text-lg font-bold text-left">Filter Members</SheetTitle>
            <p className="text-xs text-muted-foreground text-left mt-0.5">
              {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied` : "Narrow down travel matches"}
            </p>
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs font-semibold text-[#A1846B] flex items-center gap-1 hover:underline mr-6"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </SheetHeader>

        <div className="space-y-6 px-6 py-4">
          {/* Section: Location & Trip */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={2} />
              <span>Location & Destination</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Living in</Label>
                <Input
                  placeholder="City or country"
                  value={filters.location}
                  onChange={(e) => set({ location: e.target.value })}
                  className="h-11 rounded-xl bg-card"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Travelling to</Label>
                <Input
                  placeholder="Target destination"
                  value={filters.destination}
                  onChange={(e) => set({ destination: e.target.value })}
                  className="h-11 rounded-xl bg-card"
                />
              </div>
            </div>
          </div>

          {/* Section: Age Range */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age Range</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                placeholder="Min age (18)"
                value={filters.ageMin}
                onChange={(e) => set({ ageMin: e.target.value })}
                className="h-11 rounded-xl bg-card"
              />
              <span className="text-muted-foreground font-medium">–</span>
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                placeholder="Max age (60+)"
                value={filters.ageMax}
                onChange={(e) => set({ ageMax: e.target.value })}
                className="h-11 rounded-xl bg-card"
              />
            </div>
          </div>

          {/* Section: Dates */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={2} />
              <span>Travel Dates</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                className="h-11 rounded-xl bg-card text-xs"
              />
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                className="h-11 rounded-xl bg-card text-xs"
              />
            </div>
          </div>

          {/* Section: Interests (Progressive Disclosure) */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={2} />
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
                className="text-xs font-semibold text-[#A1846B] flex items-center gap-1 mt-1 hover:underline"
              >
                {showMoreInterests ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show {INTERESTS.length - 8} more interests <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>

          {/* Section: Languages */}
          <div className="space-y-3 pt-2 border-t border-border/60 pb-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Languages</Label>
            <div className="flex flex-wrap gap-2">
              {visibleLanguages.map((l) => (
                <Chip key={l} active={filters.languages?.includes(l)} onClick={() => toggleArr("languages", l)}>
                  {l}
                </Chip>
              ))}
            </div>
            {LANGUAGES.length > 6 && (
              <button
                type="button"
                onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                className="text-xs font-semibold text-[#A1846B] flex items-center gap-1 mt-1 hover:underline"
              >
                {showMoreLanguages ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show {LANGUAGES.length - 6} more languages <ChevronDown className="w-3.5 h-3.5" /></>
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
          <Button className="flex-1 h-12 rounded-2xl bg-[#A1846B] hover:bg-[#8a6a52] text-white font-bold shadow-md" onClick={() => onOpenChange(false)}>
            {activeCount > 0 ? `Apply Filters (${activeCount})` : "Show Results"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}