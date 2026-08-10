import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Globe, Camera, BadgeCheck, Pencil } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();
  const photos = user?.profile_photos || [];
  const main = user?.main_photo || photos[0] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80";
  const name = user?.profile_name || user?.full_name || user?.first_name || "Seluna member";
  const age = user?.show_age !== false ? getAge(user?.date_of_birth) : null;
  const langs = user?.languages_spoken || [];
  const isVerified = user?.identity_verified && user?.age_verified;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar with Camera trigger */}
      <div className="relative">
        <img
          src={main}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-premium"
        />
        <button
          onClick={() => navigate("/profile-setup")}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border shadow-soft flex items-center justify-center active:scale-95 transition"
          aria-label="Change photo"
        >
          <Camera className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>

      {/* Name + Age + Verified */}
      <h2 className="font-display font-bold text-lg mt-3 flex items-center justify-center gap-1.5">
        {name}
        {age !== null && <span className="text-muted-foreground font-normal"> · {age}</span>}
        {isVerified && (
          <BadgeCheck className="w-4.5 h-4.5 text-[#A1846B]" strokeWidth={2} />
        )}
      </h2>

      {/* Location & Languages */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap justify-center">
        {user?.current_city && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.5} />
            {user.current_city}{user?.country ? `, ${user.country}` : ""}
          </span>
        )}
        {langs.length > 0 && (
          <span className="flex items-center gap-1">
            · <Globe className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.5} />
            {langs.join(", ")}
          </span>
        )}
      </div>

      {/* Bio */}
      {user?.biography && (
        <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed italic">
          "{user.biography}"
        </p>
      )}

      {/* Compact Status Badges & Edit Button */}
      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile-setup")}
          className="rounded-full h-9 px-4 text-xs font-semibold border-border shadow-soft"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5 text-[#A1846B]" strokeWidth={1.5} />
          Edit profile
        </Button>
      </div>
    </div>
  );
}