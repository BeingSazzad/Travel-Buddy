import { useNavigate } from 'react-router-dom';
import { Coffee, UtensilsCrossed, Building2, Plane, Gift, Users, Star, Heart } from 'lucide-react';

const items = [
  { label: 'Cafés', icon: Coffee, to: '/cafes' },
  { label: 'Restaurants', icon: UtensilsCrossed, to: '/restaurants' },
  { label: 'Hotels', icon: Building2, to: '/hotels' },
  { label: 'Trips', icon: Plane, to: '/trips' },
  { label: 'Events', icon: Gift, to: '/events' },
  { label: 'Friends', icon: Users, to: '/friends' },
  { label: 'Reviews', icon: Star, to: '/reviews' },
  { label: 'Deals', icon: Heart, to: '/deals' },
];

export default function ExploreGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl py-4 shadow-soft active:scale-95 transition-transform"
        >
          <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          <span className="text-[10.5px] font-medium text-muted-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}