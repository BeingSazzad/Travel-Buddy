import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PickerSheet({ open, onOpenChange, title, options, value, onChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <SheetHeader className="px-5 pt-5 pb-2">
          <SheetTitle className="font-display text-base">{title}</SheetTitle>
        </SheetHeader>
        <div className="px-3 pb-2 max-h-[55vh] overflow-y-auto">
          {options.map((o) => {
            const active = String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  onOpenChange(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm text-left transition-colors",
                  active ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                )}
              >
                {o.label}
                {active && <Check className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}