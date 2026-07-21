import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const all = await base44.asServiceRole.entities.BlockedMember.list("-created_date", 1000);
    const blockedByMe = all.filter((b) => b.created_by_id === user.id).map((b) => b.blocked_user_id);
    const blockedMe = all.filter((b) => b.blocked_user_id === user.id).map((b) => b.created_by_id);

    return Response.json({ blockedByMe, blockedMe });
  } catch (error) {
    console.error("block-status error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});