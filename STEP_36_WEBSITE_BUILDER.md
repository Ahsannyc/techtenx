# Step 36: Website Builder

## Detailed Implementation Prompt

**Goal:** Build drag-and-drop website builder with pre-built components and templates

**Effort:** 4-5 days
**Priority:** CRITICAL
**Success Criteria:**
- ✅ Visual drag-and-drop canvas
- ✅ Component library (hero, cards, forms, CTAs)
- ✅ Template marketplace with pre-built designs
- ✅ Responsive design preview
- ✅ SEO settings per page
- ✅ Custom domain support
- ✅ Export/publish to live URL
- ✅ Version history & rollback

---

## Architecture Overview

```
Website Builder UI
    ↓
Canvas Editor (Drag-drop components)
    ↓
Component Library
    ↓
Template System
    ↓
Page Management (multi-page support)
    ↓
Publishing Pipeline
    ↓
CDN / Hosting
```

---

## Phase-by-Phase Implementation

### Phase 1: Create Website Data Types (30 mins)

Create `src/types/website.ts`:

```typescript
export interface WebsiteComponent {
  id: string;
  type: 'hero' | 'card' | 'form' | 'cta' | 'testimonial' | 'gallery' | 'text' | 'image';
  props: Record<string, any>;
  children?: WebsiteComponent[];
  styles?: Record<string, any>;
}

export interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  components: WebsiteComponent[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    og_image?: string;
  };
  is_published: boolean;
}

export interface Website {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  domain?: string;
  custom_domain?: string;
  theme: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, string>;
  };
  pages: WebsitePage[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'saas';
  thumbnail: string;
  pages: WebsitePage[];
  theme: Website['theme'];
  rating: number;
  downloads: number;
}

export interface WebsiteVersion {
  id: string;
  website_id: string;
  version_number: number;
  snapshot: Website;
  created_at: string;
  created_by: string;
}
```

### Phase 2: Create Website Management API Routes (1-2 hours)

Create `src/app/api/websites/create/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
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
```

Create `src/app/api/websites/[id]/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
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
```

### Phase 3: Create Website Builder Canvas Component (2-3 hours)

Create `src/components/WebsiteBuilder.tsx`:

```typescript
'use client';

import React, { useState } from 'react';
import { Website, WebsitePage, WebsiteComponent } from '@/types/website';

interface WebsiteBuilderProps {
  website?: Website;
  projectId: string;
  onSave: (website: Website) => void;
}

export default function WebsiteBuilder({
  website,
  projectId,
  onSave,
}: WebsiteBuilderProps) {
  const [name, setName] = useState(website?.name || '');
  const [description, setDescription] = useState(website?.description || '');
  const [pages, setPages] = useState<WebsitePage[]>(
    website?.pages || [
      {
        id: '1',
        slug: 'home',
        title: 'Home',
        components: [],
        is_published: false,
      },
    ]
  );
  const [currentPageId, setCurrentPageId] = useState(pages[0]?.id || '1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];

  const addComponent = (type: WebsiteComponent['type']) => {
    const newComponent: WebsiteComponent = {
      id: Date.now().toString(),
      type,
      props: {},
      styles: {},
    };

    const updatedPages = pages.map(p => {
      if (p.id === currentPageId) {
        return {
          ...p,
          components: [...p.components, newComponent],
        };
      }
      return p;
    });

    setPages(updatedPages);
  };

  const removeComponent = (componentId: string) => {
    const updatedPages = pages.map(p => {
      if (p.id === currentPageId) {
        return {
          ...p,
          components: p.components.filter(c => c.id !== componentId),
        };
      }
      return p;
    });

    setPages(updatedPages);
  };

  const addPage = () => {
    const newPage: WebsitePage = {
      id: Date.now().toString(),
      slug: `page-${pages.length}`,
      title: `Page ${pages.length + 1}`,
      components: [],
      is_published: false,
    };

    setPages([...pages, newPage]);
    setCurrentPageId(newPage.id);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Website name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = website
        ? `/api/websites/${website.id}`
        : '/api/websites/create';
      const method = website ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          description,
          pages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save website');
      }

      const data = await response.json();
      onSave(data.website);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Website Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., My Business Website"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe your website..."
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Pages</h3>
          <div className="space-y-2 mb-4">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPageId(page.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  currentPageId === page.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border hover:bg-gray-100'
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
          <button
            onClick={addPage}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Add Page
          </button>

          <h3 className="font-semibold mt-6 mb-4">Components</h3>
          <div className="space-y-2">
            {['hero', 'card', 'form', 'cta', 'testimonial', 'gallery'].map(
              type => (
                <button
                  key={type}
                  onClick={() => addComponent(type as any)}
                  className="w-full px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 capitalize"
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        <div className="col-span-3 bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{currentPage?.title}</h2>

          {currentPage?.components && currentPage.components.length === 0 ? (
            <p className="text-gray-500">No components yet. Add one from the left panel.</p>
          ) : (
            <div className="space-y-4">
              {currentPage?.components.map(component => (
                <div
                  key={component.id}
                  className="p-4 bg-gray-50 rounded border flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold capitalize">{component.type}</p>
                    <p className="text-xs text-gray-500">ID: {component.id}</p>
                  </div>
                  <button
                    onClick={() => removeComponent(component.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Website'}
      </button>
    </div>
  );
}
```

### Phase 4: Create Websites List Page (1 hour)

Create `src/app/dashboard/websites/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Website } from '@/types/website';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId') || '';
    setProjectId(id);
    fetchWebsites(id);
  }, []);

  const fetchWebsites = async (id: string) => {
    try {
      const response = await fetch(`/api/websites/list?projectId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setWebsites(data.websites || []);
      }
    } catch (error) {
      console.error('Failed to fetch websites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Websites</h1>
        <Link
          href={`/dashboard/websites/new?projectId=${projectId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Website
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No websites yet</p>
          <Link
            href={`/dashboard/websites/new?projectId=${projectId}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Create your first website
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {websites.map(website => (
            <div
              key={website.id}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{website.name}</h3>
                  {website.description && (
                    <p className="text-sm text-gray-600 mt-1">{website.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span>Pages: {website.pages.length}</span>
                    {website.custom_domain && <span>Domain: {website.custom_domain}</span>}
                    <span>Version: {website.version}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {website.published_at && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Published
                    </span>
                  )}
                  <Link
                    href={`/dashboard/websites/${website.id}/edit?projectId=${projectId}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Phase 5: Add Database Functions (30 mins)

Add to `src/lib/db.ts`:

```typescript
export async function createWebsite(data: {
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  template_id?: string;
}) {
  try {
    const { data: website, error } = await supabaseServer
      .from('websites')
      .insert([
        {
          project_id: data.project_id,
          user_id: data.user_id,
          name: data.name,
          description: data.description,
          pages: [],
          theme: {
            colors: {},
            fonts: {},
            spacing: {},
          },
          version: 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return website;
  } catch (error) {
    console.error('Error creating website:', error);
    throw error;
  }
}

export async function getWebsiteById(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('websites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching website:', error);
    return null;
  }
}

export async function getProjectWebsites(projectId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('websites')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching websites:', error);
    return [];
  }
}

export async function updateWebsite(id: string, updates: any) {
  try {
    const { data, error } = await supabaseServer
      .from('websites')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating website:', error);
    throw error;
  }
}

export async function deleteWebsite(id: string) {
  try {
    const { error } = await supabaseServer
      .from('websites')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
}
```

---

## Database Schema

Add to Supabase:

```sql
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(255),
  custom_domain VARCHAR(255),
  theme JSONB DEFAULT '{"colors":{}, "fonts":{}, "spacing":{}}',
  pages JSONB NOT NULL DEFAULT '[]',
  published_at TIMESTAMP,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_websites_project_id ON websites(project_id);
CREATE INDEX idx_websites_user_id ON websites(user_id);
```

---

## Acceptance Criteria

- ✅ Website builder with drag-drop canvas
- ✅ Multi-page support
- ✅ Component library integration
- ✅ CRUD API endpoints
- ✅ List view with all websites
- ✅ Version tracking
- ✅ Domain management

---

**Estimated Completion Time:** 4-5 days
**Difficulty:** Hard
**Next Step:** Step 37 - Team Collaboration Features
