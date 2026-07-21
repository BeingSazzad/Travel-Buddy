import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.25.0';
import { buildSubscriptionUpdate } from '../../shared/stripe-subscription.ts';

async function syncSubscription(base44, subscription) {
  const userId = subscription?.metadata?.user_id;
  if (!userId) {
    console.error('stripe-webhook: no user_id in subscription metadata');
    return;
  }
  const update = buildSubscriptionUpdate(subscription);
  await base44.asServiceRole.entities.User.update(userId, update);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session?.metadata?.user_id;
      const plan = session?.metadata?.plan;
      if (userId) {
        await base44.asServiceRole.entities.User.update(userId, {
          subscription_status: 'active',
          subscription_plan: plan,
        });
      } else {
        console.error('stripe-webhook: no user_id in session metadata');
      }
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await syncSubscription(base44, event.data.object);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe-webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});