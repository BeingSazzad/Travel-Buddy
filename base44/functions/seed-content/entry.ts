import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { DESTINATIONS, CAFES, RESTAURANTS, HOTELS } from '../../shared/seed-data.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const svc = base44.asServiceRole;
    const seeded = { destinations: 0, cafes: 0, restaurants: 0, hotels: 0 };

    const existingDest = await svc.entities.Destination.list(1);
    if (existingDest.length === 0) {
      await svc.entities.Destination.bulkCreate(
        DESTINATIONS.map((d, i) => ({
          city: d.city, country: d.country, continent: d.continent, weather: d.weather,
          image: d.image, description: d.description, featured: !!d.featured,
          tags: d.tags, counts: d.counts, status: 'published', sort_order: i,
        }))
      );
      seeded.destinations = DESTINATIONS.length;
    }

    const existingCafes = await svc.entities.Cafe.list(1);
    if (existingCafes.length === 0) {
      await svc.entities.Cafe.bulkCreate(
        CAFES.map((c, i) => ({
          name: c.name, city: c.city, country: c.country, image: c.image, gallery: c.gallery,
          description: c.description, rating: c.rating, reviews: c.reviews, price: c.price,
          distance: c.distance, address: c.address, hours: c.hours, phone: c.phone,
          website: c.website, tags: c.tags, status: 'published', sort_order: i,
        }))
      );
      seeded.cafes = CAFES.length;
    }

    const existingRest = await svc.entities.Restaurant.list(1);
    if (existingRest.length === 0) {
      await svc.entities.Restaurant.bulkCreate(
        RESTAURANTS.map((r, i) => ({ ...r, status: 'published', sort_order: i }))
      );
      seeded.restaurants = RESTAURANTS.length;
    }

    const existingHotels = await svc.entities.Hotel.list(1);
    if (existingHotels.length === 0) {
      await svc.entities.Hotel.bulkCreate(
        HOTELS.map((h, i) => ({ ...h, status: 'published', sort_order: i }))
      );
      seeded.hotels = HOTELS.length;
    }

    return Response.json({ ok: true, seeded });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});