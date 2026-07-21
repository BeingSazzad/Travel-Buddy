import { Coffee, UtensilsCrossed, Building2, Plane, Gift, Users, Star, Heart } from 'lucide-react';

const items = [
  { label: 'Cafés', icon: Coffee },
  { label: 'Restaurants', icon: UtensilsCrossed },
  { label: 'Hotels', icon: Building2 },
  { label: 'Trips', icon: Plane },
  { label: 'Events', icon: Gift },
  { label: 'Friends', icon: Users },
  { label: 'Reviews', icon: Star },
  { label: 'Deals', icon: Heart },
];

export default function ExploreGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl py-4 shadow-soft active:scale-95 transition-transform"
        >
          <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          <span className="text-[10.5px] font-medium text-muted-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}