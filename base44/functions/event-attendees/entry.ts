import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { buildProfile } from "../../shared/member-profile.ts";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { event_id } = body;
    if (!event_id) return Response.json({ error: "event_id required" }, { status: 400 });

    const [att, users] = await Promise.all([
      base44.asServiceRole.entities.EventAttendance.filter({ event_id }),
      base44.asServiceRole.entities.User.list(),
    ]);

    const attendees = att.map((a) => {
      const u = users.find((x) => x.id === a.user_id);
      const p = buildProfile(u);
      return {
        attendance_id: a.id,
        user_id: a.user_id,
        status: a.status || "going",
        name: p?.name || "Member",
        avatar: p?.avatar || "",
        city: p?.current_city || "",
      };
    });

    return Response.json({ attendees });
  } catch (error) {
    console.error("event-attendees error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});