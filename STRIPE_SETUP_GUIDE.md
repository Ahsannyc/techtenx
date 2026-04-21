# Stripe Payment Integration Setup Guide

## Overview
Stripe handles all payment processing for TechTenX subscriptions. This guide walks through setup and testing.

## Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click **Sign up**
3. Enter your business email
4. Verify email
5. Complete business information

## Step 2: Create Products and Prices

In Stripe Dashboard:

1. Go to **Products** → **Add product**
2. Create "Starter Plan":
   - Name: `Starter`
   - Price: `$29`
   - Billing interval: **Monthly**
   - Price ID: `price_starter` (or Stripe-generated)
3. Repeat for "Pro Plan":
   - Name: `Pro`
   - Price: `$99`
   - Billing interval: **Monthly**
   - Price ID: `price_pro`
4. Copy Price IDs

## Step 3: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

## Step 4: Set Environment Variables

In `.env.local`:
```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (get from Step 5)

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `http://localhost:3000/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Click **Add endpoint**
6. Copy **Signing secret** and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 6: Update Price IDs

In `src/lib/stripe.ts`:
```typescript
export const PRODUCTS = {
  STARTER: 'price_xxxxx',  // Replace with your Stripe price ID
  PRO: 'price_xxxxx',
  ENTERPRISE: 'price_xxxxx',
};
```

Get actual Price IDs from Stripe Dashboard → Products

## Step 7: Test Locally

### Using Stripe Test Cards

Use these test card numbers (don't use real cards):

- **Visa**: `4242 4242 4242 4242`
- **Visa (debit)**: `4000 0025 0000 3155`
- **Mastercard**: `5555 5555 5555 4444`
- **Amex**: `3782 822463 10005`

All test cards use any future expiry date and any 3-digit CVC.

### Run Local Server

```bash
npm run dev
```

### Test Checkout

1. Visit: http://localhost:3000/pricing
2. Click **Upgrade to Pro**
3. Email: `test@example.com`
4. Card: `4242 4242 4242 4242`
5. Expiry: Any future date (e.g., `12/25`)
6. CVC: Any 3 digits (e.g., `123`)
7. Click **Pay**
8. Should redirect to success page

### Test Webhook Locally

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (https://stripe.com/docs/stripe-cli)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret and add to .env.local
# Then trigger a test event:
stripe trigger payment_intent.succeeded
```

## Step 8: Deploy to Vercel

1. Go to Vercel Dashboard
2. Select TechTenX project
3. Settings → Environment Variables
4. Add:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
5. Deploy

## Step 9: Update Webhook for Production

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Add new endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select same events
3. Copy signing secret and update in Vercel environment variables

## Understanding the Flow

### Checkout Flow:
1. User visits pricing page
2. Clicks "Upgrade" button
3. POST to `/api/checkout` with plan
4. API creates Stripe checkout session
5. User redirected to Stripe Checkout
6. User enters card details
7. Stripe processes payment
8. Webhook fires `checkout.session.completed`
9. User redirected to success page

### Recurring Billing:
- Stripe automatically charges user monthly
- Sends invoice 3 days before renewal
- If payment fails, retries with Dunning management
- Webhooks notify app of failures

## Webhook Events Explained

| Event | What Happens |
|-------|-------------|
| `checkout.session.completed` | Payment succeeded, subscription created |
| `invoice.payment_succeeded` | Monthly payment charged successfully |
| `invoice.payment_failed` | Payment failed (card declined, etc.) |
| `customer.subscription.updated` | Plan changed or updated |
| `customer.subscription.deleted` | Subscription canceled |

## Monitoring Payments

In Stripe Dashboard:
- **Customers**: View all customers and their subscriptions
- **Payments**: Track all transactions
- **Billing**: View invoices and disputes
- **Webhooks**: See webhook delivery history

## Common Issues

### "Invalid API Key"
- Check `STRIPE_SECRET_KEY` is correct
- Should start with `sk_test_` (local) or `sk_live_` (production)
- Regenerate if unsure

### "Webhook Signature Failed"
- Check `STRIPE_WEBHOOK_SECRET` matches
- Get from Stripe Dashboard → Webhooks → Signing secret
- Local testing: use `stripe listen` to get temporary secret

### "Invalid Price ID"
- Make sure price ID in code matches Stripe
- Get from Stripe Dashboard → Products → Click product → Copy Price ID

### Test Payment Declined
- Make sure using test card numbers
- Some test cards fail intentionally (for testing failures)

## Next Steps

1. Complete setup above
2. Test with test cards
3. Go live:
   - Switch to live API keys (`pk_live_`, `sk_live_`)
   - Update Stripe dashboard with production URLs
   - Test with real payment

## Going Live Checklist

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured for production domain
- [ ] Switched to live API keys
- [ ] Tested with real payment (small amount)
- [ ] Dunning/retry settings configured
- [ ] Tax settings configured (if needed)
- [ ] Invoice settings customized
- [ ] Customer email notifications enabled

---

For help: https://stripe.com/docs/payments/checkout
