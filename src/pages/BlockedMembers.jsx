import React from "react";
import SettingsPage from "@/components/profile/SettingsPage";
import BlockedMembersPanel from "@/components/profile/BlockedMembersPanel";

export default function BlockedMembers() {
  return (
    <SettingsPage title="Blocked members">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Members you block won&apos;t be able to see or contact you.
      </p>
      <BlockedMembersPanel embedded />
    </SettingsPage>
  );
}
