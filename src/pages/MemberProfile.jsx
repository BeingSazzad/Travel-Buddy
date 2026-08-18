import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MemberProfileContent from "@/components/members/MemberProfileContent";
import { useMemberProfile } from "@/hooks/useMemberProfile";
import { useFriends } from "@/hooks/useFriends";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import { normalizeMemberData } from "@/lib/member-profile";
import { base44 } from "@/api/base44Client";

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useMemberProfile(id);
  const { friends, removeFriend, blockFriend, reload: reloadFriends } = useFriends();
  const { requests, reload: reloadRequests } = useConnectionRequests();
  const friendRecord = friends.find((f) => f.memberId === id);
  const pendingRequest = requests.find((r) => r.user_id === id);
  const isFriend = !!friendRecord;
  const profile = normalizeMemberData(data);

  const handleConnect = async () => {
    try {
      await base44.functions.invoke("record-like", {
        liked_user_id: id,
        action: "like",
      });
    } catch {
      /* demo fallback */
    }
    await reloadFriends();
    await reloadRequests();
  };

  const handleDecline = async () => {
    try {
      await base44.functions.invoke("record-like", {
        liked_user_id: id,
        action: "pass",
      });
    } catch {
      /* demo fallback */
    }
    await reloadRequests();
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center text-sm text-muted-foreground bg-background">
        Loading profile…
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-full min-h-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-background">
        <p className="font-display font-semibold">Profile not found</p>
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-primary underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-background">
      <div className="flex-1 min-h-0 app-scroll">
        <MemberProfileContent
          data={profile}
          memberId={id}
          onBack={() => navigate(-1)}
          isFriend={isFriend}
          pendingRequest={pendingRequest}
          onConnect={handleConnect}
          onDecline={handleDecline}
          friendRecord={friendRecord}
          onRemoveFriend={isFriend ? removeFriend : undefined}
          onBlockMember={blockFriend}
        />
      </div>
    </div>
  );
}
