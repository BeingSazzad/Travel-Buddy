import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.25.0';

const PRICES = {
  monthly: Deno.env.get('STRIPE_PRICE_MONTHLY') || 'price_1TgemQ4JlVNL2GjK45auv8yd',
  yearly: Deno.env.get('STRIPE_PRICE_YEARLY') || 'price_1TgemQ4JlVNL2GjK45auv8yd',
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
      base44_app_id:
        Deno.env.get('BASE44_APP_ID') ||
        Deno.env.get('VITE_BASE44_APP_ID'),
      user_id: user.id,
      plan,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`,
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