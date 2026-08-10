import React, { useState } from "react";
import { Star, ThumbsUp, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReportSheet from "@/components/reports/ReportSheet";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

export default function ReviewItem({ review, isAdmin, voted, voting, onVote, onReport, onRemove }) {
  const [reportOpen, setReportOpen] = useState(false);

  const target = {
    type: "review",
    id: review.id,
    title: `Review by ${review.author_name}`,
    ownerId: review.created_by_id || "",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        {review.author_avatar ? (
          <img src={review.author_avatar} alt={review.author_name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">{(review.author_name || "?")[0]}</div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{review.author_name}</p>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
            ))}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{fmtDate(review.created_date)}</span>
      </div>

      {review.visit_date && (
        <p className="text-xs text-muted-foreground mt-2">Visited {fmtDate(review.visit_date)}</p>
      )}

      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.text}</p>

      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
          {review.photos.map((p, i) => (
            <img key={i} src={p} alt="" className="w-20 h-20 rounded-xl object-cover border border-border" />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onVote(review)}
          disabled={voting}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition",
            voted ? "bg-[#A1846B]/10 border-[#A1846B] text-[#7a5c44]" : "border-border text-muted-foreground"
          )}
        >
          <ThumbsUp className={cn("w-3.5 h-3.5", voted && "fill-[#A1846B] text-[#A1846B]")} strokeWidth={1.5} />
          Helpful {review.helpful_count > 0 && <span className="font-medium">{review.helpful_count}</span>}
        </button>

        {!isAdmin && (
          <button onClick={() => setReportOpen(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => { if (confirm("Remove this review?")) onRemove(review); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-destructive/30 text-destructive ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Remove
          </button>
        )}
      </div>

      <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={target} />
    </div>
  );
}