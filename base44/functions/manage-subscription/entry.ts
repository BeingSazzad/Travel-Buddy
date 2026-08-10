import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.25.0';
import { buildSubscriptionUpdate } from '../../shared/stripe-subscription.ts';

async function applySubscriptionUpdate(base44, userId, update) {
  const me = await base44.auth.me();
  if (me?.id === userId) {
    return base44.auth.updateMe(update);
  }
  return base44.asServiceRole.entities.User.update(userId, update);
}

async function resolvePaidCheckoutSession(stripe, user, sessionId) {
  if (sessionId) {
    return stripe.checkout.sessions.retrieve(String(sessionId));
  }

  const sessions = await stripe.checkout.sessions.list({ limit: 25 });
  return sessions.data.find((session) => {
    const matchesUser =
      session.metadata?.user_id === user.id ||
      (session.customer_email && session.customer_email === user.email);
    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    return matchesUser && isPaid;
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'portal';
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    if (action === 'sync') {
      const session = await resolvePaidCheckoutSession(stripe, user, body?.session_id);
      if (!session) {
        return Response.json({ error: 'No completed checkout session found for this account' }, { status: 404 });
      }
      if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
        return Response.json({ error: 'Checkout session does not belong to this user' }, { status: 403 });
      }
      if (session.payment_status !== 'paid' && session.status !== 'complete') {
        return Response.json({ status: 'pending' });
      }

      let update = {
        subscription_status: 'active',
        subscription_plan: session.metadata?.plan || null,
      };
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        update = buildSubscriptionUpdate(sub);
        if (!update.subscription_plan && session.metadata?.plan) {
          update.subscription_plan = session.metadata.plan;
        }
      }

      const updatedUser = await applySubscriptionUpdate(base44, user.id, update);
      return Response.json({
        status: update.subscription_status,
        plan: update.subscription_plan,
        current_period_end: update.subscription_current_period_end,
        user: updatedUser,
      });
    }

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
      const updatedUser = await applySubscriptionUpdate(base44, user.id, update);
      return Response.json({
        status: update.subscription_status,
        plan: update.subscription_plan,
        current_period_end: update.subscription_current_period_end,
        user: updatedUser,
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