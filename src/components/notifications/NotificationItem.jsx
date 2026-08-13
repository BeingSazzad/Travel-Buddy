import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Sparkles, MessageCircle, CalendarPlus, CalendarCheck, BellRing,
  Plane, Tag, Bookmark, ShieldCheck, Users, UserPlus,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const ICONS = {
  new_match: Sparkles,
  match: UserPlus,
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
      } catch {
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
      className={cn(
        "w-full flex items-start gap-3.5 py-4 text-left tap-feedback transition-opacity",
        "border-b border-border/40 last:border-0",
        n.read && "opacity-70"
      )}
    >
      <div className="relative shrink-0 mt-0.5">
        {n.image ? (
          <img src={n.image} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "flex-1 text-sm leading-snug text-foreground",
              n.read ? "font-medium" : "font-semibold"
            )}
          >
            {n.title}
          </p>
          {!n.read && (
            <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
          )}
        </div>
        {n.body && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {n.body}
          </p>
        )}
        <p className="text-xs text-muted-foreground/80 mt-1.5">
          {moment(n.created_date).fromNow()}
        </p>
      </div>
    </button>
  );
}
