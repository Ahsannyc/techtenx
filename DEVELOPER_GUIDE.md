# TechTenX Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Stripe account (for payments)
- Auth0 account (for authentication)

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/techtenx.git
   cd techtenx
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## Project Structure

```
techtenx/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Homepage
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication routes
│   │   │   ├── checkout/   # Payment routes
│   │   │   ├── webhooks/   # Webhook handlers
│   │   │   ├── contact/    # Contact form
│   │   │   └── newsletter/ # Newsletter signup
│   │   ├── dashboard/      # User dashboard pages
│   │   ├── admin/          # Admin pages
│   │   ├── blog/           # Blog pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── Navigation.tsx
│   │   ├── FeatureGate.tsx
│   │   ├── NewsletterSignup.tsx
│   │   └── ...
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # Auth utilities
│   │   ├── stripe.ts       # Stripe utilities
│   │   └── features.ts     # Feature flags
│   └── instrumentation.ts  # Sentry setup
├── public/                 # Static files
├── .env.example            # Environment template
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Authentication

TechTenX uses Auth0 for user authentication. All protected routes require a valid session.

### Protected Routes

Redirect to login if not authenticated:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const user = session.user;
  // ... render page
}
```

### Client-Side Auth

For client components:

```typescript
'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function MyComponent() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return <div>Hello, {user.name}</div>;
}
```

## API Endpoints

### Authentication

- `GET /api/auth/login` - Start login flow
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/callback` - Auth0 callback (handled automatically)

### Payments

- `POST /api/checkout` - Create checkout session
  - Body: `{ plan: 'starter' | 'pro' | 'enterprise' }`
  - Response: `{ sessionId: string, url: string }`

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler
  - Events: checkout.session.completed, invoice.payment_succeeded, etc.

### Contact

- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, message, company, phone, planInterest }`
  - Response: `{ success: boolean, message: string }`

### Newsletter

- `POST /api/newsletter` - Subscribe to newsletter
  - Body: `{ email: string }`
  - Response: `{ success: boolean, message: string }`

## Database Schema

Current implementation uses in-memory storage for MVP. For production, integrate:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  auth0_id VARCHAR(255) UNIQUE,
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50),
  status VARCHAR(50),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- 'agent', 'automation', 'website'
  name VARCHAR(255),
  description TEXT,
  config JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Feature Flags

Check user access to features:

```typescript
import { canAccessFeature, getPlanFeatures } from '@/lib/features';

const userPlan = 'pro'; // from database

// Check single feature
if (canAccessFeature('API_ACCESS', userPlan)) {
  // Show feature
}

// Get all features for plan
const features = getPlanFeatures(userPlan);
```

## Environment Variables

### Required
```
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Optional
```
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo in Vercel
3. Add environment variables
4. Deploy (auto-deploys on push)

### Deploy to Custom Server

1. Build project
   ```bash
   npm run build
   ```

2. Start production server
   ```bash
   npm run start
   ```

3. Use PM2 or similar for process management
   ```bash
   pm2 start npm --name "techtenx" -- start
   ```

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Create account via Auth0
- [ ] View dashboard
- [ ] Upgrade plan (use Stripe test cards)
- [ ] View billing page
- [ ] Submit contact form
- [ ] Subscribe to newsletter
- [ ] Test admin dashboard (use admin email)

## Monitoring

### Error Tracking

Sentry is configured for error monitoring. Check dashboard at https://sentry.io

### Analytics

Google Analytics tracks pageviews and custom events. Dashboard: https://analytics.google.com

### Uptime Monitoring

Monitor site uptime at https://uptime.com or similar service.

## Common Tasks

### Add New Route

1. Create file: `src/app/[route]/page.tsx`
2. Import components
3. Export default component
4. Add to navigation if needed

### Add API Endpoint

1. Create file: `src/app/api/[name]/route.ts`
2. Export GET/POST/PUT/DELETE functions
3. Import utilities (auth, stripe, etc.)
4. Return Response.json()

### Protect a Route

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function ProtectedRoute() {
  const session = await getSession();
  if (!session) redirect('/login');
  // ...
}
```

### Check User Feature Access

```typescript
import { canAccessFeature } from '@/lib/features';

const userPlan = 'pro'; // from DB
if (!canAccessFeature('FEATURE_NAME', userPlan)) {
  return <div>Upgrade to access this</div>;
}
```

## Troubleshooting

### Auth0 Issues

**"Invalid URL" error:**
- Check AUTH0_BASE_URL matches exactly
- No trailing slashes

**Login redirect loop:**
- Verify Allowed Callback URLs in Auth0 dashboard
- Check NEXT_PUBLIC_APP_URL env var

### Stripe Issues

**"Invalid API Key" error:**
- Verify STRIPE_SECRET_KEY is correct
- Check it starts with `sk_test_` or `sk_live_`

**Webhook not firing:**
- Use Stripe CLI to test: `stripe trigger payment_intent.succeeded`
- Check webhook signing secret matches

### Database Connection

**"Cannot connect" error:**
- Verify DATABASE_URL is correct
- Check database is running
- Verify credentials

## Getting Help

- GitHub Issues: https://github.com/yourusername/techtenx/issues
- Documentation: See ./docs/
- Email: support@techtenx.com
- Chat: [Discord/Slack link]

## Performance Tips

1. **Image Optimization**
   - Use Next.js Image component
   - Specify width/height

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Lazy load non-critical components

3. **Database Queries**
   - Add indexes on frequently queried columns
   - Cache responses where possible

4. **API Calls**
   - Use server-side rendering
   - Cache static content
   - Rate limit external APIs

## Security Best Practices

1. **Never commit secrets**
   - Use .env.local, not .env
   - Rotate secrets regularly

2. **Validate input**
   - Check email format
   - Sanitize user inputs
   - Rate limit API endpoints

3. **HTTPS only**
   - Enforce in production
   - Use secure cookies

4. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

---

For more help, see individual setup guides (AUTH0_SETUP_GUIDE.md, STRIPE_SETUP_GUIDE.md, etc.)
