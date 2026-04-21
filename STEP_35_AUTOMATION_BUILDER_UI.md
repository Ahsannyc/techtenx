# Step 35: Automation Builder UI

## Detailed Implementation Prompt

**Goal:** Build frontend UI for creating and managing automation workflows with visual builder interface

**Effort:** 3-4 days
**Priority:** CRITICAL
**Success Criteria:**
- ✅ Visual workflow builder canvas
- ✅ Trigger/action blocks with drag-and-drop
- ✅ Conditional logic support
- ✅ Automation history/execution logs UI
- ✅ Real-time validation
- ✅ Save/publish automation workflows
- ✅ Test automation before publish

---

## Architecture Overview

```
User Interface
    ↓
Workflow Canvas (Trigger → Conditions → Actions)
    ↓
Block Library (UI Components for actions/triggers)
    ↓
API Integration
    ↓
Database (automation templates, executions)
```

---

## Phase-by-Phase Implementation

### Phase 1: Create Automation Data Types (30 mins)

Create `src/types/automation.ts`:

```typescript
export interface AutomationTrigger {
  id: string;
  type: 'webhook' | 'schedule' | 'manual' | 'form_submission';
  config: Record<string, any>;
  conditions?: Condition[];
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  logic: 'and' | 'or';
}

export interface AutomationAction {
  id: string;
  type: 'send_email' | 'save_database' | 'api_call' | 'slack_message' | 'webhook';
  config: Record<string, any>;
  order: number;
}

export interface Automation {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  execution_count: number;
}

export interface AutomationExecution {
  id: string;
  automation_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error?: string;
  execution_time_ms: number;
  created_at: string;
}
```

### Phase 2: Create Automation Management API Routes (1-2 hours)

Create `src/app/api/automations/create/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
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
      return Response.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    if (project.type !== 'automation') {
      return Response.json({ error: 'Project is not an automation type' }, { status: 400 });
    }

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Automation name is required' }, { status: 400 });
    }

    if (!trigger) {
      return Response.json({ error: 'Trigger configuration is required' }, { status: 400 });
    }

    if (!actions || actions.length === 0) {
      return Response.json({ error: 'At least one action is required' }, { status: 400 });
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
    return Response.json({ error: 'Failed to create automation' }, { status: 500 });
  }
}
```

Create `src/app/api/automations/[id]/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getAutomationById, updateAutomation, deleteAutomation, logAction } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
      return Response.json({ error: 'Automation not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ success: true, automation }, { status: 200 });
  } catch (error) {
    console.error('Get automation error:', error);
    return Response.json({ error: 'Failed to get automation' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      return Response.json({ error: 'Automation not found or unauthorized' }, { status: 404 });
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
      return Response.json({ error: 'Automation not found or unauthorized' }, { status: 404 });
    }

    await deleteAutomation(params.id);

    await logAction({
      user_id: user.id,
      action: 'automation_deleted',
      resource_type: 'automation',
      resource_id: params.id,
      details: { name: automation.name },
    });

    return Response.json({ success: true, message: 'Automation deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete automation error:', error);
    return Response.json({ error: 'Failed to delete automation' }, { status: 500 });
  }
}
```

### Phase 3: Create Workflow Builder Component (2-3 hours)

Create `src/components/AutomationBuilder.tsx`:

```typescript
'use client';

import React, { useState } from 'react';
import { Automation, AutomationTrigger, AutomationAction } from '@/types/automation';

interface AutomationBuilderProps {
  automation?: Automation;
  projectId: string;
  onSave: (automation: Automation) => void;
}

export default function AutomationBuilder({
  automation,
  projectId,
  onSave,
}: AutomationBuilderProps) {
  const [name, setName] = useState(automation?.name || '');
  const [description, setDescription] = useState(automation?.description || '');
  const [trigger, setTrigger] = useState<AutomationTrigger>(
    automation?.trigger || {
      id: '1',
      type: 'webhook',
      config: {},
    }
  );
  const [actions, setActions] = useState<AutomationAction[]>(
    automation?.actions || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addAction = () => {
    const newAction: AutomationAction = {
      id: Date.now().toString(),
      type: 'send_email',
      config: {},
      order: actions.length,
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const updateAction = (id: string, updates: Partial<AutomationAction>) => {
    setActions(
      actions.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Automation name is required');
      return;
    }

    if (actions.length === 0) {
      setError('At least one action is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = automation
        ? `/api/automations/${automation.id}`
        : '/api/automations/create';
      const method = automation ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          description,
          trigger,
          actions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save automation');
      }

      const data = await response.json();
      onSave(data.automation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Automation Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Welcome Email on Form Submit"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe what this automation does..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Trigger</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Trigger Type</label>
          <select
            value={trigger.type}
            onChange={e =>
              setTrigger({
                ...trigger,
                type: e.target.value as AutomationTrigger['type'],
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="webhook">Webhook</option>
            <option value="schedule">Schedule</option>
            <option value="manual">Manual</option>
            <option value="form_submission">Form Submission</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Actions</h3>
          <button
            onClick={addAction}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Add Action
          </button>
        </div>

        {actions.length === 0 ? (
          <p className="text-gray-500 text-sm">No actions yet. Add one to get started.</p>
        ) : (
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div key={action.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Action {index + 1}</span>
                  <button
                    onClick={() => removeAction(action.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <select
                  value={action.type}
                  onChange={e =>
                    updateAction(action.id, {
                      type: e.target.value as AutomationAction['type'],
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="send_email">Send Email</option>
                  <option value="save_database">Save to Database</option>
                  <option value="api_call">API Call</option>
                  <option value="slack_message">Slack Message</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
            ))}
          </div>
        )}
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
        {saving ? 'Saving...' : 'Save Automation'}
      </button>
    </div>
  );
}
```

### Phase 4: Create Automations List Page (1 hour)

Create `src/app/dashboard/automations/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Automation } from '@/types/automation';

export default function AutomationsPage() {
  const router = useRouter();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId') || '';
    setProjectId(id);
    fetchAutomations(id);
  }, []);

  const fetchAutomations = async (id: string) => {
    try {
      const response = await fetch(`/api/automations/list?projectId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setAutomations(data.automations || []);
      }
    } catch (error) {
      console.error('Failed to fetch automations:', error);
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
        <h1 className="text-3xl font-bold">Automations</h1>
        <Link
          href={`/dashboard/automations/new?projectId=${projectId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Automation
        </Link>
      </div>

      {automations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No automations yet</p>
          <Link
            href={`/dashboard/automations/new?projectId=${projectId}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Create your first automation
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {automations.map(automation => (
            <div
              key={automation.id}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{automation.name}</h3>
                  {automation.description && (
                    <p className="text-sm text-gray-600 mt-1">{automation.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span>Trigger: {automation.trigger.type}</span>
                    <span>Actions: {automation.actions.length}</span>
                    <span>Executions: {automation.execution_count}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      automation.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {automation.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <Link
                    href={`/dashboard/automations/${automation.id}/edit?projectId=${projectId}`}
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
export async function createAutomation(data: {
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger: any;
  actions: any[];
  is_active: boolean;
}) {
  try {
    const { data: automation, error } = await supabaseServer
      .from('automations')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return automation;
  } catch (error) {
    console.error('Error creating automation:', error);
    throw error;
  }
}

export async function getAutomationById(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('automations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching automation:', error);
    return null;
  }
}

export async function getProjectAutomations(projectId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('automations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching automations:', error);
    return [];
  }
}

export async function updateAutomation(id: string, updates: any) {
  try {
    const { data, error } = await supabaseServer
      .from('automations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating automation:', error);
    throw error;
  }
}

export async function deleteAutomation(id: string) {
  try {
    const { error } = await supabaseServer
      .from('automations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting automation:', error);
    throw error;
  }
}
```

---

## Database Schema

Add to Supabase:

```sql
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT FALSE,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_automations_project_id ON automations(project_id);
CREATE INDEX idx_automations_user_id ON automations(user_id);
```

---

## Acceptance Criteria

- ✅ Automation builder with trigger/action configuration
- ✅ API endpoints for CRUD operations
- ✅ List view showing all user automations
- ✅ Real-time validation of automation structure
- ✅ Execution count tracking
- ✅ Active/inactive status toggle

---

**Estimated Completion Time:** 3-4 days
**Difficulty:** Medium
**Next Step:** Step 36 - Website Builder
