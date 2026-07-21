import { MapPin, Users } from 'lucide-react';

export default function RecommendedCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-soft">
      <div className="h-52 relative">
        <img
          src="https://images.unsplash.com/photo-1529636798458-92182e6526e8?auto=format&fit=crop&w=800&q=80"
          alt="Friends together"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 text-[11px] font-medium bg-white/90 backdrop-blur text-foreground px-2.5 py-1 rounded-full">
          Featured
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base text-foreground">
          Girls' weekend in Copenhagen
        </h3>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> Copenhagen
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" strokeWidth={1.5} /> 18 attending
          </span>
        </div>
      </div>
    </div>
  );
}