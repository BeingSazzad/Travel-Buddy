import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const GRANTED_SUBSCRIPTIONS = ['active', 'cancelled_active'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Only verified, terms-accepted, subscribed members can publish reviews
    const isAdmin = user.role === 'admin';
    if (!isAdmin) {
      if (!user.is_email_verified || !user.accepted_terms_at) {
        return Response.json({ error: 'Your account must be verified before reviewing.' }, { status: 403 });
      }
      if (!GRANTED_SUBSCRIPTIONS.includes(user.subscription_status)) {
        return Response.json({ error: 'An active Seluna Plus subscription is required to review.' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { item_key, item_type, item_title, rating, text, visit_date, photos } = body || {};

    if (!item_key || !item_type || !item_title) {
      return Response.json({ error: 'Missing review target.' }, { status: 400 });
    }
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    if (!text || !text.trim()) {
      return Response.json({ error: 'Please write your review.' }, { status: 400 });
    }

    const firstName = (user.full_name || user.email || 'Seluna member').split(' ')[0];
    const review = await base44.entities.Review.create({
      item_key,
      item_type,
      item_title,
      rating: r,
      text: text.trim(),
      visit_date: visit_date || null,
      photos: Array.isArray(photos) ? photos.slice(0, 4) : [],
      author_name: firstName,
      author_avatar: user.avatar || '',
      helpful_count: 0,
    });

    return Response.json({ review });
  } catch (error) {
    console.error('submit-review error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});