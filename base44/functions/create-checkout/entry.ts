import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.25.0';

const PRICES = {
  monthly: 'price_1TvkNCGS9VdrqfmAQ3ErF9G4',
  yearly: 'price_1TvkNCGS9VdrqfmA9MbW1Vnh',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const plan = body?.plan;
    const priceId = PRICES[plan];
    if (!priceId) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    const origin = req.headers.get('origin') || 'https://app.base44.com';
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const metadata = {
      base44_app_id: Deno.env.get('BASE44_APP_ID'),
      user_id: user.id,
      plan,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscription?status=success`,
      cancel_url: `${origin}/subscription?status=cancelled`,
      customer_email: user.email,
      metadata,
      subscription_data: { metadata },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('create-checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});