import React, { useState } from "react";
import { Star, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

export default function ReviewForm({ itemKey, itemType, itemTitle, onPosted }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addPhotos = async (files) => {
    if (!files || !files.length) return;
    const remaining = 4 - photos.length;
    const slice = Array.from(files).slice(0, remaining);
    if (!slice.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of slice) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: f });
        urls.push(file_url);
      }
      setPhotos((p) => [...p, ...urls]);
    } catch (e) {
      setError("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!text.trim()) { setError("Please write your review."); return; }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await base44.functions.invoke("submit-review", {
        item_key: itemKey, item_type: itemType, item_title: itemTitle,
        rating, text: text.trim(), visit_date: visitDate || null, photos,
      });
      onPosted(data.review);
      setText(""); setRating(5); setVisitDate(""); setPhotos([]); setOpen(false);
    } catch (e) {
      setError(e?.response?.data?.error || "Could not post review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-[#A1846B] flex items-center gap-1">
        <Star className="w-3.5 h-3.5" strokeWidth={1.5} /> Write a review
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Share your experience</p>
        <button onClick={() => setOpen(false)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)}>
            <Star className={cn("w-6 h-6", n <= rating ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell others about your visit…" rows={3} className="w-full rounded-xl border border-border bg-background p-2 text-sm resize-none" />

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Visit date</label>
        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full rounded-xl border border-border bg-background p-2 text-sm" />
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 cursor-pointer">
          <ImagePlus className="w-4 h-4" strokeWidth={1.5} /> Add photos ({photos.length}/4)
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} disabled={uploading || photos.length >= 4} />
        </label>
        {photos.length > 0 && (
          <div className="flex gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                <button onClick={() => setPhotos((arr) => arr.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading…</p>}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm rounded-full border border-border">Cancel</button>
        <button onClick={submit} disabled={submitting} className="px-4 py-1.5 text-sm rounded-full bg-foreground text-background disabled:opacity-50">
          {submitting ? "Posting…" : "Post review"}
        </button>
      </div>
    </div>
  );
}