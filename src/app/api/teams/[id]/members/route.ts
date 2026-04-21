import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getTeamMembers, updateTeamMember, removeTeamMember, logAction } from '@/lib/db';

export async function GET(
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

    const members = await getTeamMembers(params.id);
    return Response.json({ success: true, members }, { status: 200 });
  } catch (error) {
    console.error('Get team members error:', error);
    return Response.json({ error: 'Failed to get team members' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const { memberId, role } = body;

    if (!['owner', 'editor', 'viewer'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await updateTeamMember(memberId, { role });

    await logAction({
      user_id: user.id,
      action: 'team_member_role_updated',
      resource_type: 'team',
      resource_id: params.id,
      details: { memberId, role },
    });

    return Response.json({ success: true, member: updated }, { status: 200 });
  } catch (error) {
    console.error('Update team member error:', error);
    return Response.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(
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

    const body = await request.json();
    const { memberId } = body;

    await removeTeamMember(memberId);

    await logAction({
      user_id: user.id,
      action: 'team_member_removed',
      resource_type: 'team',
      resource_id: params.id,
      details: { memberId },
    });

    return Response.json(
      { success: true, message: 'Team member removed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove team member error:', error);
    return Response.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
