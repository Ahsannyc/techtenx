# TechTenX API Documentation

## Overview

The TechTenX API provides endpoints for authentication, payments, forms, and webhooks.

**Base URL:** `https://techtenx.com/api` (production) or `http://localhost:3000/api` (development)

## Authentication

Most endpoints require a valid Auth0 session. The session is maintained via secure cookies.

### Authentication Flow

1. User visits `/login`
2. Redirected to Auth0 login
3. Upon success, redirected to `/api/auth/callback`
4. Session cookie is set automatically
5. Protected endpoints now accessible

## Endpoints

### Auth Endpoints

#### Login
- **URL:** `GET /auth/login`
- **Description:** Start login flow
- **Redirect:** Redirects to Auth0 login page

#### Logout
- **URL:** `GET /auth/logout`
- **Description:** Logout user and clear session
- **Redirect:** Redirects to home page

#### Callback
- **URL:** `GET /auth/callback`
- **Description:** Auth0 callback (handled automatically)
- **Internal:** Do not call directly

---

### Payment Endpoints

#### Create Checkout Session
- **URL:** `POST /checkout`
- **Authentication:** Required (Auth0 session)
- **Description:** Create a Stripe checkout session for plan upgrade

**Request Body:**
```json
{
  "plan": "starter" // "starter", "pro", or "enterprise"
}
```

**Response (200):**
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/pay/cs_test_xxxxx"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid plan"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro"}'
```

---

### Form Endpoints

#### Submit Contact Form
- **URL:** `POST /contact`
- **Authentication:** Not required
- **Description:** Submit a contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1-555-0123",
  "planInterest": "pro",
  "message": "I'd like to learn more about..."
}
```

**Validation:**
- `name`: Required, max 255 chars
- `email`: Required, valid email format
- `company`: Optional, max 255 chars
- `phone`: Optional, max 20 chars
- `planInterest`: Optional
- `message`: Required, max 5000 chars

**Response (200):**
```json
{
  "success": true,
  "message": "Thank you for reaching out"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email format"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "I have a question..."
  }'
```

---

#### Subscribe to Newsletter
- **URL:** `POST /newsletter`
- **Authentication:** Not required
- **Description:** Subscribe email to newsletter

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Validation:**
- `email`: Required, valid email format
- Email must not already be subscribed

**Response (200):**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email"
}
```

**Error Response (400):**
```json
{
  "error": "Already subscribed"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

### Webhook Endpoints

#### Stripe Webhook
- **URL:** `POST /webhooks/stripe`
- **Authentication:** Stripe signature verification
- **Description:** Receive Stripe webhook events

**Signature Verification:**

All webhooks are signed with a secret. Verify signature:

```typescript
import { stripe } from '@/lib/stripe';

const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Supported Events:**

| Event | Description | Data |
|-------|-------------|------|
| `checkout.session.completed` | Successful checkout | `{ session }` |
| `invoice.payment_succeeded` | Monthly payment successful | `{ invoice }` |
| `invoice.payment_failed` | Payment failed | `{ invoice }` |
| `customer.subscription.updated` | Subscription changed | `{ subscription }` |
| `customer.subscription.deleted` | Subscription canceled | `{ subscription }` |

**Example Event:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_xxxxx",
      "customer_email": "user@example.com",
      "payment_status": "paid",
      "amount_total": 9900
    }
  }
}
```

**Response (200):**
```json
{
  "received": true
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not allowed) |
| 404 | Not found |
| 500 | Server error |

---

## Rate Limiting

- Contact form: 5 requests per hour per IP
- Newsletter: No limit
- Checkout: No limit (Stripe limits apply)
- Webhooks: Not rate limited

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

**Examples:**

Invalid email:
```json
{
  "error": "Invalid email format"
}
```

Missing required field:
```json
{
  "error": "Name is required"
}
```

Server error:
```json
{
  "error": "Something went wrong"
}
```

---

## Testing

### Test Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test"
  }'
```

### Test Newsletter Signup
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Stripe Webhook (local)

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

## SDKs

### JavaScript/TypeScript

```typescript
// Subscribe to newsletter
const response = await fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

const data = await response.json();
console.log(data.success); // true
```

### cURL

See examples above

---

## Webhooks

To receive Stripe webhooks in development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy signing secret and add to `.env.local`

---

## Rate Limits

API has the following rate limits:

- **Contact form:** 5 requests per hour per IP
- **Newsletter:** No limit
- **Checkout:** Per Stripe limits
- **Webhooks:** Unlimited

Responses include rate limit headers:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1234567890
```

---

## Support

For API support:
- Email: api-support@techtenx.com
- GitHub Issues: https://github.com/yourusername/techtenx/issues
- Documentation: https://techtenx.com/docs

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Contact form
- Newsletter signup
- Stripe payments
- Webhooks

---

**Last Updated:** 2026-04-21
