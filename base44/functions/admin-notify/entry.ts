import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { title, body: text, type = 'admin_message', target, user_ids } = body;
    if (!title) return Response.json({ error: 'title is required' }, { status: 400 });

    let recipients = [];
    if (target === 'all') {
      const users = await base44.asServiceRole.entities.User.list('-created_date', 5000);
      recipients = users.map((u) => u.id);
    } else {
      recipients = Array.isArray(user_ids) ? user_ids : [];
    }
    if (recipients.length === 0) return Response.json({ error: 'no recipients' }, { status: 400 });

    const notifs = recipients.map((uid) => ({
      user_id: uid,
      type,
      title,
      body: text || '',
      link: '/notifications',
    }));
    for (let i = 0; i < notifs.length; i += 500) {
      await base44.asServiceRole.entities.Notification.bulkCreate(notifs.slice(i, i + 500));
    }
    return Response.json({ sent: recipients.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});