# Testing & QA Guide for TechTenX

## Overview

This guide covers all testing and quality assurance procedures for TechTenX before production launch.

## Testing Levels

### 1. Unit Testing
Test individual functions and components in isolation.

### 2. Integration Testing
Test multiple components working together.

### 3. End-to-End Testing
Test complete user flows from start to finish.

### 4. Performance Testing
Test site speed, load times, and optimization.

### 5. Security Testing
Test for vulnerabilities and security issues.

## Functional Testing Checklist

### Authentication (Auth0)

- [ ] User can sign up with email
- [ ] User can log in with email
- [ ] User can log in with Google
- [ ] User can log in with GitHub
- [ ] User can log out
- [ ] Session persists across page reloads
- [ ] User redirected to login when accessing protected page
- [ ] Logout clears session
- [ ] Auth0 error handling works
- [ ] 2FA setup works (if enabled)

### Dashboard & User Pages

- [ ] User can view dashboard
- [ ] User can view projects page
- [ ] User can view billing page
- [ ] User can view account settings
- [ ] User can update profile information
- [ ] User can change password
- [ ] User can manage payment methods
- [ ] User can upgrade plan
- [ ] User can downgrade plan
- [ ] User can cancel subscription

### Forms

#### Contact Form
- [ ] All fields are present (name, email, company, phone, message)
- [ ] Form validation works (email format, required fields)
- [ ] Form can be submitted
- [ ] Submission sends email to admin
- [ ] User receives confirmation email
- [ ] Success message is displayed
- [ ] Error handling works
- [ ] Rate limiting works

#### Newsletter Signup
- [ ] Email input appears on homepage
- [ ] Email input appears on blog page
- [ ] Valid email can be submitted
- [ ] Invalid email shows error
- [ ] Already subscribed error shows
- [ ] Success message displays
- [ ] Confirmation email is sent
- [ ] User is added to email list

### Payments (Stripe)

**Setup:**
- [ ] Stripe account configured
- [ ] Test cards ready
- [ ] Webhook configured locally

**Checkout Flow:**
- [ ] Pricing page shows all plans
- [ ] Upgrade button works on each plan
- [ ] Redirects to Stripe checkout
- [ ] Checkout shows correct amount
- [ ] Test card accepted
- [ ] Payment processes successfully
- [ ] User redirected to success page
- [ ] User plan updated in system
- [ ] Confirmation email sent
- [ ] Invoice created in Stripe

**Recurring Billing:**
- [ ] Monthly charge occurs on schedule
- [ ] Invoice sent on payment date
- [ ] Failed payment has retry logic
- [ ] Customer can view billing history
- [ ] Customer can update payment method
- [ ] Webhook fires for payment_succeeded
- [ ] Webhook fires for payment_failed
- [ ] Subscription can be canceled

### Admin Features

- [ ] Admin can access admin dashboard
- [ ] Non-admin cannot access admin
- [ ] Admin can view all users
- [ ] Admin can view user details
- [ ] Admin can view revenue metrics
- [ ] Admin can view transactions
- [ ] Admin can suspend user account
- [ ] Admin can process refunds
- [ ] Admin can view system health

### Pages

**Homepage:**
- [ ] Hero section loads
- [ ] Services section visible
- [ ] Testimonials section visible
- [ ] Newsletter signup works
- [ ] CTA buttons work
- [ ] Footer links work

**Pricing:**
- [ ] All plans visible
- [ ] Pricing correct
- [ ] Features listed
- [ ] FAQ visible
- [ ] Upgrade buttons work

**Blog:**
- [ ] Blog list loads
- [ ] Featured post visible
- [ ] Posts can be clicked
- [ ] Post pages load
- [ ] Newsletter signup visible
- [ ] Previous/next navigation works
- [ ] Search works (if implemented)

**Contact:**
- [ ] Contact form visible
- [ ] Calendly widget visible
- [ ] Form submission works
- [ ] Map visible (if included)

### Navigation

- [ ] Navigation bar visible on all pages
- [ ] Links work correctly
- [ ] Mobile menu works
- [ ] Active link highlighted
- [ ] Responsive on mobile

### Responsive Design

**Desktop (1920x1080):**
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Spacing looks good
- [ ] Images load correctly

**Tablet (768x1024):**
- [ ] Content is readable
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Images scale correctly

**Mobile (375x667):**
- [ ] Content is readable
- [ ] No horizontal scroll
- [ ] Navigation is accessible
- [ ] Buttons are clickable
- [ ] Forms are usable

### Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Testing

### Core Web Vitals

Using https://pagespeed.web.dev/:

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Load Testing

Using https://www.webpagetest.com/:

- [ ] Homepage loads in < 3s
- [ ] Dashboard loads in < 2s
- [ ] Blog loads in < 2.5s

### Image Optimization

- [ ] Images use next/image
- [ ] Images have width/height
- [ ] Images are properly sized
- [ ] WebP format used where supported

### CSS/JS Optimization

- [ ] No unused CSS
- [ ] CSS is minified
- [ ] JavaScript is code-split
- [ ] Tailwind CSS optimized
- [ ] GSAP animations smooth

## Security Testing

### Authentication Security

- [ ] Session tokens are secure
- [ ] Cookies are HttpOnly
- [ ] Cookies are Secure
- [ ] CSRF protection enabled
- [ ] Password hashing used
- [ ] Rate limiting on login

### API Security

- [ ] API keys not exposed in frontend
- [ ] Stripe keys properly protected
- [ ] Webhook signature verified
- [ ] Input validation on all endpoints
- [ ] SQL injection prevented
- [ ] XSS protection enabled

### Data Security

- [ ] User data encrypted at rest
- [ ] Data encrypted in transit (HTTPS)
- [ ] Sensitive fields redacted in logs
- [ ] PII not logged
- [ ] GDPR compliance checked

### Infrastructure

- [ ] HTTPS enforced everywhere
- [ ] CSP headers set
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy set
- [ ] CORS properly configured

## Email Testing

### Contact Form Email

- [ ] Admin receives notification email
- [ ] Email contains all form fields
- [ ] Email is properly formatted
- [ ] User receives confirmation email

### Newsletter Email

- [ ] Welcome email sent
- [ ] Email formatted correctly
- [ ] Unsubscribe link present
- [ ] Email not sent twice
- [ ] Email reaches inbox (not spam)

## Stripe Webhook Testing

### Local Testing

```bash
# Terminal 1
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2
stripe trigger payment_intent.succeeded

# Check if webhook processed
```

### Events to Test

- [ ] checkout.session.completed
- [ ] invoice.payment_succeeded
- [ ] invoice.payment_failed
- [ ] customer.subscription.updated
- [ ] customer.subscription.deleted

## Deployment Testing

### Before Deploy to Vercel

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors in dev
- [ ] No console errors in production build
- [ ] Environment variables set
- [ ] All secrets configured

### After Deploy to Vercel

- [ ] Site is accessible
- [ ] All pages load
- [ ] API endpoints work
- [ ] Auth0 callback works
- [ ] Stripe webhook works
- [ ] Email sending works
- [ ] Analytics tracking works
- [ ] Error monitoring works

## Automated Testing

### Setup Jest Testing

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npx jest --init
```

### Example Tests

```typescript
// src/__tests__/utils.test.ts
import { canAccessFeature } from '@/lib/features';

describe('Feature Flags', () => {
  test('Pro users can access API', () => {
    expect(canAccessFeature('API_ACCESS', 'pro')).toBe(true);
  });

  test('Free users cannot access API', () => {
    expect(canAccessFeature('API_ACCESS', 'free')).toBe(false);
  });
});
```

### Run Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage
npm test -- --watch         # Watch mode
```

## Manual Testing Checklist

### Sign-Up Flow

1. [ ] Go to https://techtenx.com
2. [ ] Click "Get Started"
3. [ ] Click "Sign Up with Auth0"
4. [ ] Create account with email
5. [ ] Verify email
6. [ ] Land on dashboard
7. [ ] User profile shows correct info

### Upgrade Flow

1. [ ] Go to /pricing
2. [ ] Select "Pro" plan
3. [ ] Click "Upgrade"
4. [ ] Enter test card: 4242 4242 4242 4242
5. [ ] Expiry: 12/25, CVC: 123
6. [ ] Payment succeeds
7. [ ] Redirected to success page
8. [ ] Dashboard shows "Pro" plan

### Contact Form Flow

1. [ ] Go to /contact
2. [ ] Fill form with test data
3. [ ] Submit
4. [ ] See success message
5. [ ] Check email for confirmation
6. [ ] Admin receives notification

### Newsletter Flow

1. [ ] Go to homepage
2. [ ] Scroll to newsletter section
3. [ ] Enter email
4. [ ] Click subscribe
5. [ ] See success message
6. [ ] Check email for welcome message

## QA Checklist for Launch

### Functionality
- [ ] All pages load without errors
- [ ] All forms work
- [ ] All links work
- [ ] All buttons work
- [ ] All animations work
- [ ] All integrations work

### Performance
- [ ] Site loads under 3 seconds
- [ ] No performance warnings
- [ ] Images optimized
- [ ] Code splitting works
- [ ] No memory leaks

### Security
- [ ] HTTPS enforced
- [ ] Secrets not exposed
- [ ] Input validation works
- [ ] Rate limiting works
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities

### Compatibility
- [ ] Works on major browsers
- [ ] Works on mobile devices
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Keyboard navigation works

### Content
- [ ] All text is correct
- [ ] No typos
- [ ] All images present
- [ ] All videos work
- [ ] Links to correct pages

### Analytics
- [ ] Google Analytics tracking
- [ ] Events logged correctly
- [ ] Conversion tracking works
- [ ] Error tracking works

### Monitoring
- [ ] Error monitoring enabled
- [ ] Error alerts configured
- [ ] Status page set up
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring enabled

## Test Results Template

```
Test Run: 2026-04-21 10:30 AM
Tester: [Name]
Build: [Commit Hash]
Environment: [Staging/Production]

Total Tests: XX
Passed: XX
Failed: 0
Blocked: 0

Critical Issues: 0
High Priority: 0
Medium Priority: 0
Low Priority: 0

Sign-off: ___________
Date: __________
```

## Bug Report Template

```
Title: [Short description]
Severity: [Critical/High/Medium/Low]
Component: [Page/Feature]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots: [Attach]
Environment: [Browser, OS, etc.]
Assigned To: [Person]
```

## Launch Criteria

Before going live:

- [ ] All critical issues resolved
- [ ] All high priority issues resolved
- [ ] Performance is acceptable
- [ ] Security review passed
- [ ] All integrations tested
- [ ] Team sign-off obtained
- [ ] Go-live plan documented
- [ ] Rollback plan documented

---

See DEVELOPER_GUIDE.md for setup instructions.
