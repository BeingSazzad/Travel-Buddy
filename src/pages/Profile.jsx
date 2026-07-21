import { Settings, Crown, MapPin, Calendar } from 'lucide-react';

export default function Profile() {
  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-semibold text-2xl">Profile</h1>
        <button className="w-10 h-10 rounded-full border border-border shadow-soft flex items-center justify-center text-muted-foreground">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-card shadow"
        />
        <h2 className="font-display font-semibold text-xl mt-3">Clara N.</h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Copenhagen, DK</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Slow traveler, café lover, always chasing sunsets. 🌙
        </p>
      </div>

      {/* Subscription */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-5">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-90">Seluna Plus</span>
        </div>
        <p className="font-display font-semibold text-lg">Active member</p>
        <p className="text-xs opacity-80 mt-0.5">Exclusive deals & verified community</p>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Trips', value: 7 },
          { label: 'Friends', value: 24 },
          { label: 'Events', value: 11 },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border shadow-soft rounded-2xl py-4 text-center">
            <p className="font-display font-semibold text-xl">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-7">
        <h3 className="font-display font-semibold text-base mb-3">Recent activity</h3>
        <div className="space-y-2">
          {[
            { text: 'Joined Sunset Yoga Meetup', date: '2 days ago', icon: Calendar },
            { text: 'Added a new trip: Bali Retreat', date: '5 days ago', icon: MapPin },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border shadow-soft rounded-2xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                <a.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.text}</p>
                <p className="text-[11px] text-muted-foreground">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}