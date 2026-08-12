import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReviewItem from "@/components/reviews/ReviewItem";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";
import { demoReviewsForVenue } from "@/lib/review-place";

export default function ReviewSection({ itemKey, itemType, itemTitle }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [voted, setVoted] = useState({});
  const [votingId, setVotingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [list, me] = await Promise.all([
        base44.entities.Review.filter({ item_key: itemKey }, "-created_date"),
        base44.auth.me().catch(() => null),
      ]);
      setReviews(list?.length ? list : useDemoFallbacks ? demoReviewsForVenue({ itemKey, itemType, itemTitle }) : []);
      setUser(me);
      if (me && list?.length) {
        const votes = {};
        await Promise.all(list.map(async (rv) => {
          try {
            const mine = await base44.entities.ReviewVote.filter({ review_id: rv.id, created_by_id: me.id });
            if (mine && mine.length) votes[rv.id] = true;
          } catch (e) {}
        }));
        setVoted(votes);
      }
    } catch {
      setReviews(useDemoFallbacks ? demoReviewsForVenue({ itemKey, itemType, itemTitle }) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [itemKey]);

  const onVote = async (review) => {
    setVotingId(review.id);
    try {
      const { data } = await base44.functions.invoke("vote-review", { review_id: review.id });
      setVoted((v) => ({ ...v, [review.id]: data.voted }));
      setReviews((rs) => rs.map((r) => r.id === review.id ? { ...r, helpful_count: data.helpful_count } : r));
    } catch (e) {
      alert("Could not register your vote.");
    } finally {
      setVotingId(null);
    }
  };

  const onReport = async (review, reason, note) => {
    await base44.entities.ReviewReport.create({ review_id: review.id, reason, note: note || undefined });
  };

  const onRemove = async (review) => {
    try {
      await base44.entities.Review.delete(review.id);
      setReviews((rs) => rs.filter((r) => r.id !== review.id));
    } catch (e) {
      alert("Could not remove review.");
    }
  };

  const onPosted = (review) => {
    setReviews((rs) => [review, ...rs]);
  };

  const isAdmin = user?.role === "admin";

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-semibold text-base">Member reviews ({reviews.length})</h2>
        <ReviewForm itemKey={itemKey} itemType={itemType} itemTitle={itemTitle} onPosted={onPosted} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to review {itemTitle}.</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((rv) => (
            <ReviewItem
              key={rv.id}
              review={rv}
              isAdmin={isAdmin}
              voted={!!voted[rv.id]}
              voting={votingId === rv.id}
              onVote={onVote}
              onReport={onReport}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}