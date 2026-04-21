import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getProjectById, createWebsite, logAction } from '@/lib/db';

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
    const { projectId, name, description, templateId } = body;

    if (!projectId) {
      return Response.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.user_id !== user.id) {
      return Response.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    if (project.type !== 'website') {
      return Response.json(
        { error: 'Project is not a website type' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Website name is required' }, { status: 400 });
    }

    const website = await createWebsite({
      project_id: projectId,
      user_id: user.id,
      name,
      description,
      template_id: templateId,
    });

    await logAction({
      user_id: user.id,
      action: 'website_created',
      resource_type: 'website',
      resource_id: website.id,
      details: { name },
    });

    return Response.json({ success: true, website }, { status: 201 });
  } catch (error) {
    console.error('Create website error:', error);
    return Response.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  }
}
