import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  profileDisplayName,
  profileMainPhoto,
  profileAge,
} from "@/lib/profile-display";
import { FALLBACK_AVATAR_URL } from "@/lib/images";

export default function ProfileHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const main = profileMainPhoto(user, FALLBACK_AVATAR_URL);
  const name = profileDisplayName(user);
  const age = profileAge(user, { viewerIsOwner: true });
  const isVerified = user?.identity_verified && user?.age_verified;

  return (
    <div className="flex flex-col items-center text-center">
      <button
        type="button"
        onClick={() => navigate("/profile/edit/photos")}
        className="relative active:scale-95 transition"
        aria-label="Edit photos"
      >
        <img
          src={main}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-premium"
        />
      </button>

      <h2 className="font-display font-bold text-lg mt-3 flex items-center justify-center gap-1.5">
        {name}
        {age !== null && <span className="text-muted-foreground font-normal"> · {age}</span>}
        {isVerified && (
          <BadgeCheck className="w-4 h-4 text-primary" strokeWidth={2} />
        )}
      </h2>
    </div>
  );
}
