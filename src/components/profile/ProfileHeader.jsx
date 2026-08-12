import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Globe, BadgeCheck, Pencil } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  profileDisplayName,
  profileBiography,
  profileLanguages,
  profileMainPhoto,
  profileLocationText,
  profileAge,
} from "@/lib/profile-display";
import { FALLBACK_AVATAR_URL } from "@/lib/images";

export default function ProfileHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const main = profileMainPhoto(user, FALLBACK_AVATAR_URL);
  const name = profileDisplayName(user);
  const age = profileAge(user, { viewerIsOwner: true });
  const location = profileLocationText(user, { viewerIsOwner: true });
  const langs = profileLanguages(user);
  const bio = profileBiography(user);
  const isVerified = user?.identity_verified && user?.age_verified;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <img
          src={main}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-premium"
        />
      </div>

      <h2 className="font-display font-bold text-lg mt-3 flex items-center justify-center gap-1.5">
        {name}
        {age !== null && <span className="text-muted-foreground font-normal"> · {age}</span>}
        {isVerified && (
          <BadgeCheck className="w-4 h-4 text-primary" strokeWidth={2} />
        )}
      </h2>

      {(location || langs.length > 0) && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap justify-center">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              {location}
            </span>
          )}
          {langs.length > 0 && (
            <span className="flex items-center gap-1">
              {location && <span>·</span>}
              <Globe className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              {langs.join(", ")}
            </span>
          )}
        </div>
      )}

      {bio && (
        <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed italic">
          &ldquo;{bio}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile-setup")}
          className="rounded-full h-9 px-4 text-xs font-semibold border-border shadow-soft"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5 text-primary" strokeWidth={1.5} />
          Edit profile
        </Button>
      </div>
    </div>
  );
}
