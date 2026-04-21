# TechTenX Integration Setup Guide

This document walks through setting up all external services and integrations needed for TechTenX production launch.

---

## 1. Resend (Email Service)

**Purpose:** Send transactional emails (contact form, newsletter, confirmations)

### Setup:
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Create API key
4. Verify sender email domain
5. Copy API key to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx...
   ```

**Emails Sent By:**
- Contact form submissions → admin@techtenx.com
- Contact form confirmations → user's email
- Newsletter signups → welcome email
- Demo bookings (optional) → confirmation email

---

## 2. Google Analytics

**Purpose:** Track visitor behavior, page views, conversions

### Setup:
1. Go to https://analytics.google.com
2. Sign in with Google account
3. Create new property: "TechTenX"
4. Set data stream to: https://techtenx.vercel.app
5. Copy Measurement ID (G-XXXXXXXXXX)
6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

**Tracks:**
- Page views across all pages
- Custom events (contact form, demo bookings, signups)
- Device type, location, referrer
- Conversion funnel

---

## 3. Calendly (Demo Scheduling)

**Purpose:** Allow users to book product demos

### Setup:
1. Go to https://calendly.com
2. Sign up (free tier)
3. Create "Product Demo" event type
4. Set availability and duration (30 min recommended)
5. Get embed code from Sharing settings
6. Update CalendlyEmbed component:
   ```tsx
   const calendlyUsername = 'your-username'; // your Calendly username
   ```

**Used For:**
- `/contact` page (embedded scheduling)
- "Schedule Demo" buttons throughout site

---

## 4. Sentry (Error Monitoring)

**Purpose:** Track errors and exceptions in production

### Setup:
1. Go to https://sentry.io
2. Sign up (free tier: 5000 issues/month)
3. Create project: "TechTenX" (Next.js)
4. Copy DSN from settings
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/projectid
   ```

**Monitors:**
- JavaScript errors
- Server errors
- API failures
- Performance issues

---

## 5. Auth0 (User Authentication)

**Purpose:** User login/signup with multiple auth methods

### Setup:
1. Go to https://auth0.com
2. Sign up (free tier)
3. Create application: "TechTenX Web"
4. In settings, add callback URLs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://techtenx.com/api/auth/callback`
5. Copy credentials to `.env.local`:
   ```
   AUTH0_SECRET=your_secret_here (generate random string: openssl rand -hex 32)
   AUTH0_BASE_URL=https://techtenx.com
   AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
   AUTH0_CLIENT_ID=your_client_id_here
   AUTH0_CLIENT_SECRET=your_client_secret_here
   ```

**Enables:**
- Sign up with email
- Login with Google
- Login with GitHub
- Protected dashboard pages

---

## 6. Stripe (Payment Processing)

**Purpose:** Handle subscription billing and upgrades

### Setup:
1. Go to https://stripe.com
2. Create account
3. In Dashboard, get API keys:
   - Publishable key (pk_test...)
   - Secret key (sk_test...)
4. Create products:
   - Starter ($29/month)
   - Pro ($99/month)
   - Enterprise (custom)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_test_...
   ```

**Handles:**
- Monthly subscriptions
- Plan upgrades/downgrades
- Payment confirmation
- Billing history

---

## 7. Supabase or Firebase (Database)

**Purpose:** Store users, projects, usage data

### Setup (Supabase):
1. Go to https://supabase.com
2. Create project
3. Create tables: users, projects, usage
4. Copy connection string:
   ```
   DATABASE_URL=postgresql://...
   ```

### Setup (Firebase):
1. Go to https://firebase.google.com
2. Create project
3. Get API keys from Project Settings
4. Add to `.env.local`:
   ```
   FIREBASE_API_KEY=...
   FIREBASE_PROJECT_ID=...
   ```

**Stores:**
- User profiles and preferences
- Subscription status and plan
- Created AI agents/projects
- Usage metrics

---

## 8. Environment Variables Checklist

Copy `.env.example` to `.env.local` and fill in:

```bash
# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=

# Auth
AUTH0_SECRET=
AUTH0_BASE_URL=https://techtenx.vercel.app
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Calendly
NEXT_PUBLIC_CALENDLY_USERNAME=
```

---

## 9. Deployment to Vercel

### Add Environment Variables:
1. Go to Vercel Dashboard
2. Open TechTenX project
3. Settings → Environment Variables
4. Add all variables from `.env.local`
5. Deploy (automatically redeploys with new env vars)

### Set Up Webhook (Optional):
- Stripe webhook endpoint: `https://techtenx.com/api/webhooks/stripe`
- Auth0 webhook endpoint: `https://techtenx.com/api/webhooks/auth0`

---

## 10. Testing Integrations

### Local Testing:
```bash
npm run dev
# Test each feature in http://localhost:3000
```

### Test Contact Form:
1. Go to `/contact`
2. Fill in and submit form
3. Check console for email logs
4. Verify you receive email

### Test Newsletter:
1. Go to homepage
2. Enter email and subscribe
3. Check email for welcome message

### Test Analytics:
1. Open Google Analytics dashboard
2. Go to Realtime section
3. Visit your site
4. Should see yourself as active user

### Test Auth (after Auth0 setup):
1. Add Auth0Provider to layout
2. Create login route
3. Test sign up with email
4. Verify user stored in Auth0

### Test Payments (after Stripe setup):
1. Use Stripe test cards
2. Try upgrade flow
3. Verify payment succeeds
4. Check Stripe dashboard

---

## 11. Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Resend domain verified
- [ ] Google Analytics property created
- [ ] Calendly event type configured
- [ ] Sentry project created
- [ ] Auth0 callback URLs added
- [ ] Stripe webhook endpoints added
- [ ] Database tables created
- [ ] Custom domain connected
- [ ] SSL certificate valid
- [ ] All integrations tested
- [ ] Error monitoring enabled
- [ ] Analytics tracking verified
- [ ] Backup plan documented

---

## Next Steps

1. Follow setup for each integration above
2. Add environment variables to `.env.local`
3. Test locally
4. Deploy to Vercel
5. Add environment variables to Vercel
6. Test production

For detailed setup of each service, see individual guide files:
- `DOMAIN_SETUP_GUIDE.md` - Custom domain
- `CALENDLY_SETUP_GUIDE.md` - Demo scheduling
- Individual service documentation in `.env.example`

