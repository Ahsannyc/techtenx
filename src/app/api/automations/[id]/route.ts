import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getAutomationById, updateAutomation, deleteAutomation, logAction } from '@/lib/db';

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

    const automation = await getAutomationById(params.id);
    if (!automation || automation.user_id !== user.id) {
      return Response.json(
        { error: 'Automation not found or unauthorized' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, automation }, { status: 200 });
  } catch (error) {
    console.error('Get automation error:', error);
    return Response.json({ error: 'Failed to get automation' }, { status: 500 });
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

    const automation = await getAutomationById(params.id);
    if (!automation || automation.user_id !== user.id) {
      return Response.json(
        { error: 'Automation not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, trigger, actions, is_active } = body;

    const updated = await updateAutomation(params.id, {
      name: name || automation.name,
      description: description ?? automation.description,
      trigger: trigger || automation.trigger,
      actions: actions || automation.actions,
      is_active: is_active ?? automation.is_active,
    });

    await logAction({
      user_id: user.id,
      action: 'automation_updated',
      resource_type: 'automation',
      resource_id: params.id,
      details: { name },
    });

    return Response.json({ success: true, automation: updated }, { status: 200 });
  } catch (error) {
    console.error('Update automation error:', error);
    return Response.json({ error: 'Failed to update automation' }, { status: 500 });
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

    const automation = await getAutomationById(params.id);
    if (!automation || automation.user_id !== user.id) {
      return Response.json(
        { error: 'Automation not found or unauthorized' },
        { status: 404 }
      );
    }

    await deleteAutomation(params.id);

    await logAction({
      user_id: user.id,
      action: 'automation_deleted',
      resource_type: 'automation',
      resource_id: params.id,
      details: { name: automation.name },
    });

    return Response.json(
      { success: true, message: 'Automation deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete automation error:', error);
    return Response.json({ error: 'Failed to delete automation' }, { status: 500 });
  }
}
