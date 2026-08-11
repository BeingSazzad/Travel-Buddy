import { UserPlus, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Shared stroke for all connect / connection UI icons */
export const CONNECT_STROKE = 2;

const SIZES = {
  sm: { button: 'w-10 h-10', icon: 'w-4 h-4' },
  lg: { button: 'w-14 h-14', icon: 'w-6 h-6' },
  xl: { button: 'w-16 h-16', icon: 'w-7 h-7' },
};

export function ConnectIcon({ className, strokeWidth = CONNECT_STROKE }) {
  return <UserPlus className={className} strokeWidth={strokeWidth} />;
}

export function ConnectPendingIcon({ className, strokeWidth = CONNECT_STROKE }) {
  return <Clock className={className} strokeWidth={strokeWidth} />;
}

/**
 * Circular connect action — travel community (not dating).
 * sm: list rows · lg: discover card · xl: legacy match card
 */
export function ConnectIconButton({
  size = 'sm',
  loading = false,
  pending = false,
  disabled,
  onClick,
  className,
  variant = 'brand',
  'aria-label': ariaLabel,
}) {
  const s = SIZES[size] || SIZES.sm;
  const isDisabled = disabled || loading || pending;

  const variants = {
    brand: pending
      ? 'bg-primary/15 text-primary border border-primary/30'
      : 'gradient-brand-button shadow-sm text-white',
    outline: 'bg-card border-2 border-primary/40 text-primary shadow-soft',
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel ?? (pending ? 'Request pending' : 'Connect')}
      className={cn(
        'rounded-full flex items-center justify-center shrink-0 tap-feedback transition active:scale-95 disabled:opacity-60',
        s.button,
        variants[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className={cn(s.icon, 'animate-spin')} strokeWidth={CONNECT_STROKE} />
      ) : pending ? (
        <Clock className={s.icon} strokeWidth={CONNECT_STROKE} />
      ) : (
        <UserPlus className={s.icon} strokeWidth={CONNECT_STROKE} />
      )}
    </button>
  );
}
