import { Coffee, UtensilsCrossed, Building2, Plane, Gift, Users, Star, Heart } from 'lucide-react';

const items = [
  { label: 'Caféer', icon: Coffee },
  { label: 'Restauranter', icon: UtensilsCrossed },
  { label: 'Hoteller', icon: Building2 },
  { label: 'Rejser', icon: Plane },
  { label: 'Events', icon: Gift },
  { label: 'Veninder', icon: Users },
  { label: 'Anmeldelser', icon: Star },
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