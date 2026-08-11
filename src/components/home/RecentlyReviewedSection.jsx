import React from 'react';
import ReviewPlaceList from '@/components/home/ReviewPlaceList';
import { useRecentReviews } from '@/hooks/useRecentReviews';

export default function RecentlyReviewedSection({ onItemClick }) {
  const { placeCards, loading } = useRecentReviews(6);

  if (loading) {
    return (
      <p className="app-px text-sm text-muted-foreground py-2">Loading recent reviews…</p>
    );
  }

  if (!placeCards.length) return null;

  return (
    <ReviewPlaceList
      items={placeCards}
      onItemClick={onItemClick}
      className="app-px"
    />
  );
}
