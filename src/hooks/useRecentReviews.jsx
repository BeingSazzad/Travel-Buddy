import { useEffect, useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useDemoFallbacks } from '@/lib/demo-fallbacks';
import { reviewToPlaceCard, FALLBACK_RECENT_PLACES, FALLBACK_REVIEWS } from '@/lib/review-place';

export function useRecentReviews(limit = 8) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await base44.entities.Review.list('-created_date', limit);
        if (!cancelled) {
          if (list?.length) setReviews(list);
          else if (useDemoFallbacks) setReviews(FALLBACK_REVIEWS);
        }
      } catch {
        if (!cancelled) setReviews(useDemoFallbacks ? FALLBACK_REVIEWS : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const placeCards = useMemo(() => {
    if (reviews.length) return reviews.map(reviewToPlaceCard);
    if (useDemoFallbacks) return FALLBACK_RECENT_PLACES;
    return [];
  }, [reviews]);

  const displayReviews = useMemo(() => {
    if (reviews.length) return reviews;
    if (useDemoFallbacks) return FALLBACK_REVIEWS;
    return [];
  }, [reviews]);

  return { reviews: displayReviews, placeCards, loading };
}
