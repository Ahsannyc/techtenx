# Step 31: Database Integration with Supabase

## Detailed Implementation Prompt

**Goal:** Replace in-memory data storage with persistent PostgreSQL database via Supabase

**Effort:** 3-4 days
**Priority:** CRITICAL
**Success Criteria:**
- ✅ Supabase project created and connected
- ✅ Database schema with 5 core tables created
- ✅ Database utilities/helpers exported
- ✅ Environment variables configured
- ✅ All queries tested in development
- ✅ Migrations documented

---

## Step-by-Step Implementation

### Phase 1: Supabase Account Setup (30 minutes)

1. Go to https://supabase.com
2. Sign up or log in
3. Create new project:
   - Organization: TechTenX
   - Project name: techtenx-prod
   - Database password: [Generate strong password]
   - Region: us-east-1 (or closest to your users)
4. Wait for project to initialize (5-10 minutes)
5. Copy credentials:
   - Project URL
   - Anon key
   - Service role key

### Phase 2: Database Schema Creation (1-2 hours)

Create these 5 core tables:

**Table 1: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_email ON users(email);
```

**Table 2: subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
```

**Table 3: projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'agent', 'automation', 'website'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);
```

**Table 4: audit_logs**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Table 5: team_members**
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
```

### Phase 3: Environment Variables (15 minutes)

Add to `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Phase 4: Supabase Client Setup (30 minutes)

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
```

### Phase 5: Database Utilities (1-2 hours)

Create `src/lib/db.ts` with helper functions:
```typescript
import { supabaseServer } from './supabase';

// Users
export async function createUser(data: {
  auth0_id: string;
  email: string;
  name: string;
  avatar_url?: string;
}) {
  const { data: user, error } = await supabaseServer
    .from('users')
    .insert([data])
    .select()
    .single();
  
  if (error) throw error;
  return user;
}

export async function getUserByAuth0Id(auth0_id: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('auth0_id', auth0_id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserPlan(userId: string, plan: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .update({ plan, updated_at: new Date() })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Subscriptions
export async function createSubscription(data: {
  user_id: string;
  stripe_subscription_id: string;
  plan: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
}) {
  const { data: sub, error } = await supabaseServer
    .from('subscriptions')
    .insert([data])
    .select()
    .single();
  
  if (error) throw error;
  return sub;
}

// Projects
export async function createProject(data: {
  user_id: string;
  type: 'agent' | 'automation' | 'website';
  name: string;
  description?: string;
  config?: Record<string, any>;
}) {
  const { data: project, error } = await supabaseServer
    .from('projects')
    .insert([data])
    .select()
    .single();
  
  if (error) throw error;
  return project;
}

export async function getUserProjects(userId: string) {
  const { data, error } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Audit Logs
export async function logAction(data: {
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}) {
  const { error } = await supabaseServer
    .from('audit_logs')
    .insert([data]);
  
  if (error) console.error('Audit log error:', error);
}
```

### Phase 6: Update Auth0 Webhook (1 hour)

When user signs up via Auth0, save to database.

Create `src/app/api/auth/webhook/route.ts`:
```typescript
import { createUser, updateUserPlan } from '@/lib/db';

export async function POST(request: Request) {
  const secret = process.env.AUTH0_WEBHOOK_SECRET;
  const body = await request.json();

  // Verify webhook signature
  // TODO: Implement signature verification

  if (body.data.event === 'user_created') {
    await createUser({
      auth0_id: body.data.user_id,
      email: body.data.email,
      name: body.data.name || body.data.email,
      avatar_url: body.data.picture,
    });
  }

  return Response.json({ received: true });
}
```

### Phase 7: Update Stripe Webhook (1 hour)

Save subscription data to database.

Update `src/app/api/webhooks/stripe/route.ts`:
```typescript
import { 
  createSubscription, 
  updateUserPlan,
  getUserByAuth0Id 
} from '@/lib/db';

// In webhook handler...

case 'checkout.session.completed': {
  const session = event.data.object;
  const user = await getUserByAuth0Id(session.client_reference_id);
  
  if (user) {
    await createSubscription({
      user_id: user.id,
      stripe_subscription_id: session.subscription,
      plan: 'starter', // from Stripe metadata
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    
    await updateUserPlan(user.id, 'starter');
  }
  break;
}
```

---

## Testing Checklist

- [ ] Supabase project created
- [ ] All 5 tables created with indexes
- [ ] Environment variables set
- [ ] Supabase client initialized
- [ ] All DB helper functions exported
- [ ] Auth0 webhook handler working
- [ ] Stripe webhook saving subscriptions
- [ ] Can query users from dashboard
- [ ] Can create projects and save to DB
- [ ] Audit logs recording actions

---

## Next Steps

After completing Step 31:
1. Test all database operations locally
2. Verify data persists across page reloads
3. Proceed to Step 32: User Data Persistence

---

## Common Issues & Solutions

**Issue:** "SSL connection error"
- Solution: Update Supabase SSL settings in connection

**Issue:** "CORS error accessing Supabase"
- Solution: Add localhost to Supabase allowed origins in settings

**Issue:** "Row level security (RLS) preventing inserts"
- Solution: Disable RLS for now (enable in production with policies)

---

**Estimated Completion Time:** 3-4 days
**Difficulty:** Medium
**Next Step:** Step 32 - User Data Persistence
