import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Sparkles, MessageCircle, CalendarPlus, CalendarCheck, BellRing,
  Plane, Tag, Bookmark, ShieldCheck, Users, Heart,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const ICONS = {
  new_match: Sparkles,
  match: Heart,
  new_message: MessageCircle,
  message: MessageCircle,
  event_invitation: CalendarPlus,
  event: CalendarPlus,
  event_approval: CalendarCheck,
  event_reminder: BellRing,
  trip_reminder: Plane,
  member_travelling: Users,
  new_deal: Tag,
  saved_place_update: Bookmark,
  admin_message: ShieldCheck,
};

export default function NotificationItem({ n, onMarkRead }) {
  const navigate = useNavigate();
  const Icon = ICONS[n.type] || BellRing;
  const target = n.link || n.action_url;

  const open = async () => {
    if (!n.read) {
      try {
        await base44.entities.Notification.update(n.id, { read: true });
      } catch (e) {
        /* mock / offline */
      }
      onMarkRead?.(n.id);
    }
    if (target) navigate(target);
  };

  return (
    <button
      type="button"
      onClick={open}
      className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left active:scale-[0.99] transition-transform ${
        n.read ? "bg-card border-border/80" : "bg-card border-[#A1846B]/30"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#A1846B]/10 flex items-center justify-center">
          {n.image ? (
            <img src={n.image} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <Icon className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} />
          )}
        </div>
        {!n.read && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#A1846B] ring-2 ring-card" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${n.read ? "font-medium" : "font-semibold"}`}>{n.title}</p>
        {n.body && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">{moment(n.created_date).fromNow()}</p>
      </div>
    </button>
  );
}
