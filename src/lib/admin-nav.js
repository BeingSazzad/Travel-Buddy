import {
  LayoutDashboard, Users, CreditCard, Flag, CalendarHeart, MapPin, Coffee,
  UtensilsCrossed, BedDouble, Star, Tag, Handshake, Bell, FolderTree, Sparkles, Lightbulb, ShieldCheck,
} from "lucide-react";

export const ADMIN_NAV = [
  { path: "/admin", label: "Overview", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { path: "/admin/reports", label: "Reports", icon: Flag },
  { path: "/admin/events", label: "Events", icon: CalendarHeart },
  { path: "/admin/destinations", label: "Destinations", icon: MapPin },
  { path: "/admin/cafes", label: "Cafés", icon: Coffee },
  { path: "/admin/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { path: "/admin/hotels", label: "Hotels", icon: BedDouble },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/deals", label: "Deals", icon: Tag },
  { path: "/admin/partners", label: "Partners", icon: Handshake },
  { path: "/admin/featured", label: "Featured", icon: Sparkles },
  { path: "/admin/travel-tips", label: "Travel tips", icon: Lightbulb },
  { path: "/admin/safety-tips", label: "Safety tips", icon: ShieldCheck },
  { path: "/admin/notifications", label: "Notifications", icon: Bell },
  { path: "/admin/content", label: "Content", icon: FolderTree },
];