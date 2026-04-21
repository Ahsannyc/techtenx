import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getUserProjects } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    // Get all projects
    let projects = await getUserProjects(user.id);

    // Filter by type
    if (type && ['agent', 'automation', 'website'].includes(type)) {
      projects = projects.filter(p => p.type === type);
    }

    // Filter by status
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      projects = projects.filter(p => p.status === status);
    }

    // Search by name/description
    if (search && search.trim().length > 0) {
      projects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      );
    }

    return Response.json(
      {
        success: true,
        projects,
        count: projects.length,
        filters: { type, status, search }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List projects error:', error);
    return Response.json(
      { error: 'Failed to list projects' },
      { status: 500 }
    );
  }
}
