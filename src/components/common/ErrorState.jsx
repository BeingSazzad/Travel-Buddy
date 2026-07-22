import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Consistent error / failed-load state. Defaults to a connection-problem
 * message; pass title/description to tailor (e.g. failed payment).
 */
export default function ErrorState({
  icon: Icon = WifiOff,
  title = "Connection problem",
  description = "We couldn't load this right now. Check your internet and try again.",
  retryLabel = "Try again",
  onRetry,
  className,
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border p-8 text-center", className)}>
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-destructive" strokeWidth={1.5} />
      </div>
      <p className="font-display font-semibold text-base">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium active:scale-95 transition inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}