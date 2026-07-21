import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { buildProfile, formatDates } from "../../shared/member-profile.ts";

function arr(a) { return Array.isArray(a) ? a : []; }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { liked_user_id, action } = body;
    if (!liked_user_id || !["like", "pass"].includes(action)) {
      return Response.json({ error: "liked_user_id and action (like|pass) required" }, { status: 400 });
    }

    await base44.entities.Like.create({ liked_user_id, action });

    if (action !== "like") return Response.json({ matched: false });

    // Already matched?
    const existing = await base44.asServiceRole.entities.Match.filter({
      $or: [
        { created_by_id: user.id, "data.match_user_id": liked_user_id },
        { created_by_id: liked_user_id, "data.match_user_id": user.id },
      ],
    });
    if (existing.length) return Response.json({ matched: true, match: existing[0] });

    // Did they already like me?
    const theirLikes = await base44.asServiceRole.entities.Like.filter({
      created_by_id: liked_user_id,
      "data.action": "like",
    });
    const mutual = theirLikes.some((l) => l.liked_user_id === user.id);
    if (!mutual) return Response.json({ matched: false });

    const users = await base44.asServiceRole.entities.User.list();
    const them = users.find((u) => u.id === liked_user_id);
    const prof = buildProfile(them);

    const match = await base44.entities.Match.create({
      match_user_id: liked_user_id,
      match_name: prof?.name || "",
      match_avatar: prof?.avatar || "",
      city: prof?.current_city || "",
      dates: "",
    });

    return Response.json({ matched: true, match });
  } catch (error) {
    console.error("record-like error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});