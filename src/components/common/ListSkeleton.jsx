import React from "react";
import CardSkeleton from "@/components/common/CardSkeleton";

export default function ListSkeleton({ count = 4, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}