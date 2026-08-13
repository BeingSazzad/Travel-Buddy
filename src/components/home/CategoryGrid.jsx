import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/lib/home-data";
import HorizontalScroll from "@/components/common/HorizontalScroll";

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <HorizontalScroll className="py-0">
      {CATEGORIES.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-1.5 min-w-[68px] shrink-0 px-1 tap-feedback active:scale-95 transition-transform"
        >
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          <span className="text-[11px] font-medium text-muted-foreground text-center whitespace-nowrap leading-tight">
            {label}
          </span>
        </button>
      ))}
    </HorizontalScroll>
  );
}
