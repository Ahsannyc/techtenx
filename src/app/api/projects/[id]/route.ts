import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getProjectById, updateProject, logAction } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const project = await getProjectById(params.id);

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (project.user_id !== user.id) {
      return Response.json(
        { error: 'Forbidden - not your project' },
        { status: 403 }
      );
    }

    return Response.json(
      { success: true, project },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get project error:', error);
    return Response.json(
      { error: 'Failed to get project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const project = await getProjectById(params.id);

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (project.user_id !== user.id) {
      return Response.json(
        { error: 'Forbidden - not your project' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, config, status } = body;

    // Validation
    if (name && name.length > 255) {
      return Response.json(
        { error: 'Project name too long' },
        { status: 400 }
      );
    }

    if (status && !['draft', 'published', 'archived'].includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update project
    const updated = await updateProject(params.id, {
      name: name || project.name,
      description: description ?? project.description,
      config: config || project.config,
      status: status || project.status,
    });

    // Log action
    await logAction({
      user_id: user.id,
      action: 'project_updated',
      resource_type: 'project',
      resource_id: params.id,
      details: { name, status },
    });

    return Response.json(
      { success: true, project: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update project error:', error);
    return Response.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const project = await getProjectById(params.id);

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (project.user_id !== user.id) {
      return Response.json(
        { error: 'Forbidden - not your project' },
        { status: 403 }
      );
    }

    // Mark as archived instead of true delete (soft delete)
    await updateProject(params.id, { status: 'archived' });

    // Log action
    await logAction({
      user_id: user.id,
      action: 'project_archived',
      resource_type: 'project',
      resource_id: params.id,
      details: { name: project.name },
    });

    return Response.json(
      { success: true, message: 'Project archived' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete project error:', error);
    return Response.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
