import { useNavigate } from 'react-router-dom';
import { Moon } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-col items-center pt-14 pb-6">
        <Moon className="w-6 h-6 text-[#A1846B] mb-1" strokeWidth={1.5} />
        <span className="font-display font-semibold text-2xl tracking-[0.08em] text-[#A1846B]">SELUNA</span>
      </div>

      <div className="px-5">
        <div className="rounded-3xl overflow-hidden shadow-premium">
          <img
            src="https://images.unsplash.com/photo-1529636798458-92182e6526e8?auto=format&fit=crop&w=900&q=80"
            alt="Women travelling together"
            className="w-full h-72 object-cover"
          />
        </div>
      </div>

      <div className="px-8 pt-8 flex flex-col items-center text-center">
        <h1 className="font-display font-semibold text-3xl text-foreground leading-tight">
          Travel freely.
          <br />
          Never feel alone.
        </h1>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">
          Seluna connects women with travel friends, events and trusted recommendations — so every journey feels safe, social and inspired.
        </p>
      </div>

      <div className="px-7 mt-auto pb-10 pt-8 flex flex-col gap-3">
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-3.5 rounded-full bg-foreground text-background font-medium text-sm shadow-soft active:scale-[0.98] transition-transform"
        >
          Create account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3.5 rounded-full border border-border text-foreground font-medium text-sm active:scale-[0.98] transition-transform"
        >
          Log in
        </button>
      </div>
    </div>
  );
}