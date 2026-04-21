# Auth0 Setup Guide for TechTenX

## Overview
Auth0 handles user authentication (login/signup) with email, Google, and GitHub connections.

## Step 1: Create Auth0 Account

1. Go to https://auth0.com
2. Sign up for a free account
3. Verify your email
4. Create a new tenant (or use default)

## Step 2: Create Application

1. Go to **Applications** → **Create Application**
2. Choose **Regular Web Applications** (for Next.js)
3. Name it: "TechTenX Web"
4. Choose **Next.js**
5. Click **Create**

## Step 3: Configure Callback URLs

1. Go to **Settings** tab
2. Find **Allowed Callback URLs** and add:
   ```
   http://localhost:3000/api/auth/callback
   https://techtenx.vercel.app/api/auth/callback
   https://yourdomain.com/api/auth/callback
   ```
3. Find **Allowed Logout URLs** and add:
   ```
   http://localhost:3000
   https://techtenx.vercel.app
   https://yourdomain.com
   ```
4. Click **Save Changes**

## Step 4: Copy Credentials

1. Stay in **Settings** tab
2. Find these values:
   - **Domain**: `xxxxx.us.auth0.com`
   - **Client ID**: `xxxxxxxxxxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (keep secret!)

## Step 5: Create Environment Variables

Create a `.env.local` file with:

```bash
# Auth0
AUTH0_SECRET=use `openssl rand -hex 32` to generate
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.us.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Generate AUTH0_SECRET

Run this in terminal:
```bash
openssl rand -hex 32
```

Copy the output and paste into `.env.local`

## Step 6: Set Up Connections (Optional)

To enable Google and GitHub login:

### Google OAuth

1. Go to **Connections** → **Social**
2. Find **Google-OAuth2**
3. Click the toggle to enable
4. For production, add your own Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Add credentials to Auth0

### GitHub

1. Go to **Connections** → **Social**
2. Find **GitHub**
3. Click the toggle to enable
4. For production, add your own GitHub OAuth app

## Step 7: Test Locally

1. Run your app:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/login

3. Click "Sign In with Auth0"

4. You should see Auth0 login page

5. Sign up with email or social provider

6. Redirects to `/api/auth/callback` then `/dashboard`

## Step 8: Deploy to Vercel

1. Go to Vercel Dashboard
2. Select TechTenX project
3. Settings → Environment Variables
4. Add all the `AUTH0_*` variables:
   ```
   AUTH0_SECRET=xxxxx
   AUTH0_BASE_URL=https://techtenx.vercel.app
   AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.us.auth0.com
   AUTH0_CLIENT_ID=xxxxx
   AUTH0_CLIENT_SECRET=xxxxx
   ```
5. Redeploy

## Step 9: Update Auth0 Callback URLs for Production

1. Go to Auth0 Dashboard
2. Go to Applications → TechTenX Web
3. Settings → Allowed Callback URLs
4. Add: `https://yourdomain.com/api/auth/callback`
5. Save

## Testing

### Local Testing
```bash
1. Visit http://localhost:3000/login
2. Click "Sign In with Auth0"
3. Create test account
4. Verify you see dashboard
5. Test logout: click "Sign Out"
```

### Production Testing
```bash
1. Visit https://techtenx.vercel.app/login
2. Repeat above steps
3. Check Auth0 dashboard for user creation
```

## Common Issues

### "Invalid URL" Error
- Make sure `AUTH0_BASE_URL` matches exactly what's in Auth0
- For localhost: `http://localhost:3000`
- For production: `https://yourdomain.com` (no trailing slash)

### Redirect Loop
- Check Allowed Callback URLs in Auth0
- Make sure URLs match exactly (http vs https, with/without trailing slash)

### "Invalid state" Error
- Clear cookies and try again
- Make sure `AUTH0_SECRET` is set
- Ensure all env vars are correct

## What's Happening

1. **Login Flow**:
   - User visits `/login`
   - Clicks "Sign In with Auth0"
   - Redirected to Auth0 login page
   - User signs in
   - Auth0 redirects to `/api/auth/callback`
   - Next.js Auth0 SDK verifies token
   - User redirected to `/dashboard`

2. **Session Management**:
   - Auth0 SDK stores session in secure cookie
   - `getSession()` retrieves user data
   - Logout clears session cookie

3. **Protected Routes**:
   - Dashboard checks for session
   - If no session, redirects to login
   - Only authenticated users see dashboard

## Next Steps

1. Follow setup above
2. Test locally
3. Deploy to Vercel
4. Add Auth0 callback URLs for production domain
5. Test on production

---

For more help: https://auth0.com/docs/get-started/applications
