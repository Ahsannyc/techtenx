import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getProjectWebsites } from '@/lib/db';

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

    const websites = await getProjectWebsites(projectId);

    return Response.json(
      {
        success: true,
        websites,
        count: websites.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List websites error:', error);
    return Response.json(
      { error: 'Failed to list websites' },
      { status: 500 }
    );
  }
}
