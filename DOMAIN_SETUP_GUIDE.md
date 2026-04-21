# Domain Connection Setup Guide

## Domain: techtenx.com

**Status:** Ready to connect to Vercel  
**Current:** Pointing to parking/placeholder page  
**Target:** Pointing to https://techtenx.vercel.app

---

## STEP-BY-STEP SETUP

### 1. Add Domain to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select "TechTenX" project
3. Click "Settings" → "Domains"
4. Click "Add" button
5. Enter domain: **techtenx.com** (apex domain, no www)
6. Click "Continue"
7. Vercel will provide nameserver options

### 2. Check Nameserver vs CNAME Options

Vercel will show:
- **Option A: Change Nameservers** (Recommended)
  - Simpler, one-time setup
  - Vercel provides: 
    - ns1.vercel-dns.com
    - ns2.vercel-dns.com
    - ns3.vercel-dns.com  
    - ns4.vercel-dns.com

- **Option B: Add CNAME records**
  - Use if registrar doesn't support full nameserver change
  - More complex, may need to add multiple records

**Use Option A if possible** (easier to manage)

### 3. Update Nameservers at Domain Registrar

**Find Your Registrar:** Where did you buy techtenx.com?
- GoDaddy? → godaddy.com
- Namecheap? → namecheap.com
- Google Domains? → domains.google.com
- Porkbun? → porkbun.com
- Other? → Check your registration email

**Steps:**
1. Log in to your registrar account
2. Find "Manage Domain" or "DNS Settings"
3. Look for "Nameservers" section
4. Replace existing nameservers with Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
5. Save changes
6. **Wait 15-60 minutes** for DNS to propagate (sometimes up to 24 hours)

### 4. Add www Subdomain

Repeat steps above, add: **www.techtenx.com**

Vercel should auto-redirect www → apex domain

### 5. Verify in Vercel Dashboard

- Go back to Vercel Domains
- Check for green checkmark next to both domains
- Should show "Valid Configuration"

### 6. Test Live

1. Open browser
2. Visit **https://techtenx.com** → Should load TechTenX site
3. Visit **https://www.techtenx.com** → Should load TechTenX site
4. Should see SSL lock (green) in browser address bar

### 7. Troubleshooting

**Domain shows "Invalid Configuration":**
- Wait a bit longer (DNS propagation can take time)
- Clear browser cache
- Try incognito/private window
- Check nameservers were saved correctly at registrar

**Still parking page after 1 hour:**
- Verify nameservers are correct (check registrar)
- Check Vercel is showing the domain as connected
- Contact Vercel support if issue persists

**HTTPS not working (shows warning):**
- SSL certificate auto-generates, may take 15-30 min
- Refresh after waiting
- May need to re-add domain in Vercel

---

## Registrar-Specific Instructions

### If using GoDaddy:
1. Log in to godaddy.com
2. Go to "My Products" → Your domain
3. Click "Manage DNS"
4. Delete existing nameservers
5. Add Vercel's 4 nameservers
6. Save

### If using Namecheap:
1. Log in to namecheap.com
2. Go to "Domain List"
3. Click "Manage" next to techtenx.com
4. Click "Nameservers" tab
5. Select "Custom Nameservers"
6. Add Vercel's 4 nameservers
7. Save

### If using Google Domains:
1. Go to domains.google.com
2. Select your domain
3. Click "DNS" on left
4. Click "Custom Nameservers"
5. Add Vercel's nameservers
6. Save

### If using other registrar:
- Look for "DNS Management", "Nameservers", or "Domain Settings"
- Find the option to change nameservers
- Replace with Vercel's
- Save

---

## Expected Outcome

After successful connection:
- ✅ techtenx.com loads TechTenX site
- ✅ www.techtenx.com loads TechTenX site
- ✅ Green SSL lock in browser
- ✅ Vercel dashboard shows domain as connected
- ✅ Remove parking page forever
- ✅ Professional branding established

---

**Status:** ⏳ AWAITING MANUAL SETUP AT REGISTRAR

**Next:** Once domain is connected, proceed to Step 17 (Calendly Integration)

