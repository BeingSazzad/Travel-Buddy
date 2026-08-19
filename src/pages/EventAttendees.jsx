import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import AttendeeList from "@/components/events/ManageAttendees";
import ScreenHeader from "@/components/common/ScreenHeader";
import { findMockEvent, isLocalEventId, hydrateEventPeople } from "@/lib/mock-events";
import { isSameAppUser } from "@/lib/demo-user";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";

export default function EventAttendees() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const apply = (record) => {
    if (!record) {
      setEvent(null);
      setAttendees([]);
      return false;
    }
    const people = hydrateEventPeople(record);
    setEvent(people);
    setAttendees(people.attendees || []);
    return true;
  };

  const overlayLocal = (e) => {
    const local = findMockEvent(id);
    if (!local) return hydrateEventPeople(e);
    return hydrateEventPeople({
      ...e,
      host_id: e.host_id || local.host_id,
      created_by_id: e.created_by_id || local.created_by_id,
      demo_mine: e.demo_mine || local.demo_mine,
      host_name: e.host_name || local.host_name,
      host_avatar: e.host_avatar || local.host_avatar,
      attendees: e.attendees?.length ? e.attendees : local.attendees,
      attendees_count: e.attendees_count || local.attendees_count,
    });
  };

  const load = useCallback(async () => {
    if (isLocalEventId(id)) {
      apply(findMockEvent(id));
      setLoading(false);
      return;
    }

    try {
      const e = await base44.entities.Event.get(id);
      apply(overlayLocal(e));
    } catch {
      apply(findMockEvent(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  if (loading) return <PageLoading />;
  if (!event) {
    return (
      <PageNotFound title="Event not found" backLabel="Back to events" onBack={() => navigate("/events")} />
    );
  }

  const isHost =
    event.demo_mine ||
    isSameAppUser(event.host_id, user?.id) ||
    isSameAppUser(event.created_by_id, user?.id) ||
    isSameAppUser(event.created_by?.id, user?.id);

  return (
    <div className="max-w-app mx-auto min-h-dvh overflow-y-auto app-scroll bg-background page-shell">
      <ScreenHeader
        title="Who’s coming"
        subtitle={event.title}
        showBack
        onBack={() => navigate(`/events/${event.id}`)}
      />
      <AttendeeList event={event} initialAttendees={attendees} onChange={load} isHost={isHost} />
    </div>
  );
}
