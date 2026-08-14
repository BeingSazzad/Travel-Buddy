import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  profileDisplayName,
  profileMainPhoto,
  profileAge,
  profileBiography,
  profileLocationText,
  profileLanguages,
  profileTravelStyles,
  profileInterests,
} from "@/lib/profile-display";
import { FALLBACK_AVATAR_URL } from "@/lib/images";

function ChipRow({ items, onClick }) {
  if (!items?.length) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-wrap justify-center gap-1.5 mt-2"
    >
      {items.slice(0, 8).map((item) => (
        <span
          key={item}
          className="text-xs px-2.5 py-1 rounded-full border border-border capitalize text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </button>
  );
}

export default function ProfileHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const main = profileMainPhoto(user, FALLBACK_AVATAR_URL);
  const name = profileDisplayName(user);
  const age = profileAge(user, { viewerIsOwner: true });
  const isVerified = user?.identity_verified && user?.age_verified;
  const location = profileLocationText(user, { viewerIsOwner: true });
  const bio = profileBiography(user);
  const languages = profileLanguages(user);
  const styles = profileTravelStyles(user);
  const interests = profileInterests(user);

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

      {location ? (
        <button
          type="button"
          onClick={() => navigate("/profile/edit/details")}
          className="text-sm text-muted-foreground mt-1"
        >
          {location}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/profile/edit/details")}
          className="text-sm text-primary mt-1"
        >
          Add city
        </button>
      )}

      {bio ? (
        <button
          type="button"
          onClick={() => navigate("/profile/edit/details")}
          className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-sm"
        >
          {bio}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/profile/edit/details")}
          className="text-sm text-primary mt-3"
        >
          Add a short intro
        </button>
      )}

      {(languages.length || styles.length || interests.length) ? (
        <ChipRow
          items={[...languages, ...styles, ...interests]}
          onClick={() => navigate("/profile/edit/preferences")}
        />
      ) : (
        <button
          type="button"
          onClick={() => navigate("/profile/edit/preferences")}
          className="text-sm text-primary mt-3"
        >
          Add languages & interests
        </button>
      )}
    </div>
  );
}
