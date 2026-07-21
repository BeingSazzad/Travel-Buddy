export function mapSubscriptionStatus(subscription) {
  const status = subscription?.status;
  const cancelAtEnd = subscription?.cancel_at_period_end === true;
  const periodEndMs = (subscription?.current_period_end || 0) * 1000;
  const nowMs = Date.now();

  if (status === 'active' || status === 'trialing') {
    if (cancelAtEnd && periodEndMs > nowMs) return 'cancelled_active';
    return 'active';
  }
  if (status === 'past_due' || status === 'unpaid') return 'payment_failed';
  if (status === 'canceled' || status === 'expired' || status === 'incomplete_expired') return 'expired';
  return 'none';
}

export function buildSubscriptionUpdate(subscription) {
  const update = {
    subscription_status: mapSubscriptionStatus(subscription),
    subscription_plan: subscription?.metadata?.plan || null,
  };
  if (subscription?.current_period_end) {
    update.subscription_current_period_end = new Date(subscription.current_period_end * 1000).toISOString();
  }
  return update;
}