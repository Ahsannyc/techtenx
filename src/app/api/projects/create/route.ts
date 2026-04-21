import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, createProject, logAction } from '@/lib/db';

export async function POST(request: Request) {
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

    const body = await request.json();
    const { type, name, description, config } = body;

    // Validation
    if (!type || !['agent', 'automation', 'website'].includes(type)) {
      return Response.json(
        { error: 'Invalid project type' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return Response.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (name.length > 255) {
      return Response.json(
        { error: 'Project name too long (max 255 characters)' },
        { status: 400 }
      );
    }

    // Create project
    const project = await createProject({
      user_id: user.id,
      type: type as 'agent' | 'automation' | 'website',
      name,
      description,
      config: config || {},
    });

    // Log action
    await logAction({
      user_id: user.id,
      action: 'project_created',
      resource_type: 'project',
      resource_id: project.id,
      details: { type, name },
    });

    return Response.json(
      {
        success: true,
        project,
        message: 'Project created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
