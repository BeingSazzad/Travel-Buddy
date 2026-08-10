import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const samples = {
  Cafés: [
    { name: 'Café Norden', loc: 'Copenhagen', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80' },
    { name: 'The Tiny Cup', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1453614512568-c4034dfb0fa0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Brew & Bloom', loc: 'Bali', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80' },
  ],
  Restaurants: [
    { name: 'Olive & Vine', loc: 'Paris', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Saffron Table', loc: 'Marrakech', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Harbor Light', loc: 'Copenhagen', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80' },
  ],
  Hotels: [
    { name: 'Sandhouse Hotel', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1566073771259-6a560657f57b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Maison du Parc', loc: 'Paris', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe595?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali Hideaway', loc: 'Ubud', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80' },
  ],
  Trips: [
    { name: 'Lisbon Solo Week', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali Retreat', loc: 'Ubud', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tokyo Spring', loc: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeed?auto=format&fit=crop&w=500&q=80' },
  ],
  Events: [
    { name: 'Sunset Yoga', loc: 'Copenhagen', img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Wine & Paint', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1513569771920-c9e1d31714ba?auto=format&fit=crop&w=500&q=80' },
    { name: 'Travel Mixer', loc: 'Paris', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80' },
  ],
  Friends: [
    { name: 'Aria K.', loc: 'Berlin', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80' },
    { name: 'Maya R.', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80' },
    { name: 'Sofia L.', loc: 'Bali', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  ],
  Reviews: [
    { name: 'Café Norden', loc: '★ 4.9', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80' },
    { name: 'Maison du Parc', loc: '★ 4.8', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe595?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali Retreat', loc: '★ 5.0', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' },
  ],
  Deals: [
    { name: 'Lisbon Stay 20% off', loc: 'Lisbon', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali Retreat Deal', loc: 'Ubud', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' },
    { name: 'Paris Dinner 2-for-1', loc: 'Paris', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80' },
  ],
  Destinations: [
    { name: 'Lisbon', loc: 'Portugal', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bali', loc: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' },
    { name: 'Marrakech', loc: 'Morocco', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Copenhagen', loc: 'Denmark', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80' },
  ],
};

export default function Category({ category }) {
  const navigate = useNavigate();
  const list = samples[category] || [];

  return (
    <div className="px-5 safe-pt">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="font-display font-bold text-lg mb-1">{category}</h1>
      <p className="text-sm text-muted-foreground mb-5">Curated for women who travel</p>

      <div className="space-y-4">
        {list.map((item) => (
          <div key={item.name} className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card">
            <div className="h-40">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base">{item.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.loc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}