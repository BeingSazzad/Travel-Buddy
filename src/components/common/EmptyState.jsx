import React from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent empty-state card used across Seluna list screens.
 * icon: a lucide-react icon component
 */
export default function EmptyState({
  icon: Icon = null,
  title = "",
  description = "",
  actionLabel = "",
  onAction = null,
  className = "",
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border p-8 text-center", className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-display font-semibold text-base">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition gradient-brand-button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}