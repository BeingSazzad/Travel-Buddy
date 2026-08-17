import React from "react";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import GoingFaces from "@/components/common/GoingFaces";
import { countTravellersHere, travellingHereLabel } from "@/lib/destination-stats";
import { findMockEvent } from "@/lib/mock-events";
import { fmtEventDate } from "@/lib/event-options";

const FRAME = {
  destination: "w-[148px] h-[196px] shrink-0",
  event: "w-[178px] h-[168px] shrink-0",
  member: "w-[136px] h-[176px] shrink-0",
  recommended: "w-[148px] h-[196px] shrink-0",
};

function eventGoing(eventId) {
  const ev = findMockEvent(eventId);
  const count = ev?.attendees_count || ev?.attendees?.length || 0;
  const faces = (ev?.attendees || []).slice(0, 3).map((a) => a.avatar).filter(Boolean);
  return { count, faces };
}

export default function ContentCard({ item, onClick, variant = "destination" }) {
  const destMeta =
    item.type === "destination"
      ? travellingHereLabel(countTravellersHere(item.city || item.title))
      : item.type !== "event" && item.type !== "member"
        ? item.info
        : undefined;
  const eventDate =
    item.type === "event" ? fmtEventDate(findMockEvent(item.eventId)?.date) : "";
  const going = item.type === "event" ? eventGoing(item.eventId) : null;

  return (
    <OverlayMediaCard
      image={item.image}
      title={item.title}
      location={item.location}
      meta={destMeta}
      badge={eventDate || undefined}
      saveItem={item.type === "member" ? undefined : item}
      onClick={onClick}
      className={FRAME[variant] || FRAME.destination}
      titleClassName="text-sm truncate"
      imageClassName={item.type === "member" ? "object-top" : undefined}
      endSlot={going?.count > 0 ? <GoingFaces count={going.count} avatars={going.faces} /> : undefined}
    />
  );
}
