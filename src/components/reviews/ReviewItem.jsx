import React, { useState } from "react";
import { Star, ThumbsUp, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

export default function ReviewItem({ review, isAdmin, voted, voting, onVote, onReport, onRemove }) {
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("spam");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async () => {
    setSubmitting(true);
    try {
      await onReport(review, reason, note);
      setReporting(false);
      setNote("");
      alert("Report submitted. Our team will review it.");
    } catch (e) {
      alert("Could not submit report.");
    } finally {
      setSubmitting(false);
    }
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
        <span className="text-[11px] text-muted-foreground">{fmtDate(review.created_date)}</span>
      </div>

      {review.visit_date && (
        <p className="text-[11px] text-muted-foreground mt-2">Visited {fmtDate(review.visit_date)}</p>
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

        {!reporting && !isAdmin && (
          <button onClick={() => setReporting(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground">
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

      {reporting && (
        <div className="mt-3 rounded-xl border border-border bg-background p-3 space-y-2">
          <p className="text-xs font-medium">Report this review</p>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-border text-sm bg-background">
            <option value="spam">Spam</option>
            <option value="abusive">Abusive content</option>
            <option value="false_info">False information</option>
            <option value="inappropriate_image">Inappropriate image</option>
            <option value="conflict_of_interest">Conflict of interest</option>
          </select>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add context (optional)" rows={2} className="w-full rounded-lg border border-border bg-background p-2 text-sm resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setReporting(false)} className="px-3 py-1.5 text-xs rounded-full border border-border">Cancel</button>
            <button onClick={submitReport} disabled={submitting} className="px-4 py-1.5 text-xs rounded-full bg-foreground text-background disabled:opacity-50">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}