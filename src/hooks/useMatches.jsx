import { useEffect, useState, useCallback } from "react";

import { base44 } from "@/api/base44Client";

import { useAuth } from "@/lib/AuthContext";



import { MOCK_MEMBERS } from "@/lib/member-profile";

import { formatDates } from "@/lib/trip-utils";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";



function buildMockMatch(member, index) {

  const trip = member.trip;

  const city = trip?.city || member.current_city;

  const interest = member.interests?.[0];

  const language = member.languages?.[0];



  const reasons = [

    { type: "destination", label: `Travelling to ${city}` },

    { type: "dates", label: "Overlapping dates" },

  ];

  if (interest) reasons.push({ type: "interest", label: interest });

  if (language) reasons.push({ type: "language", label: language });



  const parts = [`You are both travelling to ${city} around the same time`];

  if (interest) parts.push(`interested in ${interest}`);

  if (language) parts.push(`both speak ${language}`);



  return {

    id: `match_mock_${index + 1}`,

    user_id: member.user_id,

    name: member.name,

    avatar: member.avatar,

    age: member.age,

    locationText: member.current_city,

    city: trip?.city || member.current_city,

    country: trip?.country || member.country,

    dates: trip ? formatDates(trip) : "",

    matchPercent: 72 + (index % 4) * 5,

    explanation: `${parts[0]}${parts.length > 1 ? " and " + parts.slice(1).join(", ") : ""}.`,

    reasons,

  };

}



const MOCK_MATCHES = MOCK_MEMBERS.map((m, i) => buildMockMatch(m, i));



export function useMatches() {

  const { isAuthenticated } = useAuth();

  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(false);



  const load = useCallback(async () => {

    try {

      setLoading(true);

      const res = await base44.functions.invoke("trip-matches", {});

      const list = res.data?.suggestions || [];

      setMatches(list.length > 0 ? list : useDemoFallbacks ? MOCK_MATCHES : []);

    } catch {

      setMatches(useDemoFallbacks ? MOCK_MATCHES : []);

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => {

    if (isAuthenticated) load();

  }, [isAuthenticated, load]);



  const blockMember = useCallback(

    async (userId, reason = "block") => {

      try {

        await base44.entities.BlockedMember.create({ blocked_user_id: userId, reason });

      } catch (e) {

        /* already blocked */

      }

      await load();

    },

    [load]

  );



  return { matches, loading, reload: load, blockMember };

}

