import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { buildProfile, formatDates } from "../../shared/member-profile.ts";

function arr(a) { return Array.isArray(a) ? a : []; }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetId = body.user_id;
    if (!targetId) return Response.json({ error: "user_id required" }, { status: 400 });

    const users = await base44.asServiceRole.entities.User.list();
    const target = users.find((u) => u.id === targetId);
    if (!target) return Response.json({ error: "Not found" }, { status: 404 });

    const allTrips = await base44.asServiceRole.entities.Trip.list("-start_date", 200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trips = allTrips
      .filter((t) => t.created_by_id === targetId && t.visibility !== "hidden" && new Date(t.start_date) >= today)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      .map((t) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        country: t.country || "",
        start_date: t.start_date,
        end_date: t.end_date,
        travel_style: t.travel_style || "",
        looking_for: arr(t.looking_for),
        dates: formatDates(t),
      }));

    return Response.json({ profile: buildProfile(target), trips });
  } catch (error) {
    console.error("member-profile error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});