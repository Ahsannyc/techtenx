# Step 32: User Data Persistence

## Detailed Implementation Prompt

**Goal:** Update Auth0 integration and Stripe webhooks to persist user data to database

**Effort:** 2-3 days
**Priority:** CRITICAL
**Success Criteria:**
- ✅ Auth0 callback creates user in database
- ✅ Stripe webhooks update database
- ✅ Dashboard loads user data from database
- ✅ Subscriptions persist correctly
- ✅ All data survives page reloads
- ✅ Tests pass for all database operations

---

## Step-by-Step Implementation

### Phase 1: Update Auth0 Callback (1-2 hours)

Modify `src/app/api/auth/[auth0]/route.ts`:

```typescript
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { createUser, getUserByAuth0Id } from '@/lib/db';
import { logAction } from '@/lib/db';

const afterCallback = async (session: any, state: any) => {
  try {
    const auth0Id = session.user.sub;
    let user = await getUserByAuth0Id(auth0Id);

    if (!user) {
      // Create new user in database
      user = await createUser({
        auth0_id: auth0Id,
        email: session.user.email,
        name: session.user.name,
        avatar_url: session.user.picture,
      });

      // Log action
      await logAction({
        user_id: user.id,
        action: 'user_signup',
        resource_type: 'user',
        resource_id: user.id,
        details: { email: user.email },
      });
    }

    // Add user data to session
    session.user.db_id = user.id;
    session.user.plan = user.plan;

    return session;
  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
};

export const GET = handleAuth({ callbacks: { afterCallback } });
```

### Phase 2: Update Stripe Checkout API (1 hour)

Modify `src/app/api/checkout/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { createCheckoutSession } from '@/lib/stripe';
import { getUserByAuth0Id, updateUserStripeId } from '@/lib/db';
import { logAction } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !['starter', 'pro', 'enterprise'].includes(plan)) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get user from database
    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const priceId = PRODUCTS[plan.toUpperCase() as keyof typeof PRODUCTS];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession(
      session.user.email || '',
      priceId,
      `${baseUrl}/dashboard/billing?success=true`,
      `${baseUrl}/dashboard/billing?canceled=true`
    );

    // Log the action
    await logAction({
      user_id: user.id,
      action: 'checkout_started',
      resource_type: 'checkout',
      resource_id: checkoutSession.id,
      details: { plan },
    });

    return Response.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
```

### Phase 3: Update Stripe Webhooks (1-2 hours)

Modify `src/app/api/webhooks/stripe/route.ts`:

```typescript
import { 
  createSubscription, 
  updateUserPlan,
  getUserByAuth0Id,
  updateSubscriptionStatus,
  getSubscriptionByStripeId,
  logAction,
  updateUserStripeId
} from '@/lib/db';

// In the webhook handler switch statement:

case 'checkout.session.completed': {
  const session = event.data.object;
  console.log('✓ Checkout completed:', session.id);

  try {
    // Get user by Stripe customer email
    // TODO: Store user reference in Stripe metadata instead
    // For now, using customer email to find user
    const { data: users } = await supabaseServer
      .from('users')
      .select('*')
      .eq('email', session.customer_email);

    if (users && users.length > 0) {
      const user = users[0];

      // Save Stripe customer ID
      await updateUserStripeId(user.id, session.customer as string);

      // Create subscription record
      const currentDate = new Date();
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await createSubscription({
        user_id: user.id,
        stripe_subscription_id: session.subscription as string,
        plan: session.metadata?.plan || 'starter',
        status: 'active',
        current_period_start: currentDate,
        current_period_end: nextMonth,
      });

      // Update user plan
      await updateUserPlan(user.id, session.metadata?.plan || 'starter');

      // Log action
      await logAction({
        user_id: user.id,
        action: 'subscription_created',
        resource_type: 'subscription',
        resource_id: session.subscription as string,
        details: { plan: session.metadata?.plan, amount: session.amount_total },
      });
    }
  } catch (error) {
    console.error('Error processing checkout completion:', error);
  }
  break;
}

case 'invoice.payment_succeeded': {
  const invoice = event.data.object;
  console.log('✓ Invoice payment succeeded:', invoice.id);

  try {
    const subscription = await getSubscriptionByStripeId(invoice.subscription as string);
    
    if (subscription) {
      // Update subscription period dates
      await supabaseServer
        .from('subscriptions')
        .update({
          current_period_start: new Date(invoice.period_start * 1000).toISOString(),
          current_period_end: new Date(invoice.period_end * 1000).toISOString(),
        })
        .eq('id', subscription.id);

      await logAction({
        user_id: subscription.user_id,
        action: 'payment_succeeded',
        resource_type: 'invoice',
        resource_id: invoice.id,
        details: { amount: invoice.amount_paid },
      });
    }
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
  break;
}

case 'invoice.payment_failed': {
  const invoice = event.data.object;
  console.log('✗ Invoice payment failed:', invoice.id);

  try {
    const subscription = await getSubscriptionByStripeId(invoice.subscription as string);
    
    if (subscription) {
      await logAction({
        user_id: subscription.user_id,
        action: 'payment_failed',
        resource_type: 'invoice',
        resource_id: invoice.id,
        details: { amount: invoice.amount_due, reason: invoice.failure_reason },
      });
    }
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
  break;
}

case 'customer.subscription.updated': {
  const subscription = event.data.object;
  console.log('✓ Subscription updated:', subscription.id);

  try {
    await updateSubscriptionStatus(subscription.id as string, subscription.status);

    const sub = await getSubscriptionByStripeId(subscription.id as string);
    if (sub) {
      await logAction({
        user_id: sub.user_id,
        action: 'subscription_updated',
        resource_type: 'subscription',
        resource_id: subscription.id,
        details: { status: subscription.status },
      });
    }
  } catch (error) {
    console.error('Error processing subscription update:', error);
  }
  break;
}

case 'customer.subscription.deleted': {
  const subscription = event.data.object;
  console.log('✗ Subscription canceled:', subscription.id);

  try {
    await updateSubscriptionStatus(
      subscription.id as string,
      'canceled'
    );

    const sub = await getSubscriptionByStripeId(subscription.id as string);
    if (sub) {
      // Downgrade user to free plan
      await updateUserPlan(sub.user_id, 'free');

      await logAction({
        user_id: sub.user_id,
        action: 'subscription_canceled',
        resource_type: 'subscription',
        resource_id: subscription.id,
        details: { canceled_at: new Date().toISOString() },
      });
    }
  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
  }
  break;
}
```

### Phase 4: Update Dashboard Pages (1-2 hours)

Update `src/app/dashboard/page.tsx`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getUserProjects } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Get user from database
  const user = await getUserByAuth0Id(session.user.sub);

  if (!user) {
    // User doesn't exist in database - create them
    // This shouldn't happen if Auth0 callback works correctly
    redirect('/login');
  }

  // Get user's projects from database
  const projects = await getUserProjects(user.id);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ... Navigation ... */}

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Welcome, {user.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-gray-400">
              Plan: <span className="text-blue-400 font-semibold">{user.plan.toUpperCase()}</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Active Projects', value: projects.length.toString(), icon: '📦' },
              { label: 'AI Agents', value: projects.filter(p => p.type === 'agent').length.toString(), icon: '🤖' },
              { label: 'Automations', value: projects.filter(p => p.type === 'automation').length.toString(), icon: '⚙️' },
              { label: 'Websites', value: projects.filter(p => p.type === 'website').length.toString(), icon: '🌐' }
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Projects */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="mb-4">No projects yet</p>
                <p className="text-sm">Create your first AI agent or automation to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.type}</p>
                    </div>
                    <span className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
```

### Phase 5: Update Billing Dashboard (1 hour)

Update `src/app/dashboard/billing/page.tsx`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function BillingPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await getUserByAuth0Id(session.user.sub);

  if (!user) {
    redirect('/login');
  }

  // Determine current plan details
  const plans = {
    free: { name: 'Free', price: '$0', description: 'Perfect for getting started' },
    starter: { name: 'Starter', price: '$29/month', description: 'For small teams' },
    pro: { name: 'Pro', price: '$99/month', description: 'For growing businesses' },
    enterprise: { name: 'Enterprise', price: 'Custom', description: 'For enterprises' },
  };

  const currentPlan = plans[user.plan as keyof typeof plans] || plans.free;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ... Navigation ... */}

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-gray-400">Manage your plan and billing details</p>
          </div>

          {/* Current Plan */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">You're currently on</p>
                <p className="text-4xl font-bold">{currentPlan.name}</p>
                <p className="text-gray-400 mt-2">{currentPlan.price}</p>
              </div>
              {user.plan !== 'enterprise' && (
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>

          {/* Billing History (from Stripe) */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Billing History</h2>
            <div className="text-center text-gray-400">
              <p>Invoices will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## Testing Checklist

- [ ] User created in database on Auth0 signup
- [ ] User plan updated on Stripe payment
- [ ] Subscription persists after page reload
- [ ] Dashboard loads user data from database
- [ ] Projects displayed on dashboard
- [ ] Billing page shows correct plan
- [ ] Audit logs recording all actions
- [ ] Error handling for missing users
- [ ] Database queries optimized

---

## Common Issues

**Issue:** User not found in database during checkout
- Solution: Ensure Auth0 callback is creating users before checkout

**Issue:** Subscription data not persisting
- Solution: Verify Stripe webhooks are being triggered and database is receiving data

**Issue:** Dashboard showing stale data
- Solution: Clear cache, ensure database queries are fresh

---

**Estimated Completion Time:** 2-3 days
**Difficulty:** Medium
**Next Step:** Step 33 - Project Management API
