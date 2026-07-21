import { Search, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-white font-display font-semibold tracking-tight text-lg">Seluna</span>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80 mb-1">Welcome back</p>
          <h1 className="text-2xl font-display font-semibold leading-tight">
            Where will you<br />wander next?
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search destinations, events, friends"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Find Events', emoji: '🎉' },
          { label: 'Meet Women', emoji: '🫶' },
          { label: 'Discover', emoji: '✨' },
        ].map((q) => (
          <div key={q.label} className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-2xl py-4">
            <span className="text-2xl">{q.emoji}</span>
            <span className="text-[11px] font-medium text-center text-muted-foreground">{q.label}</span>
          </div>
        ))}
      </div>

      {/* Featured destinations */}
      <div className="mt-8">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-lg">Popular destinations</h2>
          <span className="text-xs text-muted-foreground font-medium">See all</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
          {[
            { name: 'Lisbon', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=400&q=80' },
            { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
            { name: 'Marrakech', img: 'https://images.unsplash.com/photo-1597212720158-e21f9b1a4c76?auto=format&fit=crop&w=400&q=80' },
            { name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeed?auto=format&fit=crop&w=400&q=80' },
          ].map((d) => (
            <div key={d.name} className="flex-shrink-0 w-32 h-40 rounded-2xl overflow-hidden relative">
              <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="mt-8 px-5">
        <h2 className="font-display font-semibold text-lg mb-3">Reviews by women</h2>
        <div className="space-y-3">
          {[
            { place: 'Café Lumi', loc: 'Paris', text: 'Cozy, safe and the staff were so welcoming.' },
            { place: 'Riad Yasmine', loc: 'Marrakech', text: 'Best solo stay — met two friends here.' },
          ].map((r) => (
            <div key={r.place} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{r.place}</span>
                <span className="text-[11px] text-muted-foreground">{r.loc}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}