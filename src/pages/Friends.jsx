import { Search, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Friends() {
  const navigate = useNavigate();
  const friends = [
    { name: 'Aria K.', loc: 'Berlin, DE', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { name: 'Maya R.', loc: 'Lisbon, PT', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sofia L.', loc: 'Bali, ID', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Nina T.', loc: 'Tokyo, JP', img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80' },
    { name: 'Elena M.', loc: 'Marrakech, MA', img: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=200&q=80' },
  ];

  const suggestions = [
    { name: 'Camille D.', loc: 'Paris, FR', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Yuki S.', loc: 'Osaka, JP', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="px-5 safe-pt">
      <h1 className="font-display font-semibold text-2xl mb-1">Friends</h1>
      <p className="text-sm text-muted-foreground mb-4">Women exploring like you</p>

      <button
        onClick={() => navigate('/discover')}
        className="w-full flex items-center gap-3 bg-gradient-to-br from-[#A1846B] to-[#8a6a52] text-white rounded-2xl px-4 py-4 mb-5 shadow-soft active:scale-[0.99] transition text-left"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold">Find travel friends</p>
          <p className="text-xs text-white/80">Swipe to connect with women heading your way</p>
        </div>
      </button>

      <div className="flex items-center gap-2 bg-card border border-border shadow-soft rounded-2xl px-4 py-3 mb-5">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input placeholder="Find travelers" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="space-y-2">
        {friends.map((f) => (
          <div key={f.name} className="flex items-center gap-3 py-2">
            <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.loc}</p>
            </div>
            <button className="w-9 h-9 rounded-full border border-border shadow-soft flex items-center justify-center text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-base mt-7 mb-3">Suggested for you</h2>
      <div className="space-y-2">
        {suggestions.map((f) => (
          <div key={f.name} className="flex items-center gap-3 py-2">
            <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.loc}</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}