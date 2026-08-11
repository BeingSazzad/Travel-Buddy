import { cn } from "@/lib/utils";

/** Horizontal chip row — scroll contained, no page-level overflow */
export default function ScrollFilterChips({
  items,
  active,
  onSelect,
  activeClass = "chip-active",
  inactiveClass = "chip-inactive",
}) {
  return (
    <div className="h-scroll min-w-0 max-w-full">
      <div className="flex gap-2 pb-1">
        {items.map((item) => {
          const key = item.key ?? item.value ?? item;
          const label = item.label ?? item;
          const isActive = typeof active === "function" ? active(key) : active === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={cn(
                "shrink-0 px-3 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
                isActive ? activeClass : inactiveClass
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
