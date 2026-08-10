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

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="pb-6">
      <HomeHeader />

      {/* Welcome Greeting */}
      <section className="px-5 mt-3 mb-2">
        <p className="text-xs text-muted-foreground font-medium">
          Good evening, {user?.first_name || "traveler"} 👋
        </p>
        <h2 className="text-2xl font-display font-semibold mt-0.5 tracking-tight text-foreground">
          Where are you going next?
        </h2>
      </section>

      {/* Search */}
      <section className="px-5 mt-4">
        <button
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-2 bg-card border border-border rounded-full px-5 py-3.5 shadow-soft text-left"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="flex-1 text-sm text-muted-foreground">Search destinations, places, events or members</span>
        </button>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <h2 className="font-display font-semibold text-lg px-5 mb-3">Explore</h2>
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
          renderCard={(item) => <ContentCard item={item} />}
        />
      ))}
    </div>
  );
}