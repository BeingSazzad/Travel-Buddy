import React from "react";
import { cn } from "@/lib/utils";

export default function InterestPicker({ options, selected, onToggle }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onToggle(selected.filter((o) => o !== opt));
    } else {
      onToggle([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "px-3.5 py-2 rounded-full text-sm border transition capitalize text-center",
              active
                ? "chip-on"
                : "border-border text-foreground bg-transparent"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}