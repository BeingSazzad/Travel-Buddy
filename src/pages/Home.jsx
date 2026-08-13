import React from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "@/components/home/HomeHeader";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRow from "@/components/home/SectionRow";
import ContentCard from "@/components/home/ContentCard";
import HomeDealCard from "@/components/home/HomeDealCard";
import RecentlyReviewedSection from "@/components/home/RecentlyReviewedSection";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import HomeFeatured from "@/components/home/HomeFeatured";
import EventList from "@/components/events/EventList";
import { MOCK_EVENTS } from "@/lib/mock-events";
import { SECTIONS } from "@/lib/home-data";
import { resolveEventId } from "@/lib/mock-events";

function SectionHeading({ title, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between app-px mb-2">
      <h2 className="section-header text-foreground">{title}</h2>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-semibold text-primary tap-feedback hover:underline underline-offset-2 transition-all shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (item.type === "destination") {
      const city = item.city || item.location;
      navigate(`/destinations/${encodeURIComponent(city)}`);
    } else if (item.type === "event") {
      const eventId = resolveEventId(item);
      navigate(eventId ? `/events/${eventId}` : "/events");
    } else if (item.type === "trip") navigate(item.tripId ? `/trips/${item.tripId}` : "/trips");
    else if (item.type === "member") navigate(`/members/${item.memberId || "mock_1"}`);
    else if (item.type === "cafe") navigate(`/cafes/${encodeURIComponent(item.title)}`);
    else if (item.type === "hotel") navigate(`/hotels/${encodeURIComponent(item.title)}`);
    else if (item.type === "restaurant") navigate(`/restaurants/${encodeURIComponent(item.title)}`);
    else if (item.type === "deal") navigate(item.dealId ? `/deals/${item.dealId}` : "/deals");
    else navigate("/search");
  };

  const dealsSection = SECTIONS.find((s) => s.title === "Exclusive deals");
  const genericSections = SECTIONS.filter(
    (s) => s.title !== "Popular events" && s.title !== "Exclusive deals" && s.title !== "Recently reviewed places"
  );

  return (
    <div className="pb-8 min-w-0 max-w-full overflow-x-hidden">
      {/* Single hero wash — header + explore share one background */}
      <div className="home-hero-zone">
        <HomeHeader />

        <section className="pt-3 pb-4">
          <SectionHeading title="Explore" />
          <CategoryGrid />
        </section>
      </div>

      <div className="home-feed space-y-8">
        <HomeFeatured />

        <section className="min-w-0 max-w-full">
          <SectionHeading title="Upcoming events" actionLabel="View all" onAction={() => navigate("/events")} />
          <div className="app-px">
            <EventList events={MOCK_EVENTS.slice(0, 3)} />
          </div>
        </section>

        {genericSections.map((s) => (
          <SectionRow
            key={s.title}
            title={s.title}
            items={s.items}
            onSeeAll={() => navigate(s.seeAllPath)}
            renderCard={(item) => <ContentCard item={item} onClick={() => handleCardClick(item)} />}
          />
        ))}

        {dealsSection && (
          <section className="min-w-0 max-w-full">
            <SectionHeading title="Exclusive deals" actionLabel="See all" onAction={() => navigate(dealsSection.seeAllPath)} />
            <HorizontalScroll>
              {dealsSection.items.map((item, i) => (
                <HomeDealCard key={item.dealId || i} item={item} onClick={() => handleCardClick(item)} />
              ))}
            </HorizontalScroll>
          </section>
        )}

        <section className="min-w-0 max-w-full">
          <SectionHeading title="Recently reviewed places" actionLabel="See all" onAction={() => navigate("/reviews")} />
          <RecentlyReviewedSection onItemClick={handleCardClick} />
        </section>
      </div>
    </div>
  );
}
