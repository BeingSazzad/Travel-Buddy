import React from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";
import { savedItemKey } from "@/lib/saved-item-key";

export default function SaveButton({ item, className, variant = "surface" }) {
  const { isSaved, toggle } = useSaved();
  const key = savedItemKey(item);
  const saved = key ? isSaved(key) : false;
  const overlay = variant === "overlay";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(item);
      }}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center tap-feedback",
        overlay
          ? saved
            ? "bg-primary/90 backdrop-blur-md border border-brand-gold/45 shadow-md"
            : "bg-black/50 backdrop-blur-md border border-white/30 shadow-md active:bg-black/65"
          : "bg-card border border-border/80 shadow-soft active:bg-muted/40",
        className
      )}
      aria-label={saved ? "Unsave" : "Save"}
    >
      <span key={saved ? "on" : "off"} className={cn("inline-flex", saved && "save-pop")}>
        <Bookmark
          className={cn(
            "w-4 h-4",
            saved
              ? overlay
                ? "fill-brand-gold text-brand-gold"
                : "fill-primary text-primary"
              : overlay
                ? "text-white"
                : "text-muted-foreground"
          )}
          strokeWidth={1.75}
        />
      </span>
    </button>
  );
}
