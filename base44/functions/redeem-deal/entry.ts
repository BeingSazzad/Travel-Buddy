import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const GRANTED_SUBSCRIPTIONS = ['active', 'cancelled_active'];
const slug = (s) => (s || 'seluna').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 10);
const rand = () => Math.random().toString(36).slice(2, 8).toUpperCase();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin = user.role === 'admin';
    if (!isAdmin) {
      if (!user.is_email_verified || !user.accepted_terms_at) {
        return Response.json({ error: 'Your account must be verified to redeem deals.' }, { status: 403 });
      }
      if (!GRANTED_SUBSCRIPTIONS.includes(user.subscription_status)) {
        return Response.json({ error: 'An active Seluna Plus subscription is required to redeem deals.' }, { status: 403 });
      }
    }

    const { deal_id } = await req.json();
    if (!deal_id) return Response.json({ error: 'Missing deal.' }, { status: 400 });

    const deal = await base44.asServiceRole.entities.Deal.get(deal_id);
    if (!deal) return Response.json({ error: 'Deal not found.' }, { status: 404 });

    if (deal.expiration_date) {
      const exp = new Date(deal.expiration_date);
      exp.setHours(23, 59, 59, 999);
      if (exp < new Date()) return Response.json({ error: 'This deal has expired.' }, { status: 410 });
    }

    const code = `${slug(deal.code_prefix || deal.partner)}-${rand()}`;
    const redemption = await base44.asServiceRole.entities.DealRedemption.create({
      deal_id: deal.id,
      deal_title: deal.title,
      code,
    });

    return Response.json({
      code,
      deal_title: deal.title,
      partner: deal.partner,
      terms: deal.terms || '',
    });
  } catch (error) {
    console.error('redeem-deal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});