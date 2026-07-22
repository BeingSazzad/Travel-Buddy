import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const svc = base44.asServiceRole;
    const now = new Date();
    const since = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
    const today = now.toISOString().slice(0, 10);

    const [users, trips, events, matches, messages, reviews, reports, deals] = await Promise.all([
      svc.entities.User.list('-created_date', 5000),
      svc.entities.Trip.list('-created_date', 5000),
      svc.entities.Event.list('-created_date', 5000),
      svc.entities.Match.list('-created_date', 5000),
      svc.entities.Message.list('-created_date', 5000),
      svc.entities.Review.list('-created_date', 5000),
      svc.entities.Report.list('-created_date', 5000),
      svc.entities.Deal.list('-created_date', 5000),
    ]);

    const activeSub = users.filter((u) => u.subscription_status === 'active' || u.subscription_status === 'cancelled_active');
    const cancelled = users.filter((u) => ['cancelled_active', 'expired', 'payment_failed'].includes(u.subscription_status));
    const newUsers = users.filter((u) => new Date(u.created_date) >= new Date(since));
    const activeTrips = trips.filter((t) => !t.end_date || t.end_date >= today);
    const activeEvents = events.filter((e) => !e.date || e.date >= today);
    const pendingReports = reports.filter((r) => r.status === 'pending');

    let mrr = 0;
    activeSub.forEach((u) => {
      if (u.subscription_plan === 'yearly') mrr += 99 / 12;
      else if (u.subscription_plan === 'monthly') mrr += 12;
      else mrr += 12;
    });

    return Response.json({
      totals: {
        totalUsers: users.length,
        activeSubscribers: activeSub.length,
        newUsers: newUsers.length,
        cancelledSubscriptions: cancelled.length,
        activeTrips: activeTrips.length,
        activeEvents: activeEvents.length,
        matches: matches.length,
        messages: messages.length,
        reviews: reviews.length,
        reports: reports.length,
        pendingReports: pendingReports.length,
        deals: deals.length,
      },
      revenue: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        activeSubscribers: activeSub.length,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});