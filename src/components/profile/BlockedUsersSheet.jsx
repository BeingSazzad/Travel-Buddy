import React from "react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import BlockedMembersPanel from "@/components/profile/BlockedMembersPanel";

export default function BlockedUsersSheet({ onClose }) {
  return (
    <ProfileSheet title="Blocked users" onClose={onClose}>
      <BlockedMembersPanel embedded />
    </ProfileSheet>
  );
}
