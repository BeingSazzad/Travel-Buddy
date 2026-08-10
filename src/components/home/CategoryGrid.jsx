import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/lib/home-data";

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
      {CATEGORIES.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="flex flex-col items-center justify-center gap-2 bg-card border border-border/80 rounded-2xl p-3.5 min-w-[92px] shrink-0 shadow-soft active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-[#A1846B]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#A1846B]" strokeWidth={1.75} />
          </div>
          <span className="text-xs font-semibold text-foreground text-center whitespace-nowrap leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}