import React from "react";
import { Search, Loader2 } from "lucide-react";

export function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="font-display font-bold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-9 pr-3 rounded-full border border-border bg-card text-sm outline-none"
      />
    </div>
  );
}

export function ListState({ loading, empty, emptyText = "Nothing here yet.", children }) {
  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>;
  if (empty) return <p className="text-sm text-muted-foreground text-center mt-16">{emptyText}</p>;
  return children;
}