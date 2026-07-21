import React from "react";
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

export default function FilterSheet({ open, onOpenChange, filters, onChange, onReset }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleArr = (key, val) => {
    const arr = filters[key];
    set({ [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-2">
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

          {/* Date */}
          <div className="space-y-2">
            <Label>From date</Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => set({ date: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {SEARCH_TYPES.map((t) => (
                <Chip
                  key={t.value}
                  active={filters.categories.includes(t.value)}
                  onClick={() => toggleArr("categories", t.value)}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Minimum rating</Label>
            <Select value={String(filters.rating)} onValueChange={(v) => set({ rating: Number(v) })}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="4">4.0+</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.8">4.8+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price</Label>
            <div className="flex gap-2">
              {["$", "$$", "$$$"].map((p) => (
                <Chip key={p} active={filters.prices.includes(p)} onClick={() => toggleArr("prices", p)}>
                  {p}
                </Chip>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label>Distance</Label>
            <Select value={String(filters.distance)} onValueChange={(v) => set({ distance: Number(v) })}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any distance</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="25">Within 25 km</SelectItem>
                <SelectItem value="50">Within 50 km</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        <SheetFooter className="flex-row gap-3 px-4 pt-2">
          <Button variant="outline" className="flex-1" onClick={onReset}>Reset</Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>Show results</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}