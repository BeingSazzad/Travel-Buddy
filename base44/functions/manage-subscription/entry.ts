import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.25.0';
import { buildSubscriptionUpdate, mapSubscriptionStatus } from '../../shared/stripe-subscription.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'portal';
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return Response.json({ error: 'No subscription found for your account' }, { status: 404 });
    }

    if (action === 'restore') {
      const subs = await stripe.subscriptions.list({ customer: customer.id, limit: 1 });
      const sub = subs.data[0];
      if (!sub) {
        return Response.json({ status: 'none' });
      }
      const update = buildSubscriptionUpdate(sub);
      await base44.asServiceRole.entities.User.update(user.id, update);
      return Response.json({
        status: update.subscription_status,
        plan: update.subscription_plan,
        current_period_end: update.subscription_current_period_end,
      });
    }

    const origin = req.headers.get('origin') || 'https://app.base44.com';
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/subscription-management`,
    });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('manage-subscription error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});