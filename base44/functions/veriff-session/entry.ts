import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = Deno.env.get("VERIFF_API_KEY");
    if (!apiKey) {
      console.error("veriff-session: VERIFF_API_KEY not configured");
      return Response.json({ error: "Identity verification is not configured." }, { status: 503 });
    }

    let body = {};
    try { body = await req.json(); } catch (e) {}
    const returnUrl = (body && typeof body.returnUrl === "string" && /^https?:\/\//.test(body.returnUrl))
      ? body.returnUrl : null;

    // The Veriff decision webhook lives at this app's origin.
    const origin = new URL(req.url).origin;
    const callbackUrl = `${origin}/api/functions/prod/veriff-webhook`;

    const verification = {
      callback: callbackUrl,
      person: {
        firstName: user.first_name || user.profile_name || "Seluna",
        lastName: user.last_name || "Member",
      },
      vendorData: user.id,
      lang: "en",
      features: ["selfie"],
      timestamp: new Date().toISOString(),
    };
    if (returnUrl) verification.redirect = returnUrl;

    const res = await fetch("https://api.veriff.com/v1/sessions", {
      method: "POST",
      headers: { "X-AUTH-CLIENT": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ verification }),
    });

    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (data.status !== "success" || !data.verification?.url || !data.verification?.id) {
      console.error("veriff-session: Veriff error", res.status, data);
      return Response.json({ error: "Could not start identity verification." }, { status: 502 });
    }

    const session = data.verification;
    await base44.asServiceRole.entities.User.update(user.id, {
      verification_status: "pending",
      verification_provider: "Veriff",
      verification_session_id: session.id,
    });

    return Response.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error("veriff-session error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});