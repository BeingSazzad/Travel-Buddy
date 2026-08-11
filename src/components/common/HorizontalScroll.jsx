import React from "react";
import { cn } from "@/lib/utils";

/**
 * Contained horizontal scroll — outer clip prevents page sideways drift.
 */
export default function HorizontalScroll({ className = "", innerClassName = "", children }) {
  return (
    <div className={cn("min-w-0 max-w-full overflow-hidden", className)}>
      <div className={cn("flex gap-3 h-scroll pl-app pb-1", innerClassName)}>
        {children}
        <div className="shrink-0 w-app" aria-hidden="true" />
      </div>
    </div>
  );
}
