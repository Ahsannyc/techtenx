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
