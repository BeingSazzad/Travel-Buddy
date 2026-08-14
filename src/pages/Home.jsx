import React from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "@/components/home/HomeHeader";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRow from "@/components/home/SectionRow";
import ContentCard from "@/components/home/ContentCard";
import HomeDealCard from "@/components/home/HomeDealCard";
import RecentlyReviewedSection from "@/components/home/RecentlyReviewedSection";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import { SECTIONS } from "@/lib/home-data";
import { countTravellersHere, destinationsWithTravellers } from "@/lib/destination-stats";
import { resolveEventId } from "@/lib/mock-events";

function homeSections() {
  const recommended = SECTIONS.find((s) => s.title === "Recommended for you");
  const recommendedItems = (recommended?.items || []).filter(
    (item) => item.type !== "destination" || countTravellersHere(item.city) > 0
  );
  const recommendedCities = new Set(recommendedItems.map((i) => i.city));
  const trending = destinationsWithTravellers().filter((d) => !recommendedCities.has(d.city));

  return SECTIONS.map((s) => {
    if (s.title === "Recommended for you") return { ...s, items: recommendedItems };
    if (s.title === "Trending destinations") return { ...s, items: trending };
    return s;
  }).filter((s) => s.items?.length || s.title === "Recently reviewed places");
}

function homeCardVariant(title) {
  if (title === "Recommended for you" || title === "Trending destinations") return "destination";
  if (title === "Popular events") return "event";
  if (title === "Women travelling soon") return "member";
  return "destination";
}

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

  return (
    <div className="pb-8 min-w-0 max-w-full overflow-x-hidden">
      <div className="home-hero-zone">
        <HomeHeader />

        <section className="pt-3 pb-4">
          <SectionHeading title="Explore" />
          <CategoryGrid />
        </section>
      </div>

      <div className="home-feed space-y-8">
        {homeSections().map((s) => {
          if (s.title === "Exclusive deals") {
            return (
              <section key={s.title} className="min-w-0 max-w-full">
                <SectionHeading title={s.title} actionLabel="See all" onAction={() => navigate(s.seeAllPath)} />
                <HorizontalScroll>
                  {s.items.map((item, i) => (
                    <HomeDealCard key={item.dealId || i} item={item} onClick={() => handleCardClick(item)} />
                  ))}
                </HorizontalScroll>
              </section>
            );
          }

          if (s.title === "Recently reviewed places") {
            return (
              <section key={s.title} className="min-w-0 max-w-full">
                <SectionHeading title={s.title} actionLabel="See all" onAction={() => navigate("/reviews")} />
                <RecentlyReviewedSection onItemClick={handleCardClick} />
              </section>
            );
          }

          return (
            <SectionRow
              key={s.title}
              title={s.title}
              items={s.items}
              onSeeAll={() => navigate(s.seeAllPath)}
              renderCard={(item, i) => (
                <ContentCard
                  item={item}
                  variant={homeCardVariant(s.title)}
                  onClick={() => handleCardClick(item)}
                />
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
