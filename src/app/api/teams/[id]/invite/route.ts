import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getTeamById, inviteTeamMember, logAction } from '@/lib/db';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const team = await getTeamById(params.id);
    if (!team || team.user_id !== user.id) {
      return Response.json(
        { error: 'Team not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!['owner', 'editor', 'viewer'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await inviteTeamMember({
      team_id: params.id,
      email,
      role,
      token,
      expires_at: expiresAt.toISOString(),
      created_by: user.id,
    });

    await logAction({
      user_id: user.id,
      action: 'team_member_invited',
      resource_type: 'team',
      resource_id: params.id,
      details: { email, role },
    });

    return Response.json({ success: true, invitation }, { status: 201 });
  } catch (error) {
    console.error('Invite team member error:', error);
    return Response.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}
