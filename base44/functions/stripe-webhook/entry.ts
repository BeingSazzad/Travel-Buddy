import Stripe from 'npm:stripe@14.25.0';
import { buildSubscriptionUpdate } from '../../shared/stripe-subscription.ts';
import { createBase44ClientFromRequest } from '../../shared/base44-request-client.ts';

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

    const metadataAppId =
      event?.data?.object?.metadata?.base44_app_id ||
      event?.data?.object?.subscription_data?.metadata?.base44_app_id;
    const base44 = createBase44ClientFromRequest(req, metadataAppId);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session?.metadata?.user_id;
      const plan = session?.metadata?.plan;
      if (userId) {
        let update = {
          subscription_status: 'active',
          subscription_plan: plan || null,
        };
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(String(session.subscription));
          update = buildSubscriptionUpdate(sub);
          if (!update.subscription_plan && plan) {
            update.subscription_plan = plan;
          }
        }
        await base44.asServiceRole.entities.User.update(userId, update);
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