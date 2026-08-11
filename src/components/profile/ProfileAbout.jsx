import React from "react";
import { Compass } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { profileTravelStyles, profileInterests } from "@/lib/profile-display";

export default function ProfileAbout() {
  const { user } = useAuth();
  const interests = profileInterests(user);
  const styles = profileTravelStyles(user);

  if (interests.length === 0 && styles.length === 0) return null;

  const Chip = ({ children }) => (
    <span className="text-xs capitalize px-2.5 py-1 rounded-full bg-primary/10 text-brand-strong">
      {children}
    </span>
  );

  return (
    <div>
      <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-1.5">
        <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} /> About
      </h3>
      {styles.length > 0 && (
        <div className="mb-3">
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
  );
}
