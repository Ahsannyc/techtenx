# Step 33: Project Management API

## Detailed Implementation Prompt

**Goal:** Build complete CRUD API endpoints for managing AI agent projects, automations, and websites

**Effort:** 3-4 days
**Priority:** HIGH
**Success Criteria:**
- ✅ Create project endpoint (POST /api/projects)
- ✅ List projects endpoint (GET /api/projects)
- ✅ Get project detail endpoint (GET /api/projects/:id)
- ✅ Update project endpoint (PUT /api/projects/:id)
- ✅ Delete project endpoint (DELETE /api/projects/:id)
- ✅ Filter & sort projects
- ✅ Project sharing with teams
- ✅ Comprehensive error handling
- ✅ Full test coverage

---

## Implementation Phase-by-Phase

### Phase 1: Create Project Endpoint (1 hour)

Create `src/app/api/projects/create/route.ts`:

```typescript
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

    if (!name || name.length === 0) {
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
```

### Phase 2: List Projects Endpoint (1 hour)

Create `src/app/api/projects/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
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
    const type = url.searchParams.get('type'); // 'agent', 'automation', 'website'
    const status = url.searchParams.get('status'); // 'draft', 'published', 'archived'
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
    if (search) {
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
```

### Phase 3: Get Project Detail Endpoint (1 hour)

Create `src/app/api/projects/[id]/route.ts`:

```typescript
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
      details: { name, description, status },
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
```

### Phase 4: Update Dashboard to Use API (1-2 hours)

Update `src/app/dashboard/projects/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  type: 'agent' | 'automation' | 'website';
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function ProjectsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: 'agent',
    name: '',
    description: '',
  });

  // Load projects on mount
  useEffect(() => {
    if (!isLoading && user) {
      loadProjects();
    }
  }, [isLoading, user]);

  const loadProjects = async () => {
    try {
      const url = new URL('/api/projects', window.location.origin);
      if (typeFilter) {
        url.searchParams.set('type', typeFilter);
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (data.success) {
        setProjects([data.project, ...projects]);
        setShowCreateModal(false);
        setCreateForm({ type: 'agent', name: '', description: '' });
      } else {
        alert('Error creating project: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/dashboard/projects" className="text-blue-400">Projects</Link>
            <Link href="/account/settings" className="hover:text-blue-400">Settings</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">Logout</a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
              <p className="text-gray-400">Manage your AI agents, automations, and websites</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
            >
              + New Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8">
            {[
              { label: 'All', value: null },
              { label: 'AI Agents', value: 'agent' },
              { label: 'Automations', value: 'automation' },
              { label: 'Websites', value: 'website' },
            ].map((filter) => (
              <button
                key={filter.value || 'all'}
                onClick={() => {
                  setTypeFilter(filter.value);
                  setLoading(true);
                }}
                className={`px-4 py-2 rounded-full border transition-all text-sm ${
                  typeFilter === filter.value
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-white/10 hover:bg-white/5'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
              <p className="text-gray-400 mb-6">Create your first project to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
                >
                  <div className="mb-3">
                    <span className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <select
                  value={createForm.type}
                  onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="agent">AI Agent</option>
                  <option value="automation">Automation</option>
                  <option value="website">Website</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="My Awesome Project"
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="What does this project do?"
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
```

### Phase 5: Add Database Functions for Projects (30 mins)

Add to `src/lib/db.ts` (already included in Step 31):

```typescript
// Already exported:
export async function createProject(data: {...})
export async function getUserProjects(userId: string)
export async function getProjectById(projectId: string)
export async function updateProject(projectId: string, updates: {...})
```

---

## Testing Checklist

- [ ] POST /api/projects/create creates new project
- [ ] GET /api/projects lists all user projects
- [ ] GET /api/projects?type=agent filters by type
- [ ] GET /api/projects?search=keyword searches projects
- [ ] GET /api/projects/:id returns project details
- [ ] PUT /api/projects/:id updates project
- [ ] DELETE /api/projects/:id archives project
- [ ] Cannot access other users' projects
- [ ] Projects page loads and displays data
- [ ] Create project modal works
- [ ] Filtering works on frontend

---

## API Examples

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "agent",
    "name": "Email Classifier",
    "description": "AI agent to classify incoming emails"
  }'
```

### List Projects
```bash
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/projects?type=agent
curl http://localhost:3000/api/projects?search=email
```

### Get Project
```bash
curl http://localhost:3000/api/projects/project-id-here
```

### Update Project
```bash
curl -X PUT http://localhost:3000/api/projects/project-id-here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "status": "published"
  }'
```

### Delete (Archive) Project
```bash
curl -X DELETE http://localhost:3000/api/projects/project-id-here
```

---

**Estimated Completion Time:** 3-4 days
**Difficulty:** Medium
**Next Step:** Step 34 - AI Agent Execution Engine
