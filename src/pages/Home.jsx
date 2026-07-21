import { Search } from 'lucide-react';
import BrandHero from '@/components/home/BrandHero';
import ExploreGrid from '@/components/home/ExploreGrid';
import RecommendedCard from '@/components/home/RecommendedCard';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Brand hero */}
      <BrandHero />

      {/* Search */}
      <section className="px-5 mt-5">
        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-3.5 shadow-soft">
          <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            placeholder="Søg på café, restaurant, hotel, rejse..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {/* Explore */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Udforsk</h2>
          <span className="text-xs font-medium text-accent">Se alle</span>
        </div>
        <ExploreGrid />
      </section>

      {/* Recommended */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Anbefalet til dig</h2>
          <span className="text-xs font-medium text-accent">Se alle</span>
        </div>
        <RecommendedCard />
      </section>
    </div>
  );
}