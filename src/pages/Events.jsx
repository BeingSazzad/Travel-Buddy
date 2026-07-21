import { Plus, MapPin, Calendar, Users } from 'lucide-react';

export default function Events() {
  const events = [
    { title: 'Sunset Yoga Meetup', loc: 'Lisbon', date: 'Aug 5 · 7 PM', attendees: 12, img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=500&q=80' },
    { title: 'Café Crawl for Solo Women', loc: 'Paris', date: 'Aug 9 · 11 AM', attendees: 8, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80' },
    { title: 'Bali Surf Day', loc: 'Canggu', date: 'Sep 1 · 9 AM', attendees: 15, img: 'https://images.unsplash.com/photo-1502680390469-b7593380ba38?auto=format&fit=crop&w=500&q=80' },
  ];

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Join or host a meetup</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.title} className="rounded-2xl overflow-hidden border border-border bg-card">
            <div className="h-40 relative">
              <img src={e.img} alt={e.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base">{e.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{e.loc}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{e.date}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.attendees} going</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}