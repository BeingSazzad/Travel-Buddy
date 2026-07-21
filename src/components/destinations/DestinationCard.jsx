import React from "react";
import { MapPin, Users, Coffee, UtensilsCrossed, Building2, CalendarHeart, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";

function Stat({ icon: Icon, value }) {
  return (
    <span className="flex items-center gap-1 text-white/90">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span className="text-xs font-medium">{value}</span>
    </span>
  );
}

export default function DestinationCard({ destination, large = false }) {
  const { city, country, image, description, stats } = destination;
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-border shadow-soft bg-card ${large ? "h-72" : "h-64"}`}>
      <Image src={image} alt={city} fittingType="fill" className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{city}, {country}</span>
        </div>
        <h3 className={`font-display font-semibold text-white ${large ? "text-2xl" : "text-xl"}`}>{city}</h3>
        <p className="text-xs text-white/80 mt-1 line-clamp-2 max-w-[90%]">{description}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
          <Stat icon={Users} value={stats.members} />
          <Stat icon={Coffee} value={stats.cafes} />
          <Stat icon={UtensilsCrossed} value={stats.restaurants} />
          <Stat icon={Building2} value={stats.hotels} />
          <Stat icon={CalendarHeart} value={stats.events} />
          <Stat icon={Tag} value={stats.deals} />
        </div>
      </div>
    </div>
  );
}