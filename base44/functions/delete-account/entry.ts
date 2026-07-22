import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const uid = user.id;
    const sr = base44.asServiceRole;

    // Wipe the member's data across the app
    await sr.entities.Trip.deleteMany({ created_by_id: uid });
    await sr.entities.Like.deleteMany({ created_by_id: uid });
    await sr.entities.BlockedMember.deleteMany({ created_by_id: uid });
    await sr.entities.SavedItem.deleteMany({ created_by_id: uid });
    await sr.entities.Review.deleteMany({ created_by_id: uid });
    await sr.entities.ReviewVote.deleteMany({ created_by_id: uid });
    await sr.entities.ReviewReport.deleteMany({ created_by_id: uid });
    await sr.entities.DealRedemption.deleteMany({ created_by_id: uid });
    await sr.entities.EventAttendance.deleteMany({ user_id: uid });
    await sr.entities.Event.deleteMany({ host_id: uid });
    await sr.entities.Event.deleteMany({ created_by_id: uid });
    await sr.entities.Match.deleteMany({ created_by_id: uid });
    await sr.entities.Match.deleteMany({ match_user_id: uid });
    await sr.entities.Message.deleteMany({ participant_ids: uid });
    await sr.entities.Conversation.deleteMany({ participant_ids: uid });

    // Clear profile and flag the account for removal
    await base44.auth.updateMe({
      profile_completed: false,
      profile_name: '',
      date_of_birth: '',
      current_city: '',
      country: '',
      nationality: '',
      languages_spoken: [],
      biography: '',
      travel_style: [],
      interests: [],
      profile_photos: [],
      main_photo: null,
      account_deletion_requested: true,
    });

    // Best-effort removal of the account record itself
    try {
      await sr.entities.User.delete(uid);
    } catch (e) {
      console.error('delete-account: user record removal failed:', e.message);
    }

    return Response.json({ deleted: true });
  } catch (error) {
    console.error('delete-account error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});