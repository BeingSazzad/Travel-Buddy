import { Plus, MapPin } from 'lucide-react';

export default function Trips() {
  const trips = [
    { name: 'Lisbon Solo Week', dest: 'Lisbon, Portugal', date: 'Aug 12 – 19', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali Retreat', dest: 'Ubud, Bali', date: 'Sep 3 – 14', status: 'Planning', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tokyo Spring', dest: 'Tokyo, Japan', date: 'Apr 2026', status: 'Past', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeed?auto=format&fit=crop&w=500&q=80' },
  ];

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl">My Trips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Plan, share, remember</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {trips.map((t) => (
          <div key={t.name} className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card">
            <div className="h-40 relative">
              <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 text-[11px] font-semibold bg-white/90 backdrop-blur text-foreground px-2.5 py-1 rounded-full">
                {t.status}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base">{t.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.dest}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}