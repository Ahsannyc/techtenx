import { supabaseServer } from './supabase';

// ============================================================================
// USERS TABLE OPERATIONS
// ============================================================================

export async function createUser(data: {
  auth0_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}) {
  try {
    const { data: user, error } = await supabaseServer
      .from('users')
      .insert([
        {
          auth0_id: data.auth0_id,
          email: data.email,
          name: data.name || data.email.split('@')[0],
          avatar_url: data.avatar_url,
          plan: 'free',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByAuth0Id(auth0_id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('auth0_id', auth0_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function updateUserPlan(userId: string, plan: string) {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .update({ plan, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
}

export async function updateUserStripeId(userId: string, stripeCustomerId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating Stripe ID:', error);
    throw error;
  }
}

// ============================================================================
// SUBSCRIPTIONS TABLE OPERATIONS
// ============================================================================

export async function createSubscription(data: {
  user_id: string;
  stripe_subscription_id?: string;
  plan: string;
  status: string;
  current_period_start?: Date;
  current_period_end?: Date;
}) {
  try {
    const { data: sub, error } = await supabaseServer
      .from('subscriptions')
      .insert([
        {
          user_id: data.user_id,
          stripe_subscription_id: data.stripe_subscription_id,
          plan: data.plan,
          status: data.status,
          current_period_start: data.current_period_start?.toISOString(),
          current_period_end: data.current_period_end?.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return sub;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string
) {
  try {
    const { data, error } = await supabaseServer
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

// ============================================================================
// PROJECTS TABLE OPERATIONS
// ============================================================================

export async function createProject(data: {
  user_id: string;
  type: 'agent' | 'automation' | 'website';
  name: string;
  description?: string;
  config?: Record<string, any>;
}) {
  try {
    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert([
        {
          user_id: data.user_id,
          type: data.type,
          name: data.name,
          description: data.description,
          config: data.config || {},
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getUserProjects(userId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('status', '!archived')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
}

export async function getProjectById(projectId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function updateProject(
  projectId: string,
  updates: Partial<{
    name: string;
    description: string;
    config: Record<string, any>;
    status: string;
  }>
) {
  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// ============================================================================
// AUDIT LOGS TABLE OPERATIONS
// ============================================================================

export async function logAction(data: {
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}) {
  try {
    const { error } = await supabaseServer.from('audit_logs').insert([data]);

    if (error) {
      console.error('Audit log error:', error);
    }
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

export async function getUserAuditLogs(
  userId: string,
  limit = 50
) {
  try {
    const { data, error } = await supabaseServer
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

// ============================================================================
// AGENT EXECUTIONS TABLE OPERATIONS
// ============================================================================

export async function createAgentExecution(data: {
  project_id: string;
  user_id: string;
  input_message: string;
  output_message?: string;
  tools_used?: string[];
  input_tokens?: number;
  output_tokens?: number;
  execution_time_ms?: number;
  status?: string;
  error_message?: string;
}) {
  try {
    const { data: execution, error } = await supabaseServer
      .from('agent_executions')
      .insert([
        {
          project_id: data.project_id,
          user_id: data.user_id,
          input_message: data.input_message,
          output_message: data.output_message,
          tools_used: data.tools_used || [],
          input_tokens: data.input_tokens,
          output_tokens: data.output_tokens,
          execution_time_ms: data.execution_time_ms,
          status: data.status || 'pending',
          error_message: data.error_message,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return execution;
  } catch (error) {
    console.error('Error creating agent execution:', error);
    throw error;
  }
}

export async function getAgentExecutions(projectId: string, limit = 50) {
  try {
    const { data, error } = await supabaseServer
      .from('agent_executions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agent executions:', error);
    return [];
  }
}

export async function getAgentExecutionById(executionId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('agent_executions')
      .select('*')
      .eq('id', executionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agent execution:', error);
    return null;
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkDatabaseHealth() {
  try {
    const { count, error } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { healthy: true, userCount: count };
  } catch (error) {
    return { healthy: false, error: String(error) };
  }
}
