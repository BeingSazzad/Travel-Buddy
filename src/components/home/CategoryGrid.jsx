import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/lib/home-data";
import HorizontalScroll from "@/components/common/HorizontalScroll";

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <HorizontalScroll className="py-0.5">
      {CATEGORIES.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className="interactive-chip flex flex-col items-center justify-center gap-2 bg-muted/25 border border-border/25 rounded-2xl p-3 min-w-[84px] shrink-0"
        >
          <div className="chip-icon-wrap w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-200">
            <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold text-foreground/90 text-center whitespace-nowrap leading-tight">
            {label}
          </span>
        </button>
      ))}
    </HorizontalScroll>
  );
}
