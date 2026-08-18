import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  Bookmark,
  MapPin,
  Star,
  Calendar,
  Tag,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useSaved } from '@/lib/SavedContext';
import { pathForSavedItem } from '@/lib/saved-item-key';
import { Image } from '@/components/ui/image';
import EmptyState from '@/components/common/EmptyState';
import ScrollFilterChips from '@/components/common/ScrollFilterChips';
import SaveButton from '@/components/common/SaveButton';

const PLACE_TYPES = ['cafe', 'restaurant', 'hotel', 'destination'];

const TYPE_LABELS = {
  cafe: 'Café',
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  destination: 'Destination',
  event: 'Event',
  deal: 'Deal',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'places', label: 'Places' },
  { key: 'events', label: 'Events' },
  { key: 'deals', label: 'Deals' },
];

function SavedItemRow({ item, onOpen }) {
  const typeLabel = TYPE_LABELS[item.type] || item.type;
  const locationLine = [item.location, item.country].filter(Boolean).join(', ');

  return (
    <div className="flex items-center gap-3 bg-card border border-border/60 shadow-soft rounded-3xl p-3">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex flex-1 min-w-0 items-center gap-3 text-left active:opacity-90 transition"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border">
          <Image src={item.image} alt={item.title} fittingType="fill" className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="font-display font-semibold text-sm truncate">{item.title}</h4>
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              {typeLabel}
            </span>
          </div>
          {locationLine && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="truncate">{locationLine}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            {item.rating != null && (
              <span className="text-xs text-foreground flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-brand-gold text-brand-gold" strokeWidth={1.5} />
                {item.rating}
              </span>
            )}
            {item.date && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" strokeWidth={1.5} />
                {moment(item.date).format('D MMM YYYY')}
              </span>
            )}
            {item.price && item.type === 'deal' && (
              <span className="text-xs font-medium text-primary flex items-center gap-1">
                <Tag className="w-3 h-3" strokeWidth={1.5} />
                {item.price}
              </span>
            )}
            {item.info && (
              <span className="text-xs text-muted-foreground truncate">{item.info}</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" strokeWidth={1.5} aria-hidden />
      </button>
      <SaveButton item={item} variant="ghost" className="w-9 h-9 shrink-0" />
    </div>
  );
}

export default function SavedSection({ embedded = false }) {
  const navigate = useNavigate();
  const { items, loading } = useSaved();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'places') return items.filter((i) => PLACE_TYPES.includes(i.type));
    if (filter === 'events') return items.filter((i) => i.type === 'event');
    if (filter === 'deals') return items.filter((i) => i.type === 'deal');
    return items;
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      all: items.length,
      places: items.filter((i) => PLACE_TYPES.includes(i.type)).length,
      events: items.filter((i) => i.type === 'event').length,
      deals: items.filter((i) => i.type === 'deal').length,
    }),
    [items]
  );

  const openItem = (item) => {
    const to = pathForSavedItem(item);
    if (to) navigate(to);
  };

  const chipItems = FILTERS.map((f) => ({
    key: f.key,
    label: `${f.label}${counts[f.key] ? ` (${counts[f.key]})` : ''}`,
  }));

  return (
    <div className={embedded ? '' : 'mt-7'}>
      {!embedded && <h3 className="font-display font-semibold text-base mb-3">Saved</h3>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading saved items…
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved places yet"
          description="Tap the bookmark on any café, restaurant, hotel, event or deal to keep it here for later."
        />
      ) : (
        <>
          <div className="mb-4">
            <ScrollFilterChips items={chipItems} active={filter} onSelect={setFilter} />
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 rounded-2xl border border-dashed border-border">
              Nothing saved in this category yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item) => (
                <SavedItemRow
                  key={item.id || item.item_key}
                  item={item}
                  onOpen={openItem}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
