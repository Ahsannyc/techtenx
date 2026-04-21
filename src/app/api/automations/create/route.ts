import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getProjectById, createAutomation, logAction } from '@/lib/db';

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
    const { projectId, name, description, trigger, actions } = body;

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

    if (project.type !== 'automation') {
      return Response.json(
        { error: 'Project is not an automation type' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Automation name is required' }, { status: 400 });
    }

    if (!trigger) {
      return Response.json(
        { error: 'Trigger configuration is required' },
        { status: 400 }
      );
    }

    if (!actions || actions.length === 0) {
      return Response.json(
        { error: 'At least one action is required' },
        { status: 400 }
      );
    }

    const automation = await createAutomation({
      project_id: projectId,
      user_id: user.id,
      name,
      description,
      trigger,
      actions,
      is_active: false,
    });

    await logAction({
      user_id: user.id,
      action: 'automation_created',
      resource_type: 'automation',
      resource_id: automation.id,
      details: { name },
    });

    return Response.json({ success: true, automation }, { status: 201 });
  } catch (error) {
    console.error('Create automation error:', error);
    return Response.json(
      { error: 'Failed to create automation' },
      { status: 500 }
    );
  }
}
