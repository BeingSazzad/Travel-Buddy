import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export const NOTIFICATION_CATEGORIES = [
  { key: "notif_matches", label: "Matches", desc: "New travel matches and companion suggestions" },
  { key: "notif_messages", label: "Messages", desc: "New chat messages" },
  { key: "notif_events", label: "Events", desc: "Invitations, approvals and event reminders" },
  { key: "notif_trip_suggestions", label: "Trip suggestions", desc: "Trip reminders and companion suggestions" },
  { key: "notif_destination_activity", label: "Destination activity", desc: "Members travelling to your destinations" },
  { key: "notif_deals", label: "Deals", desc: "New exclusive Seluna deals" },
  { key: "notif_recommendations", label: "Recommendations", desc: "Saved place updates and recommendations" },
  { key: "notif_marketing", label: "Marketing messages", desc: "Promotions and updates from Seluna" },
];

function Toggle({ id, label, desc, checked, onCheck, disabled, locked }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <div className="flex-1 min-w-0">
        <Label htmlFor={id} className="text-sm font-medium flex items-center gap-1.5">
          {label}
          {locked && <Lock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </Label>
        {desc && <p className="text-sm text-muted-foreground mt-0.5 leading-normal">{desc}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheck} disabled={disabled} />
    </div>
  );
}

export default function NotificationSettingsPanel({
  master,
  onMasterChange,
  prefs,
  onPrefChange,
}) {
  return (
    <div className="space-y-1">
      <Toggle
        id="notif-master"
        label="All notifications"
        desc="Master switch for in-app notifications"
        checked={master}
        onCheck={onMasterChange}
      />
      <div className={!master ? "opacity-50 pointer-events-none" : ""}>
        {NOTIFICATION_CATEGORIES.map((c) => (
          <Toggle
            key={c.key}
            id={c.key}
            label={c.label}
            desc={c.desc}
            checked={prefs[c.key]}
            onCheck={(v) => onPrefChange(c.key, v)}
            disabled={!master}
          />
        ))}
        <Toggle
          id="notif-safety"
          label="Safety & account notices"
          desc="Important security and account alerts — always on"
          checked={true}
          onCheck={() => {}}
          disabled={true}
          locked
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5 leading-normal">
        <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} />
        Safety and account-critical notices cannot be disabled.
      </p>
    </div>
  );
}
