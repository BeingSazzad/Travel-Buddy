import React from "react";
import { Compass, Globe } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  profileBiography,
  profileLanguages,
  profileTravelStyles,
  profileInterests,
  profileNationality,
} from "@/lib/profile-display";

export default function ProfileAbout({ embedded = false }) {
  const { user } = useAuth();
  const interests = profileInterests(user);
  const styles = profileTravelStyles(user);
  const languages = profileLanguages(user);
  const nationality = profileNationality(user, { viewerIsOwner: true });
  const bio = profileBiography(user);

  const hasChips = interests.length > 0 || styles.length > 0 || languages.length > 0;

  if (!hasChips && !bio && !nationality) {
    return (
      <div className={embedded ? "" : "mt-6"}>
        <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-4 text-center">
          Add interests, travel style, and languages when you edit your profile.
        </p>
      </div>
    );
  }

  const Chip = ({ children }) => (
    <span className="text-xs capitalize px-2.5 py-1 rounded-full bg-primary/10 text-brand-strong">{children}</span>
  );

  return (
    <div className={embedded ? "" : "mt-6"}>
      {!embedded && (
        <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} /> About
        </h3>
      )}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft space-y-4">
        {bio && embedded && (
          <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
        )}

        {nationality && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Nationality</p>
            <p className="text-sm">{nationality}</p>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.5} /> Languages
            </p>
            <div className="flex flex-wrap gap-2">{languages.map((l) => <Chip key={l}>{l}</Chip>)}</div>
          </div>
        )}

        {styles.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Travel style</p>
            <div className="flex flex-wrap gap-2">{styles.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          </div>
        )}

        {interests.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Interests</p>
            <div className="flex flex-wrap gap-2">{interests.map((i) => <Chip key={i}>{i}</Chip>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
