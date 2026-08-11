import { ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import ScreenHeader from '@/components/common/ScreenHeader';
import EmptyState from '@/components/common/EmptyState';
import { ConnectIconButton } from '@/components/common/ConnectIconButton';
import { useFriends } from '@/hooks/useFriends';
import { useConnectionRequests } from '@/hooks/useConnectionRequests';
import ConnectionRequestsPrompt from '@/components/friends/ConnectionRequestsPrompt';
import { getDiscoverDeckMembers } from '@/lib/member-profile';
import { base44 } from '@/api/base44Client';

function SuggestedRow({ member, onConnect, connecting, requested, onViewProfile }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onViewProfile(member.memberId)}
        className="flex flex-1 min-w-0 items-center gap-3 text-left active:bg-muted/40 rounded-2xl py-1 pr-1 transition"
      >
        <img
          src={member.img}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{member.name}</p>
          <p className="text-xs text-muted-foreground truncate">{member.loc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" strokeWidth={1.5} aria-hidden />
      </button>
      <ConnectIconButton
        loading={connecting}
        pending={requested}
        onClick={() => onConnect(member.memberId)}
        aria-label={
          requested ? `Request sent to ${member.name}` : `Connect with ${member.name}`
        }
      />
    </div>
  );
}

export default function Friends() {
  const navigate = useNavigate();
  const { friends, loading, reload: reloadFriends } = useFriends();
  const { requests } = useConnectionRequests();
  const [connectingId, setConnectingId] = useState(null);
  const [requestedIds, setRequestedIds] = useState(() => new Set());

  const friendIds = useMemo(() => new Set(friends.map((f) => f.memberId)), [friends]);

  const suggestions = useMemo(
    () =>
      getDiscoverDeckMembers()
        .filter((m) => !friendIds.has(m.user_id))
        .slice(0, 4)
        .map((m) => ({
          memberId: m.user_id,
          name: m.name,
          loc: `${m.current_city}, ${m.country}`,
          img: m.avatar,
        })),
    [friendIds]
  );

  const handleConnect = async (memberId) => {
    setConnectingId(memberId);
    try {
      await base44.functions.invoke('record-like', {
        liked_user_id: memberId,
        action: 'like',
      });
    } catch {
      /* demo fallback */
    }
    setRequestedIds((prev) => new Set(prev).add(memberId));
    await reloadFriends();
    setConnectingId(null);
  };

  return (
    <div className="page-shell">
      <ScreenHeader
        title="Friends"
        subtitle="Women you've connected with"
        extraActions={
          <Link to="/discover" className="text-sm font-medium text-primary shrink-0">
            Match
          </Link>
        }
      />

      <ConnectionRequestsPrompt count={requests.length} className="mb-5" />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading friends…
        </div>
      ) : friends.length === 0 ? (
        <EmptyState
          title="No friends yet"
          description="Match with women on Discover to build your travel circle."
          actionLabel="Go to Match"
          onAction={() => navigate('/discover')}
        />
      ) : (
        <div className="space-y-1">
          {friends.map((f) => (
            <button
              key={f.memberId}
              type="button"
              onClick={() => navigate(`/members/${f.memberId}`)}
              className="w-full flex items-center gap-3 py-3 rounded-2xl text-left active:bg-muted/40 transition"
            >
              <img
                src={f.avatar}
                alt={f.name}
                className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-muted-foreground truncate">{f.loc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" strokeWidth={1.5} aria-hidden />
            </button>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <>
          <h2 className="section-header mt-7 mb-2">Suggested for you</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Use the connect button, or tap a row to view their profile
          </p>
          <div className="space-y-1">
            {suggestions.map((member) => (
              <SuggestedRow
                key={member.memberId}
                member={member}
                connecting={connectingId === member.memberId}
                requested={requestedIds.has(member.memberId)}
                onConnect={handleConnect}
                onViewProfile={(id) => navigate(`/members/${id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
