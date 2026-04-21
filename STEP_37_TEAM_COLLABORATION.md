# Step 37: Team Collaboration Features

## Detailed Implementation Prompt

**Goal:** Build team management with role-based access control, invitations, and collaboration features

**Effort:** 3-4 days
**Priority:** HIGH
**Success Criteria:**
- ✅ Team member invitations (email-based)
- ✅ Role-based access control (owner, editor, viewer)
- ✅ Permission management per role
- ✅ Team member activity tracking
- ✅ Shared project access
- ✅ Real-time collaboration indicators
- ✅ Team management dashboard
- ✅ Audit logs for team actions

---

## Architecture Overview

```
Team Management
    ↓
Team Members → Roles → Permissions
    ↓
Invitation System (Email)
    ↓
Access Control (Project-level)
    ↓
Activity Tracking
    ↓
Audit Logs
```

---

## Phase-by-Phase Implementation

### Phase 1: Create Team Data Types (30 mins)

Create `src/types/team.ts`:

```typescript
export type UserRole = 'owner' | 'editor' | 'viewer';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  invite: boolean;
  manage_team: boolean;
}

export interface RolePermissions {
  owner: Permission;
  editor: Permission;
  viewer: Permission;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string;
  email: string;
  name?: string;
  role: UserRole;
  status: 'active' | 'invited' | 'pending';
  joined_at?: string;
  invited_at?: string;
}

export interface Team {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  created_at: string;
  updated_at: string;
  member_count: number;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: UserRole;
  token: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  created_by: string;
}

export interface TeamActivity {
  id: string;
  team_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

### Phase 2: Create Team Management API Routes (1-2 hours)

Create `src/app/api/teams/create/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, createTeam, logAction } from '@/lib/db';

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
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Team name is required' }, { status: 400 });
    }

    const team = await createTeam({
      user_id: user.id,
      name,
      description,
    });

    await logAction({
      user_id: user.id,
      action: 'team_created',
      resource_type: 'team',
      resource_id: team.id,
      details: { name },
    });

    return Response.json({ success: true, team }, { status: 201 });
  } catch (error) {
    console.error('Create team error:', error);
    return Response.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/teams/[id]/invite/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getTeamById, inviteTeamMember, logAction } from '@/lib/db';
import crypto from 'crypto';

export async function POST(
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

    const team = await getTeamById(params.id);
    if (!team || team.user_id !== user.id) {
      return Response.json(
        { error: 'Team not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!['owner', 'editor', 'viewer'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await inviteTeamMember({
      team_id: params.id,
      email,
      role,
      token,
      expires_at: expiresAt.toISOString(),
      created_by: user.id,
    });

    await logAction({
      user_id: user.id,
      action: 'team_member_invited',
      resource_type: 'team',
      resource_id: params.id,
      details: { email, role },
    });

    return Response.json({ success: true, invitation }, { status: 201 });
  } catch (error) {
    console.error('Invite team member error:', error);
    return Response.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/teams/[id]/members/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getTeamMembers, updateTeamMember, removeTeamMember, logAction } from '@/lib/db';

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

    const members = await getTeamMembers(params.id);
    return Response.json({ success: true, members }, { status: 200 });
  } catch (error) {
    console.error('Get team members error:', error);
    return Response.json({ error: 'Failed to get team members' }, { status: 500 });
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

    const body = await request.json();
    const { memberId, role } = body;

    if (!['owner', 'editor', 'viewer'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await updateTeamMember(memberId, { role });

    await logAction({
      user_id: user.id,
      action: 'team_member_role_updated',
      resource_type: 'team',
      resource_id: params.id,
      details: { memberId, role },
    });

    return Response.json({ success: true, member: updated }, { status: 200 });
  } catch (error) {
    console.error('Update team member error:', error);
    return Response.json({ error: 'Failed to update team member' }, { status: 500 });
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

    const body = await request.json();
    const { memberId } = body;

    await removeTeamMember(memberId);

    await logAction({
      user_id: user.id,
      action: 'team_member_removed',
      resource_type: 'team',
      resource_id: params.id,
      details: { memberId },
    });

    return Response.json(
      { success: true, message: 'Team member removed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove team member error:', error);
    return Response.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
```

### Phase 3: Create Team Management Component (2 hours)

Create `src/components/TeamManager.tsx`:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Team, TeamMember, UserRole } from '@/types/team';

interface TeamManagerProps {
  team?: Team;
  teamId: string;
  onUpdate: (team: Team) => void;
}

export default function TeamManager({
  team,
  teamId,
  onUpdate,
}: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(team?.members || []);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async () => {
    if (!inviteEmail.includes('@')) {
      setError('Valid email is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setMembers(
        members.map(m => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Remove this team member?')) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      setMembers(members.filter(m => m.id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="team@example.com"
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value as UserRole)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Invite'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Team Members ({members.length})</h3>
        {members.length === 0 ? (
          <p className="text-gray-500">No team members yet</p>
        ) : (
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{member.name || member.email}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={member.role}
                    onChange={e => handleRoleChange(member.id, e.target.value as UserRole)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-3 py-1 text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Phase 4: Add Database Functions (30 mins)

Add to `src/lib/db.ts`:

```typescript
export async function createTeam(data: {
  user_id: string;
  name: string;
  description?: string;
}) {
  try {
    const { data: team, error } = await supabaseServer
      .from('teams')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return team;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

export async function getTeamById(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching team:', error);
    return null;
  }
}

export async function getTeamMembers(teamId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function inviteTeamMember(data: {
  team_id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_by: string;
}) {
  try {
    const { data: invitation, error } = await supabaseServer
      .from('team_invitations')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return invitation;
  } catch (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }
}

export async function updateTeamMember(memberId: string, updates: any) {
  try {
    const { data, error } = await supabaseServer
      .from('team_members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
}

export async function removeTeamMember(memberId: string) {
  try {
    const { error } = await supabaseServer
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
}
```

---

## Database Schema

Add to Supabase:

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP,
  invited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_teams_user_id ON teams(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
```

---

## Acceptance Criteria

- ✅ Team creation and management
- ✅ Role-based access control
- ✅ Email-based invitations
- ✅ Team member management
- ✅ Audit logging
- ✅ Permission enforcement

---

**Estimated Completion Time:** 3-4 days
**Difficulty:** Medium
**Next Step:** Step 38 - Usage Analytics Dashboard
