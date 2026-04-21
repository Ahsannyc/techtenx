# Calendly Integration Setup Guide

## Step-by-Step Setup

### 1. Create Calendly Account

1. Go to https://calendly.com
2. Sign up (free tier)
3. Verify email
4. Set up your profile

### 2. Create "Product Demo" Event Type

1. Log in to Calendly
2. Click "Event Types" in left menu
3. Click "+ New Event Type"
4. Configure:
   - **Name:** Product Demo
   - **Duration:** 30 minutes
   - **Description:** "See TechTenX in action and discuss your specific needs"
   - **Event Type:** One-on-one
5. Go to "Availability" tab:
   - Set your timezone
   - Set working hours (e.g., 9 AM - 5 PM, weekdays)
   - Add 15-min buffer between meetings
6. Go to "Invitee Questions" tab:
   - Add optional question: "What's your main use case?"
   - Add optional question: "What plan are you interested in?"
7. Click "Save" when done

### 3. Get Embed Code

1. Go to "Sharing" tab
2. Click "Copy embed code"
3. Code will look like:
   ```html
   <iframe src="https://calendly.com/YOUR-USERNAME/product-demo?hide_event_type_details=1&hide_gdpr_banner=1" width="320" height="630" frameborder="0"></iframe>
   ```

### 4. Create Calendly Component in TechTenX

Create new file: `src/components/CalendlyEmbed.tsx`

```tsx
'use client';

export default function CalendlyEmbed() {
  return (
    <iframe
      src="https://calendly.com/YOUR-USERNAME/product-demo?hide_event_type_details=1&hide_gdpr_banner=1"
      width="100%"
      height="600"
      frameBorder="0"
      title="Schedule a demo"
      style={{ borderRadius: '8px' }}
    />
  );
}
```

**Replace `YOUR-USERNAME` with your Calendly username**

### 5. Update Contact Page

In `src/app/contact/page.tsx`, replace the placeholder with:

```tsx
import CalendlyEmbed from '@/components/CalendlyEmbed';

// Then in the JSX:
<div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8 min-h-96">
  <CalendlyEmbed />
</div>
```

### 6. Add Calendly Link to CTAs

Add booking link to "Schedule Demo" buttons throughout site:
```tsx
<a href="https://calendly.com/YOUR-USERNAME/product-demo" target="_blank" rel="noopener noreferrer">
  Schedule Demo
</a>
```

### 7. Configure Notifications

1. In Calendly settings
2. Click "Notifications" 
3. Enable:
   - Email reminder to you (when someone books)
   - Email confirmation to invitee

### 8. Test It

1. Go to `/contact` page locally or on Vercel
2. See Calendly widget
3. Try to book a demo
4. Verify calendar synced (check your Google Calendar, Outlook, etc.)
5. Confirm you received notification email

---

## Verification Checklist

- [ ] Calendly account created
- [ ] "Product Demo" event type configured
- [ ] Embed code copied
- [ ] CalendlyEmbed component created
- [ ] Contact page updated
- [ ] Calendly buttons added to CTAs
- [ ] Test booking works
- [ ] You received notification
- [ ] Attendee received confirmation

---

## Troubleshooting

**Embed not showing?**
- Check iframe height (should be 600px minimum)
- Verify Calendly username is correct
- Check browser console for errors

**Bookings not showing in calendar?**
- Verify calendar is connected in Calendly settings
- Calendly → Settings → Connected Calendars
- Click "Connect" next to your calendar service

**Not receiving notifications?**
- Check Calendly notification settings
- Check spam folder for emails
- Verify email address is correct

---

## Next: Setup Email Service (Step 18)

Once Calendly is working, next step is integrating email notifications for contact form submissions.

