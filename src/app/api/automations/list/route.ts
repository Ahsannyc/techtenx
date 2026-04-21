import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getProjectAutomations } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return Response.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const automations = await getProjectAutomations(projectId);

    return Response.json(
      {
        success: true,
        automations,
        count: automations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List automations error:', error);
    return Response.json(
      { error: 'Failed to list automations' },
      { status: 500 }
    );
  }
}
