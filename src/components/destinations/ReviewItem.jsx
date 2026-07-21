import React from "react";
import { Star } from "lucide-react";

export default function ReviewItem({ review }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{review.name}</p>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-[#A1846B] text-[#A1846B]" : "text-border"}`} strokeWidth={0} />
            ))}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.text}</p>
    </div>
  );
}