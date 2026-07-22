import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Heart, MessageCircle, CalendarPlus, CalendarCheck, BellRing,
  Plane, Tag, Bookmark, ShieldCheck, Trash2, Users
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const ICONS = {
  new_match: Heart,
  new_message: MessageCircle,
  event_invitation: CalendarPlus,
  event_approval: CalendarCheck,
  event_reminder: BellRing,
  trip_reminder: Plane,
  member_travelling: Users,
  new_deal: Tag,
  saved_place_update: Bookmark,
  admin_message: ShieldCheck,
};

const TYPE_TONE = "text-[#A1846B]";

export default function NotificationItem({ n, onChange }) {
  const navigate = useNavigate();
  const Icon = ICONS[n.type] || BellRing;

  const open = async () => {
    try {
      if (!n.read) await base44.entities.Notification.update(n.id, { read: true });
    } catch (e) {}
    onChange();
    if (n.link) navigate(n.link);
  };

  const remove = async (e) => {
    e.stopPropagation();
    try { await base44.entities.Notification.delete(n.id); } catch (err) {}
    onChange();
  };

  return (
    <div
      onClick={open}
      className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition active:scale-[0.99] cursor-pointer ${n.read ? "bg-card border-border" : "bg-[#A1846B]/5 border-[#A1846B]/25"}`}
    >
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full bg-[#A1846B]/10 flex items-center justify-center">
          {n.image ? (
            <img src={n.image} alt="" className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <Icon className={`w-5 h-5 ${TYPE_TONE}`} strokeWidth={1.5} />
          )}
        </div>
        {!n.read && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#A1846B] ring-2 ring-card" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{n.title}</p>
        {n.body && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>}
        <p className="text-[10px] text-muted-foreground/80 mt-1 uppercase tracking-wide">{moment(n.created_date).fromNow()}</p>
      </div>

      <button onClick={remove} className="shrink-0 p-1.5 -m-1 text-muted-foreground/60 hover:text-destructive transition" aria-label="Delete notification">
        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}