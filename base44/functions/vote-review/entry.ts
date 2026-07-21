import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { review_id } = await req.json();
    if (!review_id) return Response.json({ error: 'Missing review id.' }, { status: 400 });

    const existing = await base44.entities.ReviewVote.filter({ review_id, created_by_id: user.id });
    if (existing && existing.length > 0) {
      await base44.entities.ReviewVote.delete(existing[0].id);
      const review = await base44.asServiceRole.entities.Review.get(review_id);
      const count = Math.max(0, (review.helpful_count || 1) - 1);
      await base44.asServiceRole.entities.Review.update(review_id, { helpful_count: count });
      return Response.json({ voted: false, helpful_count: count });
    }

    await base44.entities.ReviewVote.create({ review_id, user_id: user.id });
    const review = await base44.asServiceRole.entities.Review.get(review_id);
    const count = (review.helpful_count || 0) + 1;
    await base44.asServiceRole.entities.Review.update(review_id, { helpful_count: count });
    return Response.json({ voted: true, helpful_count: count });
  } catch (error) {
    console.error('vote-review error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});