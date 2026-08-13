import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

/** Lean notification prefs — only categories users understand and control often */
export const NOTIFICATION_CATEGORIES = [
  {
    key: "notif_matches",
    label: "Matches",
    desc: "New connections and women on overlapping trips",
  },
  {
    key: "notif_messages",
    label: "Messages",
    desc: "New chat messages",
  },
  {
    key: "notif_events",
    label: "Events",
    desc: "Invites and reminders for meetups",
  },
  {
    key: "notif_offers",
    label: "Offers & updates",
    desc: "Deals, saved-place tips, and Seluna news",
  },
];

function Toggle({ id, label, desc, checked, onCheck, disabled, locked }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border/40 last:border-0">
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
    <div>
      <Toggle
        id="notif-master"
        label="All notifications"
        desc="Turn everything off except safety alerts"
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
          label="Safety & account"
          desc="Security and account alerts — always on"
          checked={true}
          onCheck={() => {}}
          disabled={true}
          locked
        />
      </div>
      <p className="text-sm text-muted-foreground mt-3 flex items-start gap-1.5 leading-normal">
        <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={1.5} />
        Safety and account-critical notices cannot be turned off.
      </p>
    </div>
  );
}
