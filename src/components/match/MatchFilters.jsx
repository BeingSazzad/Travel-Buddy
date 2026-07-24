import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";
import { INTERESTS, LANGUAGES } from "@/lib/profile-options";

function ChipToggle({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border capitalize transition active:scale-95 ${
        active ? "bg-[#A1846B] text-white border-[#A1846B]" : "bg-card text-muted-foreground border-border"
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">{label}</p>
      {children}
    </div>
  );
}

export default function MatchFilters({ open, onOpenChange, filters, onChange, onReset }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  const toggle = (key, value) => {
    const arr = filters[key] || [];
    set({ [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-6 max-h-[88vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Filters</SheetTitle>
        </SheetHeader>

        <div className="px-4 mt-3 space-y-5">
          <Field label="Age range">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{filters.ageMin}</span>
              <span className="text-muted-foreground">{filters.ageMax === 99 ? "99+" : filters.ageMax}</span>
            </div>
            <Slider
              value={[filters.ageMin, filters.ageMax]}
              min={18}
              max={99}
              step={1}
              onValueChange={([min, max]) => set({ ageMin: min, ageMax: max })}
            />
          </Field>

          <Field label="Location (city or country)">
            <input
              value={filters.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="e.g. Lisbon or Portugal"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </Field>

          <Field label="Travel destination">
            <input
              value={filters.destination}
              onChange={(e) => set({ destination: e.target.value })}
              placeholder="e.g. Bali or Indonesia"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </Field>

          <Field label="Travel dates">
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </div>
          </Field>

          <Field label="Interests">
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <ChipToggle key={i} label={i} active={filters.interests.includes(i)} onClick={() => toggle("interests", i)} />
              ))}
            </div>
          </Field>

          <Field label="Languages">
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <ChipToggle key={l} label={l} active={filters.languages.includes(l)} onClick={() => toggle("languages", l)} />
              ))}
            </div>
          </Field>
        </div>

        <div className="px-4 mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.5} /> Reset
          </Button>
          <Button className="flex-1 bg-foreground text-background" onClick={() => onOpenChange(false)}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}