import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, event_id } = body;
    if (!event_id || !action) return Response.json({ error: "event_id and action required" }, { status: 400 });

    const event = await base44.entities.Event.get(event_id);
    if (!event) return Response.json({ error: "Event not found" }, { status: 404 });

    if (action === "join") {
      const existing = await base44.asServiceRole.entities.EventAttendance.filter({ event_id, user_id: user.id });
      if (existing.length) {
        return Response.json({ joined: true, count: event.attendees_count || 0 });
      }
      if ((event.attendees_count || 0) >= (event.max_attendees || 0)) {
        return Response.json({ full: true });
      }
      await base44.entities.EventAttendance.create({
        event_id,
        user_id: user.id,
        event_title: event.title,
        event_image: event.image,
        event_date: event.date,
      });
      await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $inc: { attendees_count: 1 } });
      return Response.json({ joined: true, count: (event.attendees_count || 0) + 1 });
    }

    if (action === "leave") {
      await base44.asServiceRole.entities.EventAttendance.deleteMany({ event_id, user_id: user.id });
      await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $inc: { attendees_count: -1 } });
      return Response.json({ joined: false, count: Math.max(0, (event.attendees_count || 0) - 1) });
    }

    return Response.json({ error: "unknown action" }, { status: 400 });
  } catch (error) {
    console.error("rsvp-event error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});