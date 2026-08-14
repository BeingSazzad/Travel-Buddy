import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERESTS, LANGUAGES } from "@/lib/profile-options";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-xl text-xs border font-medium capitalize transition-all active:scale-95 flex items-center justify-center",
        active
          ? "chip-on shadow-sm"
          : "bg-card border-border/80 text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
}

/** Count filter dimensions (age/dates = 1 each; interests/languages = selected count). */
export function countMatchFilters(f = {}) {
  let n = 0;
  if (f.ageMin || f.ageMax) n += 1;
  if (f.location) n += 1;
  if (f.destination) n += 1;
  if (f.dateFrom || f.dateTo) n += 1;
  n += f.interests?.length || 0;
  n += f.languages?.length || 0;
  return n;
}

export default function MatchFilterSheet({ open, onOpenChange, filters, onChange, onReset }) {
  const [draft, setDraft] = useState(filters);
  const [showMoreInterests, setShowMoreInterests] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  // Draft only while open — Apply commits; avoids yanking the swipe deck mid-edit
  useEffect(() => {
    if (open) {
      setDraft(filters);
      setShowMoreInterests(false);
      setShowMoreLanguages(false);
    }
  }, [open, filters]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const toggleArr = (key, val) => {
    const arr = draft[key] || [];
    set({ [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  const activeCount = useMemo(() => countMatchFilters(draft), [draft]);
  const visibleInterests = showMoreInterests ? INTERESTS : INTERESTS.slice(0, 8);
  const visibleLanguages = showMoreLanguages ? LANGUAGES : LANGUAGES.slice(0, 8);

  const apply = () => {
    onChange(draft);
    onOpenChange(false);
  };

  const resetDraft = () => {
    onReset?.();
    // Parent reset may be async via setState — clear draft immediately for UI
    setDraft({
      ageMin: "",
      ageMax: "",
      location: "",
      destination: "",
      dateFrom: "",
      dateTo: "",
      interests: [],
      languages: [],
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] max-h-[85vh] flex flex-col px-0 gap-0">
        <SheetHeader className="px-6 pb-3 border-b border-border/60 shrink-0">
          <SheetTitle className="font-display text-lg font-bold text-left">Filter Members</SheetTitle>
          <p className="text-xs text-muted-foreground text-left mt-0.5">
            {activeCount > 0
              ? `${activeCount} filter${activeCount === 1 ? "" : "s"} selected`
              : "Narrow down travel matches"}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-6 py-4 pb-28">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span>Location & destination</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Living in</Label>
                <Input
                  placeholder="City or country"
                  value={draft.location}
                  onChange={(e) => set({ location: e.target.value })}
                  className="h-11 rounded-xl bg-card"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Travelling to</Label>
                <Input
                  placeholder="Target destination"
                  value={draft.destination}
                  onChange={(e) => set({ destination: e.target.value })}
                  className="h-11 rounded-xl bg-card"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age range</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                placeholder="Min"
                value={draft.ageMin}
                onChange={(e) => set({ ageMin: e.target.value })}
                className="h-11 rounded-xl bg-card"
                aria-label="Minimum age"
              />
              <span className="text-muted-foreground font-medium">–</span>
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                placeholder="Max"
                value={draft.ageMax}
                onChange={(e) => set({ ageMax: e.target.value })}
                className="h-11 rounded-xl bg-card"
                aria-label="Maximum age"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span>Travel dates</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">From</Label>
                <Input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => set({ dateFrom: e.target.value })}
                  className="h-11 rounded-xl bg-card text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">To</Label>
                <Input
                  type="date"
                  value={draft.dateTo}
                  min={draft.dateFrom || undefined}
                  onChange={(e) => set({ dateTo: e.target.value })}
                  className="h-11 rounded-xl bg-card text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span>Interests</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleInterests.map((i) => (
                <Chip key={i} active={draft.interests?.includes(i)} onClick={() => toggleArr("interests", i)}>
                  {i}
                </Chip>
              ))}
            </div>
            {INTERESTS.length > 8 && (
              <button
                type="button"
                onClick={() => setShowMoreInterests((v) => !v)}
                className="text-xs font-semibold text-primary flex items-center gap-1 mt-1"
              >
                {showMoreInterests ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show {INTERESTS.length - 8} more <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Languages</Label>
            <div className="flex flex-wrap gap-2">
              {visibleLanguages.map((l) => (
                <Chip key={l} active={draft.languages?.includes(l)} onClick={() => toggleArr("languages", l)}>
                  {l}
                </Chip>
              ))}
            </div>
            {LANGUAGES.length > 8 && (
              <button
                type="button"
                onClick={() => setShowMoreLanguages((v) => !v)}
                className="text-xs font-semibold text-primary flex items-center gap-1 mt-1"
              >
                {showMoreLanguages ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show {LANGUAGES.length - 8} more <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 inset-x-0 bg-background/95 backdrop-blur-md border-t border-border/60 p-4 flex-row gap-3 safe-pb">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-semibold"
            onClick={resetDraft}
            disabled={activeCount === 0}
          >
            Reset
          </Button>
          <Button className="flex-1 h-12 rounded-2xl font-bold shadow-md" onClick={apply}>
            {activeCount > 0 ? `Show matches` : "Done"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
