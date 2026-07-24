import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
  return a >= 0 ? a : null;
}

function mapStatus(s) {
  if (s === "resubmitted") return "resubmission_requested";
  if (s === "expired") return "expired";
  if (s === "abandoned") return "abandoned";
  return "declined";
}

async function hexHmacSha256(secret, text) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const secret = Deno.env.get("VERIFF_SHARED_SECRET");
    if (!secret) {
      console.error("veriff-webhook: VERIFF_SHARED_SECRET not configured");
      return Response.json({ error: "not configured" }, { status: 503 });
    }

    const signature = req.headers.get("x-hmac-sha256") || req.headers.get("x-veriff-signature") || "";
    const rawBody = await req.text();
    const computed = await hexHmacSha256(secret, rawBody);
    if (!signature || computed.toLowerCase() !== String(signature).toLowerCase()) {
      console.error("veriff-webhook: invalid signature");
      return Response.json({ error: "invalid signature" }, { status: 401 });
    }

    let event = {};
    try { event = JSON.parse(rawBody); } catch (e) {
      return Response.json({ ok: true });
    }
    const v = event?.verification || {};
    const status = v.status;
    const sessionId = v.id;
    const userId = v.vendorData || "";

    const DECISIONS = ["approved", "declined", "resubmitted", "expired", "abandoned"];
    if (!DECISIONS.includes(status) || !userId || !sessionId) {
      return Response.json({ ok: true });
    }

    const base44 = createClientFromRequest(req);
    const users = await base44.asServiceRole.entities.User.list("-created_date", 1000);
    const user = users.find((u) => u.id === userId);
    if (!user) return Response.json({ ok: true });

    const veriffDob = v?.person?.dob || v?.person?.dateOfBirth || v?.person?.birthDate || "";
    const now = new Date().toISOString();

    if (status === "approved") {
      const age = ageFromDob(veriffDob) != null ? ageFromDob(veriffDob) : ageFromDob(user.date_of_birth);
      const isAdult = age != null && age >= 18;
      if (isAdult) {
        // Approved AND 18+ — grant verified status. No ID/selfie images are stored.
        await base44.asServiceRole.entities.User.update(userId, {
          identity_verified: true,
          age_verified: true,
          verification_status: "approved",
          verification_provider: "Veriff",
          verified_at: now,
          ...(veriffDob ? { date_of_birth: veriffDob } : {}),
        });
      } else {
        // Approved ID but under 18 — no verified status; store the verified DOB so
        // the app's age gate blocks the account.
        await base44.asServiceRole.entities.User.update(userId, {
          identity_verified: false,
          age_verified: false,
          verification_status: "declined",
          ...(veriffDob ? { date_of_birth: veriffDob } : {}),
        });
      }
    } else {
      // declined, expired, abandoned, resubmitted — never grant verified status.
      await base44.asServiceRole.entities.User.update(userId, {
        identity_verified: false,
        age_verified: false,
        verification_status: mapStatus(status),
      });
    }

    console.log("veriff-webhook processed", { userId, status });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("veriff-webhook error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});