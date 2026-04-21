# Feature Flags & Plan-Based Access Guide

## Overview
TechTenX uses a feature flag system to control which features are available to different subscription tiers.

## Plans & Features

### Free Tier
- 1 AI Agent
- 1 Automation
- No Custom Domain
- No E-commerce
- No Team Members
- Community Support

### Starter ($29/month)
- 5 AI Agents
- 20 Automations
- 1 Website
- Custom Domain
- 1 Team Member
- Email Support

### Pro ($99/month)
- 100 AI Agents
- Unlimited Automations
- 5 Websites
- E-commerce
- 5 Team Members
- Priority Support
- API Access

### Enterprise (Custom)
- Unlimited Everything
- White-Label
- Dedicated Support
- Custom Integrations
- SLA

## Using Feature Flags

### Check if Feature is Available

```typescript
import { canAccessFeature, Plan } from '@/lib/features';

const userPlan: Plan = 'starter';
const hasAPI = canAccessFeature('API_ACCESS', userPlan);

if (hasAPI) {
  // Show API section
} else {
  // Show upgrade prompt
}
```

### Get Feature Limit

```typescript
import { getFeatureLimit } from '@/lib/features';

const agents = getFeatureLimit('CREATE_AGENTS', 'pro'); // Returns 100
const automations = getFeatureLimit('CREATE_AUTOMATIONS', 'starter'); // Returns 20
```

### Get All Features for a Plan

```typescript
import { getPlanFeatures } from '@/lib/features';

const proFeatures = getPlanFeatures('pro');
// Returns: {
//   CREATE_AGENTS: 100,
//   API_ACCESS: true,
//   WHITE_LABEL: false,
//   ...
// }
```

## Component Usage

### Using FeatureGate Component

```tsx
import FeatureGate from '@/components/FeatureGate';
import { Plan } from '@/lib/features';

export default function APISettings({ userPlan }: { userPlan: Plan }) {
  return (
    <FeatureGate feature="API_ACCESS" plan={userPlan}>
      <div>
        <h2>API Keys</h2>
        {/* API key management UI */}
      </div>
    </FeatureGate>
  );
}
```

### Custom Fallback

```tsx
<FeatureGate
  feature="WHITE_LABEL"
  plan={userPlan}
  fallback={<p>White-label available on Enterprise only</p>}
>
  <div>White-label settings</div>
</FeatureGate>
```

### Hide Upgrade Prompt

```tsx
<FeatureGate
  feature="ECOMMERCE"
  plan={userPlan}
  showUpgrade={false}
>
  <div>E-commerce features</div>
</FeatureGate>
```

## Adding New Features

### 1. Add Feature Definition

In `src/lib/features.ts`:

```typescript
export const FEATURES = {
  // ... existing features ...
  NEW_FEATURE: {
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
};
```

### 2. Use in Components

```typescript
import { canAccessFeature } from '@/lib/features';

const hasNewFeature = canAccessFeature('NEW_FEATURE', userPlan);
```

## Feature Limits

Features can have different limit types:

```typescript
// Boolean (feature on/off)
API_ACCESS: {
  free: false,
  starter: true,
  pro: true,
  enterprise: true,
}

// Number (quantity limit)
CREATE_AGENTS: {
  free: 1,
  starter: 5,
  pro: 100,
  enterprise: 'unlimited',
}

// String (unlimited)
CREATE_AUTOMATIONS: {
  free: 1,
  starter: 20,
  pro: 'unlimited',
  enterprise: 'unlimited',
}
```

## Server-Side Checks

For protecting API routes:

```typescript
// src/app/api/agents/route.ts
import { canAccessFeature } from '@/lib/features';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Get user plan from database
  const userPlan = 'starter'; // from DB

  if (!canAccessFeature('CREATE_AGENTS', userPlan)) {
    return Response.json(
      { error: 'Feature not available on your plan' },
      { status: 403 }
    );
  }

  // Process request...
}
```

## Checking Upgrade Eligibility

```typescript
import { canUpgradeToPlan } from '@/lib/features';

const currentPlan = 'free';
const targetPlan = 'pro';

if (canUpgradeToPlan(currentPlan, targetPlan)) {
  // User can upgrade
}
```

## Plan Hierarchy

```
free → starter → pro → enterprise
  0        1       2        3
```

## Database Integration (Optional)

For persistent plan tracking:

```typescript
// Store user plan in database
interface User {
  id: string;
  email: string;
  plan: Plan; // 'free' | 'starter' | 'pro' | 'enterprise'
  stripeCustomerId?: string;
  createdAt: Date;
}

// Check plan:
const user = await db.users.findById(userId);
const hasFeature = canAccessFeature('API_ACCESS', user.plan);
```

## Testing

### Mock Features in Tests

```typescript
import { canAccessFeature } from '@/lib/features';

describe('Feature Gates', () => {
  it('should allow Pro users to access API', () => {
    expect(canAccessFeature('API_ACCESS', 'pro')).toBe(true);
  });

  it('should block Free users from white-label', () => {
    expect(canAccessFeature('WHITE_LABEL', 'free')).toBe(false);
  });
});
```

## Common Patterns

### Show Feature Based on Plan

```tsx
{userPlan === 'pro' && (
  <AdvancedFeature />
)}
```

### Disable Button if No Access

```tsx
<button
  disabled={!canAccessFeature('FEATURE_NAME', userPlan)}
  onClick={handleFeatureClick}
>
  Feature
</button>
```

### Enforce Limits

```tsx
const usedAgents = userAgents.length;
const limit = getFeatureLimit('CREATE_AGENTS', userPlan);

if (usedAgents >= limit) {
  return <div>You've reached your limit</div>;
}
```

## Updating Plans

When user upgrades/downgrades:

1. Update `user.plan` in database
2. Clear session cache
3. Re-render components (features may show/hide)

```typescript
// After Stripe webhook
await updateUserPlan(userId, 'pro');
revalidatePath('/dashboard');
```

---

For more info on the specific features offered, see `PRICING.md`
