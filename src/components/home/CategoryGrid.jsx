import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/lib/home-data";

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-3 px-5">
      {CATEGORIES.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-2xl py-3 shadow-soft active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-[#A1846B]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#A1846B]" strokeWidth={1.75} />
          </div>
          <span className="text-[10px] font-medium text-foreground text-center leading-tight">{label}</span>
        </button>
      ))}
    </div>
  );
}