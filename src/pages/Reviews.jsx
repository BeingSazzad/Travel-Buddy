import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useRecentReviews } from '@/hooks/useRecentReviews';
import { pathForReview } from '@/lib/review-place';

export default function Reviews() {
  const navigate = useNavigate();
  const { reviews, loading } = useRecentReviews(40);

  return (
    <div className="page-shell pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-display font-bold text-lg mb-1">Member reviews</h1>
      <p className="text-sm text-muted-foreground mb-5">
        Recent places women in the community reviewed
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-6 text-center">
          No reviews yet. Visit a café, hotel or restaurant and share your experience.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const path = pathForReview(r);
            return (
              <button
                key={r.id}
                type="button"
                disabled={!path}
                onClick={() => path && navigate(path)}
                className="w-full rounded-2xl border border-border bg-card p-4 text-left tap-feedback disabled:opacity-60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{r.item_title}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {r.item_type} · {r.author_name}
                    </p>
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-primary shrink-0">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" strokeWidth={0} />
                    {r.rating}
                  </span>
                </div>
                {r.text && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {r.text}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
