import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

function Toggle({ label, desc, checked, onCheck, disabled, locked }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          {label}
          {locked && <Lock className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />}
        </Label>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheck} disabled={disabled} />
    </div>
  );
}

const CATEGORIES = [
  { key: "notif_matches", label: "Matches", desc: "New travel matches and companion suggestions" },
  { key: "notif_messages", label: "Messages", desc: "New chat messages" },
  { key: "notif_events", label: "Events", desc: "Invitations, approvals and event reminders" },
  { key: "notif_trip_suggestions", label: "Trip suggestions", desc: "Trip reminders and companion suggestions for your trips" },
  { key: "notif_destination_activity", label: "Destination activity", desc: "Members travelling to your destinations and destination updates" },
  { key: "notif_deals", label: "Deals", desc: "New exclusive Seluna deals" },
  { key: "notif_recommendations", label: "Recommendations", desc: "Saved place updates and personalized recommendations" },
  { key: "notif_marketing", label: "Marketing messages", desc: "Promotions and updates from Seluna" },
];

export default function NotificationsSheet({ onClose }) {
  const { user, checkUserAuth } = useAuth();
  const [master, setMaster] = useState(user?.allow_notifications !== false);
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(
      CATEGORIES.map((c) => [c.key, user?.[c.key] !== false])
    )
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggle = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await base44.auth.updateMe({
        allow_notifications: master,
        notif_matches: prefs.notif_matches,
        notif_messages: prefs.notif_messages,
        notif_events: prefs.notif_events,
        notif_trip_suggestions: prefs.notif_trip_suggestions,
        notif_destination_activity: prefs.notif_destination_activity,
        notif_deals: prefs.notif_deals,
        notif_recommendations: prefs.notif_recommendations,
        notif_marketing: prefs.notif_marketing,
      });
      await checkUserAuth();
      onClose();
    } catch (e) {
      setError("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSheet title="Notification settings" onClose={onClose}>
      <p className="text-sm text-muted-foreground mb-2">Choose what you want to be notified about.</p>

      <Toggle
        label="All notifications"
        desc="Master switch for in-app notifications"
        checked={master}
        onCheck={setMaster}
      />

      <div className={!master ? "opacity-50 pointer-events-none" : ""}>
        {CATEGORIES.map((c) => (
          <Toggle
            key={c.key}
            label={c.label}
            desc={c.desc}
            checked={prefs[c.key]}
            onCheck={(v) => toggle(c.key, v)}
            disabled={!master}
          />
        ))}
        <Toggle
          label="Safety & account notices"
          desc="Important security and account alerts — always on"
          checked={true}
          onCheck={() => {}}
          disabled={true}
          locked
        />
      </div>

      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
        <Lock className="w-3 h-3" strokeWidth={1.5} /> Safety and account-critical notices cannot be disabled.
      </p>

      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <Button className="w-full h-11 mt-4" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
      </Button>
    </ProfileSheet>
  );
}