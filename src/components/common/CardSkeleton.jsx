import React from "react";

export default function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      <div className="skeleton-shimmer h-40 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
          <div className="skeleton-shimmer h-4 w-10 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}