import { getSession } from '@auth0/nextjs-auth0/edge';
import { getUserByAuth0Id, getWebsiteById, updateWebsite, deleteWebsite, logAction } from '@/lib/db';

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

    const website = await getWebsiteById(params.id);
    if (!website || website.user_id !== user.id) {
      return Response.json(
        { error: 'Website not found or unauthorized' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, website }, { status: 200 });
  } catch (error) {
    console.error('Get website error:', error);
    return Response.json({ error: 'Failed to get website' }, { status: 500 });
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

    const website = await getWebsiteById(params.id);
    if (!website || website.user_id !== user.id) {
      return Response.json(
        { error: 'Website not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, domain, custom_domain, theme, pages } = body;

    const updated = await updateWebsite(params.id, {
      name: name || website.name,
      description: description ?? website.description,
      domain: domain || website.domain,
      custom_domain: custom_domain || website.custom_domain,
      theme: theme || website.theme,
      pages: pages || website.pages,
    });

    await logAction({
      user_id: user.id,
      action: 'website_updated',
      resource_type: 'website',
      resource_id: params.id,
      details: { name },
    });

    return Response.json({ success: true, website: updated }, { status: 200 });
  } catch (error) {
    console.error('Update website error:', error);
    return Response.json({ error: 'Failed to update website' }, { status: 500 });
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

    const website = await getWebsiteById(params.id);
    if (!website || website.user_id !== user.id) {
      return Response.json(
        { error: 'Website not found or unauthorized' },
        { status: 404 }
      );
    }

    await deleteWebsite(params.id);

    await logAction({
      user_id: user.id,
      action: 'website_deleted',
      resource_type: 'website',
      resource_id: params.id,
      details: { name: website.name },
    });

    return Response.json(
      { success: true, message: 'Website deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete website error:', error);
    return Response.json({ error: 'Failed to delete website' }, { status: 500 });
  }
}
