import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, createTeam, logAction } from '@/lib/db';

export async function POST(request: Request) {
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
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Team name is required' }, { status: 400 });
    }

    const team = await createTeam({
      user_id: user.id,
      name,
      description,
    });

    await logAction({
      user_id: user.id,
      action: 'team_created',
      resource_type: 'team',
      resource_id: team.id,
      details: { name },
    });

    return Response.json({ success: true, team }, { status: 201 });
  } catch (error) {
    console.error('Create team error:', error);
    return Response.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
