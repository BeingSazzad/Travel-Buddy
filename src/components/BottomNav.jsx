import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, MessageCircle, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/discover', label: 'Match', icon: Compass },
  { to: '/trips', label: 'Trips', icon: Map },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 bg-card/92 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_32px_-12px_rgba(44,26,14,0.12)]">
      <div className="flex items-stretch justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => {
              const isCurrent = to === '/' ? pathname === '/' : pathname === to;
              if (isCurrent) {
                const el = document.querySelector('.app-scroll:not(.hidden)');
                if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-2xl transition-all duration-200 tap-feedback',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200',
                    isActive && 'nav-pill-active shadow-sm'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')}
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                </div>
                <span className={cn('text-[10px] font-medium tracking-tight transition-all', isActive && 'font-semibold text-[#A1846B]')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
