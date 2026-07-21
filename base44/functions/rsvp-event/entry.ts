import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, event_id, attendance_id } = body;
    if (!event_id || !action) return Response.json({ error: "event_id and action required" }, { status: 400 });

    const event = await base44.entities.Event.get(event_id);
    if (!event) return Response.json({ error: "Event not found" }, { status: 404 });
    const isHost = event.host_id === user.id;

    if (action === "join") {
      const existing = await base44.asServiceRole.entities.EventAttendance.filter({ event_id, user_id: user.id });
      if (existing.length) return Response.json({ status: existing[0].status, count: event.attendees_count || 0 });

      const going = await base44.asServiceRole.entities.EventAttendance.filter({ event_id, status: "going" });
      if (going.length >= (event.max_attendees || 0)) return Response.json({ full: true });

      const status = event.visibility === "approval" ? "pending" : "going";
      await base44.entities.EventAttendance.create({
        event_id,
        user_id: user.id,
        host_id: event.host_id,
        status,
        event_title: event.title,
        event_image: event.image,
        event_date: event.date,
      });
      let count = event.attendees_count || 0;
      if (status === "going") {
        count += 1;
        await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $set: { attendees_count: count } });
      }
      return Response.json({ status, count });
    }

    if (action === "leave") {
      const mine = await base44.asServiceRole.entities.EventAttendance.filter({ event_id, user_id: user.id });
      if (mine.length && mine[0].status === "going") {
        const count = Math.max(0, (event.attendees_count || 0) - 1);
        await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $set: { attendees_count: count } });
      }
      await base44.asServiceRole.entities.EventAttendance.deleteMany({ event_id, user_id: user.id });
      return Response.json({ left: true });
    }

    if (action === "approve") {
      if (!isHost || !attendance_id) return Response.json({ error: "Not allowed" }, { status: 403 });
      const att = await base44.asServiceRole.entities.EventAttendance.get(attendance_id);
      if (att && att.status === "pending") {
        await base44.asServiceRole.entities.EventAttendance.updateMany({ id: attendance_id }, { $set: { status: "going" } });
        const count = (event.attendees_count || 0) + 1;
        await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $set: { attendees_count: count } });
      }
      return Response.json({ ok: true, count: (event.attendees_count || 0) + 1 });
    }

    if (action === "reject") {
      if (!isHost || !attendance_id) return Response.json({ error: "Not allowed" }, { status: 403 });
      await base44.asServiceRole.entities.EventAttendance.deleteMany({ id: attendance_id });
      return Response.json({ ok: true });
    }

    if (action === "remove") {
      if (!isHost || !attendance_id) return Response.json({ error: "Not allowed" }, { status: 403 });
      const att = await base44.asServiceRole.entities.EventAttendance.get(attendance_id);
      if (att && att.status === "going") {
        const count = Math.max(0, (event.attendees_count || 0) - 1);
        await base44.asServiceRole.entities.Event.updateMany({ id: event_id }, { $set: { attendees_count: count } });
      }
      await base44.asServiceRole.entities.EventAttendance.deleteMany({ id: attendance_id });
      return Response.json({ ok: true });
    }

    if (action === "cancel") {
      if (!isHost) return Response.json({ error: "Not allowed" }, { status: 403 });
      await base44.asServiceRole.entities.EventAttendance.deleteMany({ event_id });
      await base44.asServiceRole.entities.Event.deleteMany({ id: event_id });
      return Response.json({ ok: true });
    }

    return Response.json({ error: "unknown action" }, { status: 400 });
  } catch (error) {
    console.error("rsvp-event error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});