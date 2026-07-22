import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 70;
const MAX = 110;

export default function PullToRefresh({ onRefresh, className = "", children }) {
  const ref = useRef(null);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const s = useRef({ startY: 0, startX: 0, pulling: false, dist: 0, refreshing: false });
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setRefreshingBoth = (v) => {
      s.current.refreshing = v;
      setRefreshing(v);
    };
    const setDist = (v) => {
      s.current.dist = v;
      setDistance(v);
    };

    const onStart = (e) => {
      if (s.current.refreshing) return;
      if (el.scrollTop <= 0) {
        s.current.startY = e.touches[0].clientY;
        s.current.startX = e.touches[0].clientX;
        s.current.pulling = true;
      } else {
        s.current.pulling = false;
      }
    };
    const onMove = (e) => {
      if (!s.current.pulling || s.current.refreshing) return;
      const dy = e.touches[0].clientY - s.current.startY;
      const dx = e.touches[0].clientX - s.current.startX;
      if (Math.abs(dx) > Math.abs(dy)) {
        s.current.pulling = false;
        setDist(0);
        return;
      }
      if (dy <= 0) {
        setDist(0);
        return;
      }
      e.preventDefault();
      setDist(Math.min(MAX, dy * 0.5));
    };
    const onEnd = () => {
      if (!s.current.pulling) return;
      s.current.pulling = false;
      if (s.current.dist >= THRESHOLD) {
        setDist(THRESHOLD);
        setRefreshingBoth(true);
        (async () => {
          try {
            await onRefreshRef.current?.();
          } finally {
            setRefreshingBoth(false);
            setDist(0);
          }
        })();
      } else {
        setDist(0);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{
          height: refreshing ? THRESHOLD : distance,
          transition: s.current.pulling ? "none" : "height .2s ease",
        }}
      >
        <Loader2
          className={"w-5 h-5 text-[#A1846B] " + (refreshing ? "animate-spin" : "")}
          style={{ opacity: Math.min(1, distance / THRESHOLD) }}
          strokeWidth={1.5}
        />
      </div>
      {children}
    </div>
  );
}