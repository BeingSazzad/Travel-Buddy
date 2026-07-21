import { ChevronLeft, Bell, Moon, Search } from 'lucide-react';
import ExploreGrid from '@/components/home/ExploreGrid';
import RecommendedCard from '@/components/home/RecommendedCard';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <button className="w-10 h-10 flex items-center justify-center text-foreground">
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="flex flex-col items-center">
            <Moon className="w-4 h-4 text-accent mb-0.5" strokeWidth={1.5} />
            <span className="font-display font-semibold tracking-[0.25em] text-sm">SELUNA</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-foreground">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <section className="px-5 mt-3">
        <h1 className="font-display font-semibold text-2xl text-foreground leading-tight">
          Velkommen til Seluna
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Dit fællesskab. Dine oplevelser. Din rejse.
        </p>
      </section>

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