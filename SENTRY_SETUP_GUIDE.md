# Sentry Error Monitoring Setup Guide

## Overview
Sentry tracks errors in production and sends real-time alerts when issues occur. This guide walks through the setup process.

## Step 1: Create Sentry Account & Project

1. Go to https://sentry.io
2. Sign up (free tier: 5,000 issues/month)
3. Create a new organization: "TechTenX"
4. Create a project: "techtenx-web"
   - Platform: Next.js
5. You'll get a DSN like: `https://key@sentry.io/projectid`

## Step 2: Get Auth Token for Source Maps

1. Go to Account Settings → Auth Tokens
2. Create a new token with permissions:
   - `project:read`
   - `project:releases`
   - `org:read`
3. Copy the token (save securely)

## Step 3: Configure Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/projectid
SENTRY_AUTH_TOKEN=sntrys_xxxxx
```

The `SENTRY_AUTH_TOKEN` is used during build time to upload source maps.

## Step 4: Configure in Vercel

1. Go to Vercel Dashboard → TechTenX project
2. Settings → Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/projectid
   SENTRY_AUTH_TOKEN=sntrys_xxxxx
   ```
4. Deploy (automatically uploads source maps)

## Step 5: Verify Setup

1. Go to Sentry dashboard
2. Create a test error by visiting:
   ```
   http://localhost:3000/?test-error=true
   ```
   (Not yet implemented, but for manual testing after deploy)

3. Check Sentry Issues page for captured errors

## Error Tracking Features

- **JavaScript Errors**: Caught automatically by Sentry
- **Server Errors**: API route errors logged automatically
- **Error Context**: Includes user, page, browser info
- **Source Maps**: Maps minified code to original source
- **Replay**: Video replay of user session before error (on error sample rate)

## Testing in Production

After deploying to Vercel:

1. Visit your production URL
2. Open browser console and trigger an error:
   ```javascript
   throw new Error('Test error from console');
   ```
3. Wait a few seconds
4. Check Sentry Issues dashboard
5. Should see the error with full stack trace

## Alert Configuration (Optional)

In Sentry dashboard:
1. Alerts → Create Alert Rule
2. Set conditions:
   - When: issue is created / error count exceeds threshold
   - Then: notify via Email / Slack
3. Save

## Troubleshooting

### Source Maps Not Uploading
- Ensure `SENTRY_AUTH_TOKEN` is set in Vercel
- Check Sentry Release page for upload logs
- Re-deploy to trigger upload

### Errors Not Appearing
- Check DSN is correct in `.env.local`
- Verify environment variable in Vercel
- Check browser console for Sentry SDK errors
- Ensure `NEXT_PUBLIC_SENTRY_DSN` is public (NEXT_PUBLIC_ prefix)

### Too Many Errors
- Adjust `tracesSampleRate` in config (0-1.0)
- Set up Alert Rules instead of logging everything
- Use filters to ignore certain error types

## Best Practices

1. **Don't Log Sensitive Data**: Sentry captures user data; don't log passwords, tokens, PII
2. **Use Error Context**: Add breadcrumbs and context when catching errors
3. **Monitor Carefully**: Too many alerts become noise; use rules and thresholds
4. **Review Weekly**: Check Sentry dashboard weekly to catch new issues
5. **Version Tracking**: Set release version for better tracking

## NextSteps

After Sentry is set up:
1. Move to Step 22: Create Real Blog Posts
2. Step 23: User Authentication (Auth0)
3. Step 24: Build User Dashboard

---

For more info: https://docs.sentry.io/platforms/javascript/guides/nextjs/
