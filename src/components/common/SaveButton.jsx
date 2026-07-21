import React from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";

export default function SaveButton({ item, className }) {
  const { isSaved, toggle } = useSaved();
  const key = `${item.type}:${item.title}`;
  const saved = isSaved(key);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(item);
      }}
      className={cn(
        "w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition",
        className
      )}
      aria-label={saved ? "Unsave" : "Save"}
    >
      <Bookmark
        className={cn("w-4 h-4", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")}
        strokeWidth={1.5}
      />
    </button>
  );
}