import React from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERESTS, LANGUAGES } from "@/lib/profile-options";
import { cn } from "@/lib/utils";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs border capitalize transition",
        active ? "bg-[#A1846B] text-white border-[#A1846B]" : "border-border text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function MatchFilterSheet({ open, onOpenChange, filters, onChange, onReset }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleArr = (key, val) => {
    const arr = filters[key];
    set({ [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-2">
          {/* Age range */}
          <div className="space-y-2">
            <Label>Age range</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                placeholder="Min"
                value={filters.ageMin}
                onChange={(e) => set({ ageMin: e.target.value })}
                className="h-10"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                inputMode="numeric"
                min="18"
                placeholder="Max"
                value={filters.ageMax}
                onChange={(e) => set({ ageMax: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="City or country"
              value={filters.location}
              onChange={(e) => set({ location: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Travel destination */}
          <div className="space-y-2">
            <Label>Travel destination</Label>
            <Input
              placeholder="Where she's travelling"
              value={filters.destination}
              onChange={(e) => set({ destination: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Travel dates */}
          <div className="space-y-2">
            <Label>Travel dates</Label>
            <div className="flex items-center gap-3">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                className="h-10"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <Chip key={i} active={filters.interests.includes(i)} onClick={() => toggleArr("interests", i)}>
                  {i}
                </Chip>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label>Languages</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip key={l} active={filters.languages.includes(l)} onClick={() => toggleArr("languages", l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 px-4 pt-2">
          <Button variant="outline" className="flex-1" onClick={onReset}>Reset</Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>Show results</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}