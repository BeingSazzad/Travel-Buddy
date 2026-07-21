import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const q = (body.query || "").trim();
    if (!q) return Response.json({ results: [] });

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Seluna/1.0 (contact@seluna.app)" },
    });
    const data = await res.json();
    if (!data || !data.length) return Response.json({ results: [] });
    return Response.json({
      results: [{ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name }],
    });
  } catch (error) {
    console.error("geocode error", error);
    return Response.json({ results: [] }, { status: 500 });
  }
});