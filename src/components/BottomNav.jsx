import { NavLink } from 'react-router-dom';
import { Home, Map, Users, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/trips', label: 'Trips', icon: Map },
  { to: '/friends', label: 'Friends', icon: Users },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-card/90 backdrop-blur-lg border-t border-border">
      <div className="flex items-stretch justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-2xl transition-all duration-200',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200',
                    isActive && 'bg-foreground/5'
                  )}
                >
                  <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn('text-[10px] font-medium tracking-tight', isActive && 'font-semibold')}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}