import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import HomeHeader from "@/components/home/HomeHeader";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRow from "@/components/home/SectionRow";
import ContentCard from "@/components/home/ContentCard";
import HomeFeatured from "@/components/home/HomeFeatured";
import { SECTIONS } from "@/lib/home-data";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSeeAll = (title) => {
    if (title.includes("Recommended")) navigate("/destinations");
    else if (title.includes("Trending")) navigate("/destinations");
    else if (title.includes("Popular events")) navigate("/events");
    else if (title.includes("Women travelling")) navigate("/discover");
    else if (title.includes("Exclusive deals")) navigate("/deals");
    else if (title.includes("reviewed places")) navigate("/cafes");
    else navigate("/search");
  };

  const handleCardClick = (item) => {
    if (item.type === "destination") navigate(`/destinations/${encodeURIComponent(item.location || item.title)}`);
    else if (item.type === "event") navigate("/events");
    else if (item.type === "trip") navigate("/trips");
    else if (item.type === "member") navigate("/discover");
    else if (item.type === "cafe") navigate(`/cafes/${encodeURIComponent(item.title)}`);
    else if (item.type === "hotel") navigate(`/hotels/${encodeURIComponent(item.title)}`);
    else if (item.type === "restaurant") navigate(`/restaurants/${encodeURIComponent(item.title)}`);
    else if (item.type === "deal") navigate("/deals");
    else navigate("/search");
  };

  return (
    <div className="pb-6 gradient-top-bg">
      <HomeHeader />

      {/* Welcome Greeting */}
      <section className="app-px mt-3 mb-2">
        <p className="text-xs text-muted-foreground font-medium">
          {getGreeting()}, {user?.first_name || "traveler"} 👋
        </p>
        <h2 className="font-display font-bold text-lg mt-0.5 tracking-tight text-foreground">
          Where are you going next?
        </h2>
      </section>

      {/* Search */}
      <section className="app-px mt-4">
          <button
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-2 bg-card border border-border/80 rounded-2xl px-4 py-3 shadow-soft text-left interactive-card tap-feedback focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A1846B]/30"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="flex-1 text-sm text-muted-foreground">Search destinations, events, members…</span>
        </button>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <h2 className="font-display font-semibold text-base app-px mb-3">Explore</h2>
        <CategoryGrid />
      </section>

      {/* Admin-arranged featured content */}
      <HomeFeatured />

      {/* Horizontal content sections */}
      {SECTIONS.map((s) => (
        <SectionRow
          key={s.title}
          title={s.title}
          items={s.items}
          onSeeAll={() => handleSeeAll(s.title)}
          renderCard={(item) => <ContentCard item={item} onClick={() => handleCardClick(item)} />}
        />
      ))}
    </div>
  );
}