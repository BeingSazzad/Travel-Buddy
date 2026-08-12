import React from "react";
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
    <div className="flex flex-wrap justify-center gap-2">
      {styles.map((s) => <Chip key={`s-${s}`}>{s}</Chip>)}
      {interests.map((i) => <Chip key={`i-${i}`}>{i}</Chip>)}
    </div>
  );
}
