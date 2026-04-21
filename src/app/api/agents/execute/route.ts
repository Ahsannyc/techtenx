import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getProjectById } from '@/lib/db';
import { executeAgent } from '@/lib/agents';

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
    const { projectId, message, conversationHistory } = body;

    if (!projectId || projectId.trim().length === 0) {
      return Response.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await getProjectById(projectId);
    if (!project || project.user_id !== user.id) {
      return Response.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    if (project.type !== 'agent') {
      return Response.json(
        { error: 'Project is not an agent' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await executeAgent(
      projectId,
      user.id,
      message,
      conversationHistory || []
    );

    return Response.json(
      { success: true, result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Agent execution API error:', error);
    return Response.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}
