import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { DESTINATIONS } from "@/lib/destinations";
import { CAFES } from "@/lib/cafes";
import { RESTAURANTS } from "@/lib/restaurants";
import { HOTELS } from "@/lib/hotels";

function useContent(entity, fallback, sortField = "sort_order") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    base44.entities[entity]
      .list(sortField, 500)
      .then((list) => {
        if (!list || list.length === 0) setItems(fallback);
        else setItems(list.filter((i) => i.status !== "hidden"));
      })
      .catch(() => setItems(fallback))
      .finally(() => setLoading(false));
  }, [entity]);
  return { items, loading };
}

export const useDestinations = () => useContent("Destination", DESTINATIONS);
export const useCafes = () => useContent("Cafe", CAFES);
export const useRestaurants = () => useContent("Restaurant", RESTAURANTS);
export const useHotels = () => useContent("Hotel", HOTELS);