import React from "react";
import { MapPin, Globe, Camera, BadgeCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function getAge(dob) {
  if (!dob) return null;
  const t = new Date();
  const b = new Date(dob);
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export default function ProfileHeader() {
  const { user } = useAuth();
  const photos = user?.profile_photos || [];
  const main = user?.main_photo || photos[0] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80";
  const name = user?.profile_name || user?.full_name || "Seluna member";
  const age = user?.show_age ? getAge(user?.date_of_birth) : null;
  const langs = user?.languages_spoken || [];

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <img src={main} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-premium" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center">
          <Camera className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="font-display font-semibold text-xl mt-3 flex items-center justify-center gap-1.5">
        {name}{age !== null && <span className="text-muted-foreground font-normal"> · {age}</span>}
        {user?.identity_verified && user?.age_verified && (
          <BadgeCheck className="w-4 h-4 text-[#A1846B]" strokeWidth={2} />
        )}
      </h2>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 flex-wrap justify-center">
        {user?.current_city && <><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {user.current_city}</>}
        {user?.country && <span>· {user.country}</span>}
      </div>
      {langs.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5 flex-wrap justify-center">
          <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
          {langs.join(" · ")}
        </div>
      )}
      {user?.biography && <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">{user.biography}</p>}
    </div>
  );
}