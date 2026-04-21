# TechTenX Implementation Steps — Detailed Build Guide

**Objective:** Build all missing features in logical, sequential steps.
**Timeline:** 1 feature per session (each takes 20-45 minutes)
**Progress:** Track completion as we go

---

## 🎯 Master Feature List (In Priority Order)

| Step | Feature | Page/Component | Difficulty | Est. Time | Status |
|------|---------|---|---|---|---|
| 1 | **Pricing Page** | `/pricing` | ⭐⭐ Easy | 20 min | ⏳ |
| 2 | **Interactive AI Demo** | Homepage Hero | ⭐⭐⭐ Medium | 30 min | ⏳ |
| 3 | **For Individuals Page** | `/for-individuals` | ⭐⭐ Easy | 25 min | ⏳ |
| 4 | **For Business Page** | `/for-business` | ⭐⭐ Easy | 25 min | ⏳ |
| 5 | **Use Cases / Case Studies** | `/use-cases` | ⭐⭐ Easy | 20 min | ⏳ |
| 6 | **AI Agents Service Page** | `/services/agents` | ⭐⭐ Easy | 20 min | ⏳ |
| 7 | **Automation Service Page** | `/services/automation` | ⭐⭐ Easy | 20 min | ⏳ |
| 8 | **Websites Service Page** | `/services/websites` | ⭐⭐ Easy | 20 min | ⏳ |
| 9 | **Contact Form + Calendly** | `/contact` + Widget | ⭐⭐⭐ Medium | 30 min | ⏳ |
| 10 | **Testimonials Section** | Homepage + `/testimonials` | ⭐⭐ Easy | 20 min | ⏳ |
| 11 | **Blog / Resources** | `/blog` + Posts | ⭐⭐⭐ Medium | 40 min | ⏳ |
| 12 | **Smooth Animations** | Global | ⭐⭐⭐⭐ Hard | 45 min | ⏳ |
| 13 | **Mobile Polish** | Global | ⭐ Very Easy | 15 min | ⏳ |
| 14 | **SEO & Meta Tags** | Global | ⭐⭐ Easy | 20 min | ⏳ |
| 15 | **Dark/Light Mode Toggle** | Global | ⭐⭐⭐ Medium | 25 min | ⏳ |

**Total Estimated Time:** ~7 hours (can be done over multiple sessions)

---

## STEP 1: Build Pricing Page (`/pricing`)

### 📋 Detailed Prompt

**What to Build:**
Create a new page at `/pricing` that shows three pricing tiers (Starter, Pro, Enterprise) with clear features, pricing, and CTAs.

**Design Requirements:**
- Dark theme matching homepage (black background, blue/purple gradients)
- Three pricing cards in a grid layout
- Show monthly price, number of users/agents, features list, CTA button
- Highlight "Pro" as most popular (badge + different styling)
- Mobile responsive

**Content Structure:**
```
Hero Section:
- Headline: "Simple, Transparent Pricing"
- Subheadline: "Choose the plan that fits your needs"

Pricing Cards (3):
1. STARTER — $29/month
   - Up to 3 AI Agents
   - Email automation
   - Basic website builder
   - 5 automations
   - Community support
   - [Start Free Button]

2. PRO (Most Popular) — $99/month
   - Unlimited AI Agents
   - Advanced automation workflows
   - Custom website builder
   - 50 automations
   - Priority email support
   - [Start Free Button]

3. ENTERPRISE — Custom Pricing
   - Everything in Pro +
   - Custom multi-agent systems
   - Dedicated account manager
   - White-label options
   - SLA & 99.9% uptime
   - [Schedule Demo Button]

FAQ Section:
- 3-4 common questions (Can I change plans? Is there a free trial? etc.)
```

**Technical Details:**
- Create new file: `app/pricing/page.tsx`
- Use Tailwind CSS for styling
- Reuse navbar and footer from homepage
- Make "Pro" card stand out (larger, different border/shadow)

**Acceptance Criteria:**
- ✅ Page loads at `/pricing`
- ✅ Three cards display correctly on desktop and mobile
- ✅ "Pro" card is visually highlighted as "Most Popular"
- ✅ All buttons are clickable (they can link to `/contact` for now)
- ✅ Responsive on mobile (cards stack vertically)

---

## STEP 2: Add Interactive AI Demo (Homepage Enhancement)

### 📋 Detailed Prompt

**What to Build:**
Add an interactive chat demo in the hero section where users can describe their need and see an AI-suggested solution.

**Design Requirements:**
- Replace "Watch 1-min Demo" button with interactive demo
- Simple chat interface in a modal/popup
- User types a question → Shows AI response
- Smooth animations when demo opens/closes

**Example Interaction:**
```
User types: "I need to automate my email triage"

AI Response: "Great! I recommend:
✓ AI Agent: Email Classifier
✓ Workflow: Auto-tag & route emails
✓ Website: Showcase automation on your site
👉 Ready to build? Start Free or Schedule Demo"
```

**Pre-set Responses (Mock Data):**
1. "automate email" → Email automation suggestion
2. "build a website" → Website builder suggestion
3. "customer support" → AI chatbot suggestion
4. "sales forecast" → Business analytics suggestion
5. Default → General AI assistant suggestion

**Technical Details:**
- Create component: `components/AIDemo.tsx`
- Use state (React `useState`) for chat messages
- Mock responses (no real API needed for MVP)
- Smooth animations (fade-in/out)
- Keyboard support (Enter to send)

**Acceptance Criteria:**
- ✅ Demo button opens a chat interface
- ✅ User can type a message and hit Enter
- ✅ AI gives a contextual response based on keywords
- ✅ Responses show relevant suggestions
- ✅ Demo closes smoothly when user clicks "X"
- ✅ Mobile responsive

---

## STEP 3: Build "For Individuals" Page

### 📋 Detailed Prompt

**What to Build:**
Create `/for-individuals` page with use cases tailored to personal productivity and everyday AI use.

**Design Requirements:**
- Dark theme matching homepage
- Hero section with headline
- Use case cards (4-6 cards showing personal AI applications)
- Benefits section
- Call-to-action to pricing or contact

**Content Structure:**
```
Hero:
- Headline: "AI Made Personal — For Individuals Like You"
- Subheadline: "Automate your daily life, boost productivity, achieve more"

Use Cases (Cards):
1. Email Triage Assistant
   - Icon: ✉️
   - Desc: "AI automatically sorts, tags, and prioritizes emails"
   - Benefit: "Saves 5 hrs/week"

2. Social Media Automation
   - Icon: 📱
   - Desc: "Schedule and auto-post to Twitter, LinkedIn, Instagram"
   - Benefit: "Stay active without the grind"

3. Personal Learning Coach
   - Icon: 📚
   - Desc: "AI curates articles, summarizes research, creates study guides"
   - Benefit: "Learn faster, retain more"

4. Expense & Budget Tracker
   - Icon: 💰
   - Desc: "AI categorizes spending, suggests savings, tracks goals"
   - Benefit: "Financial clarity in minutes"

5. Content Creator Assistant
   - Icon: ✍️
   - Desc: "AI generates ideas, outlines, first drafts for blogs/newsletters"
   - Benefit: "Write 3x faster"

6. Habit Tracker & Coach
   - Icon: 🎯
   - Desc: "AI monitors habits, sends reminders, celebrates wins"
   - Benefit: "Build habits that stick"

Benefits Section:
- No coding required
- Start free, upgrade anytime
- Works with your favorite tools
- Privacy first (your data stays yours)

CTA: "Start Your Free AI Assistant" → `/pricing`
```

**Technical Details:**
- Create file: `app/for-individuals/page.tsx`
- Reuse card components from homepage
- Make cards hoverable with animations
- Include icons (use emojis or simple SVG)

**Acceptance Criteria:**
- ✅ Page loads at `/for-individuals`
- ✅ Hero section displays correctly
- ✅ 6 use case cards display in 2x3 or 3x2 grid (responsive)
- ✅ Cards have hover effects
- ✅ CTA button links to `/pricing`
- ✅ Mobile responsive

---

## STEP 4: Build "For Business" Page

### 📋 Detailed Prompt

**What to Build:**
Create `/for-business` page with enterprise-focused use cases and benefits.

**Design Requirements:**
- Dark theme matching homepage
- Hero section highlighting business ROI
- Use case cards (4-6 enterprise scenarios)
- Enterprise features section
- Case study preview or testimonial
- CTA to schedule demo

**Content Structure:**
```
Hero:
- Headline: "Enterprise AI Automation — Scale Without Hiring"
- Subheadline: "From customer support to sales forecasting: AI agents that work 24/7"
- Badge: "Used by 100+ growing companies"

Use Cases (Cards):
1. AI Customer Support Agent
   - Icon: 🎧
   - Desc: "Handles 80% of support tickets automatically"
   - ROI: "Save $50K+/year on support staff"

2. Sales Forecasting & Pipeline
   - Icon: 📊
   - Desc: "AI predicts deal closure rates and recommends actions"
   - ROI: "Increase win rate by 15%"

3. Lead Qualification & Routing
   - Icon: 🎯
   - Desc: "AI scores leads and routes to best sales rep"
   - ROI: "Close 2x more deals with same team"

4. Content Generation at Scale
   - Icon: 📝
   - Desc: "AI creates product descriptions, marketing copy, emails"
   - ROI: "Launch 10x more content in half the time"

5. Invoice & Document Processing
   - Icon: 📄
   - Desc: "AI extracts data, validates, and auto-files documents"
   - ROI: "Eliminate 100 manual hours/month"

6. Inventory & Supply Chain Optimization
   - Icon: 📦
   - Desc: "AI predicts demand, optimizes stock, alerts on anomalies"
   - ROI: "Reduce overstock by 30%"

Enterprise Features:
✓ Multi-agent orchestration (agents working together)
✓ Custom AI training (fine-tune on your data)
✓ White-label options (rebrand as your own)
✓ SSO & enterprise security (GDPR, SOC2)
✓ Dedicated account manager
✓ SLA & 99.9% uptime guarantee

Testimonial Preview:
"TechTenX automated our customer support. Now we handle 5x more tickets with same team."
— Sarah Chen, VP Operations, TechCorp

CTA: "Schedule Enterprise Demo" → `/contact`
```

**Technical Details:**
- Create file: `app/for-business/page.tsx`
- Similar structure to For Individuals page
- Emphasize ROI and scale
- Add testimonial card
- Use professional icons/emojis

**Acceptance Criteria:**
- ✅ Page loads at `/for-business`
- ✅ Hero with enterprise messaging
- ✅ 6 use case cards with ROI metrics
- ✅ Enterprise features list is clear
- ✅ Testimonial displays with styling
- ✅ CTA links to `/contact`
- ✅ Mobile responsive

---

## STEP 5: Build Use Cases / Case Studies Page

### 📋 Detailed Prompt

**What to Build:**
Create `/use-cases` page showcasing real-world success stories (mock data for MVP).

**Design Requirements:**
- Dark theme matching brand
- Hero section
- Case study cards (4-6 stories)
- Each card shows: company, challenge, solution, results, testimonial
- Downloadable case study (mock PDF)

**Content Structure:**
```
Hero:
- Headline: "See TechTenX In Action"
- Subheadline: "Real businesses, real results"

Case Studies (Cards):

1. E-Commerce Store
   Company: "ShopHub"
   Challenge: "Manual product descriptions took 40 hours/month"
   Solution: "AI-powered content generator + website builder"
   Results:
     • 95% reduction in description writing time
     • Launched 1,000 new products in 2 weeks
     • 25% increase in conversion rate
   Quote: "TechTenX transformed our product page creation."
   — John Malik, CEO ShopHub

2. Startup (Solopreneur)
   Company: "IndieAI" (one-person company)
   Challenge: "No time for social media, customer emails, content"
   Solution: "Personal AI assistant + email automation"
   Results:
     • 20 hours/week saved
     • 10x social media presence
     • Built personal brand with AI help
   Quote: "I feel like I have a team now. This is a game-changer for solopreneurs."
   — Alex Rivera, Founder IndieAI

3. Corporate (Mid-Market)
   Company: "SalesCorp"
   Challenge: "Customer support costs rising, response times slow"
   Solution: "AI customer support agent + knowledge base"
   Results:
     • 70% of tickets resolved without human
     • 5min avg response time (was 2 hours)
     • $200K annual savings
   Quote: "Our support team actually has time to think now."
   — Lisa Wong, Support Director SalesCorp

4. Agency
   Company: "CreativeStudio"
   Challenge: "Building custom websites took 3-4 weeks per project"
   Solution: "AI website builder + custom integration"
   Results:
     • Launched 5x more projects per year
     • 60% faster turnaround
     • Higher profit margins
   Quote: "We tripled our capacity without hiring."
   — Marcus Brown, Founder CreativeStudio

5. Non-Profit
   Company: "HelpOrg"
   Challenge: "Limited budget, lots of manual donor emails"
   Solution: "Email automation + personalization AI"
   Results:
     • 40% increase in donor retention
     • 2 staff hours freed up daily
     • $50K additional annual donations
   Quote: "We can focus on our mission, not admin."
   — Emily Park, Director HelpOrg

6. Service Business
   Company: "ConsultHub"
   Challenge: "Lead qualification and follow-up was chaotic"
   Solution: "AI lead scorer + automated nurture workflows"
   Results:
     • 3x more qualified leads
     • Increased close rate by 40%
     • $150K additional annual revenue
   Quote: "This system finds our best customers automatically."
   — David Kim, CEO ConsultHub

CTA at bottom: "Ready for your success story? Start Free" → `/pricing`
```

**Technical Details:**
- Create file: `app/use-cases/page.tsx`
- Create reusable component: `components/CaseStudyCard.tsx`
- Use grid layout for cards
- Each card includes: logo placeholder, company name, metrics, quote

**Acceptance Criteria:**
- ✅ Page loads at `/use-cases`
- ✅ 6 case study cards display in responsive grid
- ✅ Each card shows clear challenge → solution → results
- ✅ Testimonial quote is visible
- ✅ Metrics are prominent (ROI, time saved, etc.)
- ✅ Cards are clickable/hoverable
- ✅ Mobile responsive
- ✅ CTA button at bottom links to `/pricing`

---

## STEP 6-8: Build Service Pages (/services/agents, /automation, /websites)

### 📋 Detailed Prompt (All 3 are similar structure)

**What to Build:**
Create three deep-dive service pages:
- `/services/agents` — AI Agents & Assistants
- `/services/automation` — Automation Workflows
- `/services/websites` — AI-Powered Websites

**General Structure (Repeat for each):**

```
Hero:
- Service name (e.g., "AI Agents & Assistants")
- Bold description
- CTA: "Start Building" or "See Examples"

What It Is (Explainer Section):
- Simple explanation of what this service does
- 2-3 key benefits
- Use case icon/imagery

How It Works (Step-by-Step):
Step 1: Define Your Need
  "Describe what you want automated"
Step 2: AI Plans the Agent
  "AI suggests tools, workflows, integrations"
Step 3: Deploy & Monitor
  "Agent runs 24/7, you monitor results"

Features (Checklist):
✓ Feature 1
✓ Feature 2
✓ Feature 3
✓ Feature 4
✓ Feature 5

Use Cases (Cards with examples):
- Real-world examples specific to this service

Pricing & Next Steps:
- "Starting at $29/month" with link to `/pricing`
- "Schedule Demo" with link to `/contact`

FAQ:
- 3-4 common questions
```

**Service-Specific Content:**

### **STEP 6: `/services/agents`**
- What: "AI Agents that work 24/7 for you"
- Features: Email agent, customer support bot, sales agent, etc.
- How It Works: (custom agents designed for your needs)
- Use Cases: Customer support, email triage, lead qualification, scheduling

### **STEP 7: `/services/automation`**
- What: "Workflow automation (no-code + custom)"
- Features: Zapier integration, custom logic, multi-step workflows, monitoring
- How It Works: (design workflow → deploy → monitor)
- Use Cases: Social media posting, expense tracking, data syncing, notifications

### **STEP 8: `/services/websites`**
- What: "AI-Powered websites (generated or custom)"
- Features: AI website builder, custom dev, e-commerce, AI SEO, hosting
- How It Works: (prompt → AI generates → customize → deploy)
- Use Cases: Landing pages, portfolios, e-commerce, content sites

**Technical Details:**
- Create files:
  - `app/services/agents/page.tsx`
  - `app/services/automation/page.tsx`
  - `app/services/websites/page.tsx`
- Reuse components from homepage
- Each page should follow same visual structure for consistency

**Acceptance Criteria (for each):**
- ✅ Page loads at `/services/[service]`
- ✅ Hero section is compelling
- ✅ "How It Works" steps are clear and visual
- ✅ Features list is comprehensive
- ✅ 3-5 use case cards display
- ✅ FAQ section has 3+ questions answered
- ✅ CTAs link to `/pricing` and `/contact`
- ✅ Mobile responsive

---

## STEP 9: Build Contact Page + Lead Capture

### 📋 Detailed Prompt

**What to Build:**
Create `/contact` page with contact form + Calendly embed for demo scheduling.

**Design Requirements:**
- Dark theme
- Hero section with headline
- Two-column layout: (Contact form) | (Calendly calendar)
- Mobile responsive (stacks vertically)
- Success message after form submit

**Content Structure:**
```
Hero:
- Headline: "Let's Build Your AI Future"
- Subheadline: "Schedule a demo, ask questions, or start building"

Two-Column Section:
LEFT COLUMN: Contact Form
  Fields:
  - Name (text input, required)
  - Email (email input, required)
  - Company (text input, optional)
  - Message (textarea, required)
  - Phone (tel input, optional)
  - Plan Interest (dropdown: "Starter", "Pro", "Enterprise", "Not Sure")
  
  [Send Message Button]
  
  Success Message (on submit):
  "✓ Thanks! We'll get back to you within 24 hours."

RIGHT COLUMN: Calendar Embed
  - Embed Calendly widget
  - Shows available demo time slots
  - User can book directly
  - Title: "Schedule a Demo"
  - Description: "See TechTenX in action (15-30 min)"

Bottom CTA:
- "Prefer email? We'll respond ASAP."
- Links to social: Twitter, LinkedIn, email contact@techtenx.com
```

**Technical Details:**
- Create file: `app/contact/page.tsx`
- Use React `useState` for form handling
- Store form data in browser state (can add backend later)
- Embed Calendly widget via iframe (sign up free at calendly.com)
- Optional: Connect to email service (Nodemailer, SendGrid) for real submissions

**Calendly Setup:**
1. Go to calendly.com → Sign up free
2. Create "Product Demo" meeting (15-30 min)
3. Copy embed code from Calendly settings
4. Paste into Contact page component

**Acceptance Criteria:**
- ✅ Page loads at `/contact`
- ✅ Contact form has all required fields
- ✅ Form submission works (shows success message)
- ✅ Calendly calendar displays on right (or below on mobile)
- ✅ User can book a demo directly via Calendly
- ✅ Layout responsive (two-column → one-column on mobile)
- ✅ Form data is captured (can display in console for MVP)

---

## STEP 10: Add Testimonials Section

### 📋 Detailed Prompt

**What to Build:**
Add testimonials section to homepage + create `/testimonials` page with full list.

**Design Requirements:**
- Homepage: 3 rotating testimonial cards with smooth transitions
- Testimonials page: Grid of 10-12 testimonials with photos, names, companies

**Content Structure:**

```
Testimonials (Homepage - 3 cards, rotating):

1.
"TechTenX saved me 15 hours every week. I automated my entire email workflow."
— Sarah Martinez
Freelance Designer
⭐⭐⭐⭐⭐

2.
"Our customer support costs dropped 40% after implementing the AI agent."
— James Chen
VP Operations, TechCorp
⭐⭐⭐⭐⭐

3.
"Built my entire portfolio website with AI. It looks professional and took 1 day."
— Alex Johnson
Product Manager
⭐⭐⭐⭐⭐

Testimonials Page (10-12 testimonials):
[Grid layout with 2-3 testimonials per row]

Each card:
- Photo (placeholder avatar)
- Name
- Title & Company
- Quote (2-3 sentences)
- Star rating (5 stars)
- Industry badge (e.g., "E-Commerce", "SaaS", "Agency")
```

**Technical Details:**
- Homepage: Create component `components/TestimonialSlider.tsx`
  - Use `useState` to rotate testimonials every 5 seconds
  - Smooth fade transitions
- Testimonials page: Create `app/testimonials/page.tsx`
  - Map through testimonials array
  - Display in responsive grid
  - Use CSS Grid for layout

**Acceptance Criteria:**
- ✅ Testimonials display on homepage
- ✅ Cards rotate smoothly every 5 seconds
- ✅ `/testimonials` page loads
- ✅ Grid displays 10+ testimonials responsively
- ✅ Each testimonial shows photo, name, company, quote, rating
- ✅ Mobile responsive
- ✅ Star ratings visible

---

## STEP 11: Build Blog / Resources Section

### 📋 Detailed Prompt

**What to Build:**
Create `/blog` page + write 3-5 sample blog posts for SEO and thought leadership.

**Design Requirements:**
- Dark theme
- Blog post list with preview cards
- Each card: featured image, title, excerpt, date, read time, category
- Individual blog post pages (`/blog/[slug]`)
- SEO-optimized with meta tags

**Blog Topics (Write these):**

```
1. "How to Build AI Agents in 2026: A Complete Guide"
   - Slug: how-to-build-ai-agents-2026
   - Category: Tutorial
   - Read Time: 12 min
   - Content:
     * Introduction to AI agents
     * Types of agents (email, support, sales, etc.)
     * Step-by-step: Design → Build → Deploy
     * Code examples (pseudo-code)
     * Best practices
     * Next steps

2. "Save 20 Hours/Week: Automating Your Email Workflow"
   - Slug: email-automation-guide
   - Category: How-To
   - Read Time: 8 min
   - Content:
     * Problems with manual email management
     * What email automation can do
     * Step-by-step setup
     * Real examples
     * Cost savings calculation

3. "The 5 AI Tools That Changed How We Build Websites"
   - Slug: ai-website-building-tools
   - Category: Reviews
   - Read Time: 10 min
   - Content:
     * Overview of AI in web design
     * Tool comparison (design, dev, deployment)
     * Pros/cons of each
     * When to use AI vs human designers
     * ROI analysis

4. "Why Your Business Needs AI Automation (And It's Easier Than You Think)"
   - Slug: business-needs-ai-automation
   - Category: Strategy
   - Read Time: 9 min
   - Content:
     * Business case for AI
     * Common automation use cases
     * Implementation challenges & solutions
     * ROI calculations
     * Getting started

5. "From No-Code to Custom: Choosing the Right AI Solution for You"
   - Slug: choosing-right-ai-solution
   - Category: Guide
   - Read Time: 11 min
   - Content:
     * No-code vs. custom AI
     * When to use each
     * Comparison table
     * Cost analysis
     * Decision framework
```

**Technical Details:**
- Create directory: `app/blog/`
- Create file: `app/blog/page.tsx` (blog list)
- Create directory: `app/blog/[slug]/` (individual posts)
- Create component: `components/BlogCard.tsx`
- Store blog post content as markdown or JSON
- Use `next/image` for featured images
- Add SEO meta tags to each post

**Sample Blog Post Structure:**
```tsx
{
  id: 1,
  slug: "how-to-build-ai-agents-2026",
  title: "How to Build AI Agents in 2026",
  excerpt: "Learn to design, build, and deploy AI agents...",
  date: "2026-04-21",
  readTime: 12,
  category: "Tutorial",
  content: "...", // Full markdown content
  image: "/blog/ai-agents.jpg"
}
```

**Acceptance Criteria:**
- ✅ `/blog` page loads with list of posts
- ✅ Blog cards display title, excerpt, date, read time
- ✅ Each card links to individual post
- ✅ Individual post pages load at `/blog/[slug]`
- ✅ Full blog content displays with proper formatting
- ✅ Meta tags are present (title, description, og:image)
- ✅ Mobile responsive
- ✅ Navigation links in header/footer

---

## STEP 12: Add Smooth Animations

### 📋 Detailed Prompt

**What to Build:**
Add GSAP or Framer Motion animations throughout the site for modern feel.

**Animations to Add:**

1. **Hero Section (Homepage)**
   - Title fades in and slides up on page load
   - Buttons scale on hover
   - Gradient text animates on load

2. **Service Cards**
   - Cards fade in as user scrolls to section
   - Hover: slight lift + border glow
   - Icons scale on hover

3. **Testimonials**
   - Smooth fade transition between testimonials
   - Stars appear one by one

4. **Blog Cards**
   - Images zoom on hover
   - Text color changes on hover

5. **Navigation**
   - Smooth scroll to sections
   - Active nav item highlight animates

6. **Pricing Cards**
   - Pro card has pulsing glow effect
   - Cards scale up on hover

7. **Forms**
   - Input fields have focus animations
   - Success message fades in with scale

**Technical Details:**
- Install GSAP: `npm install gsap`
- Or use Framer Motion: `npm install framer-motion`
- Add animations to key components
- Use scroll trigger for "reveal on scroll" effects
- Keep animations subtle (200-500ms duration)

**Example GSAP Animation:**
```tsx
useEffect(() => {
  gsap.from(".hero-title", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
  });
}, []);
```

**Acceptance Criteria:**
- ✅ GSAP/Framer Motion installed
- ✅ Hero title animates on page load
- ✅ Service cards animate on scroll
- ✅ Hover effects on buttons & cards
- ✅ Testimonial transitions are smooth
- ✅ All animations are under 500ms
- ✅ No jank or stuttering
- ✅ Mobile animations are smooth

---

## STEP 13: Mobile Polish

### 📋 Detailed Prompt

**What to Build:**
Optimize all pages for mobile devices (currently basic, make excellent).

**Mobile Checklist:**

1. **Navigation**
   - [ ] Add hamburger menu for mobile
   - [ ] Menu slides in from side
   - [ ] Close menu when link clicked

2. **Typography**
   - [ ] Headlines scale appropriately (not too big)
   - [ ] Body text is readable (16px minimum)
   - [ ] Line height is comfortable (1.6+)

3. **Spacing**
   - [ ] Padding/margins scale on mobile
   - [ ] Touch targets are 44px+ (buttons, links)
   - [ ] No horizontal scroll

4. **Images**
   - [ ] Images load properly on mobile
   - [ ] Use responsive images (`next/image`)
   - [ ] Optimize file sizes

5. **Forms**
   - [ ] Inputs are full-width and easy to tap
   - [ ] Keyboard pops up correctly
   - [ ] Mobile-friendly input types (tel, email, etc.)

6. **Cards & Grids**
   - [ ] Single column on small screens
   - [ ] 2 columns on tablets
   - [ ] 3 columns on desktop
   - [ ] No overflow

**Technical Details:**
- Test on actual mobile device or Chrome DevTools
- Update Tailwind breakpoints as needed
- Add hamburger menu component
- Ensure touch-friendly spacing

**Acceptance Criteria:**
- ✅ All pages look good on mobile
- ✅ No horizontal scrolling
- ✅ Text is readable
- ✅ Buttons are tappable (44px+)
- ✅ Images scale properly
- ✅ Form inputs are accessible
- ✅ Navigation works on mobile

---

## STEP 14: SEO & Meta Tags

### 📋 Detailed Prompt

**What to Build:**
Add SEO meta tags, Open Graph tags, and structured data for search ranking.

**Items to Add:**

1. **Meta Tags (Every Page)**
   ```tsx
   <title>TechTenX | AI Agents & Automation for Everyone</title>
   <meta name="description" content="Build AI agents, automate workflows, create websites. For individuals and businesses." />
   <meta name="keywords" content="AI agents, automation, AI websites, no-code" />
   ```

2. **Open Graph Tags (Social Sharing)**
   ```tsx
   <meta property="og:title" content="..." />
   <meta property="og:description" content="..." />
   <meta property="og:image" content="..." />
   <meta property="og:url" content="..." />
   ```

3. **Structured Data (JSON-LD)**
   ```tsx
   {
     "@context": "https://schema.org",
     "@type": "SoftwareApplication",
     "name": "TechTenX",
     "description": "AI agents and automation platform",
     "url": "https://techtenx.com"
   }
   ```

4. **Robots & Canonical**
   ```tsx
   <meta name="robots" content="index, follow" />
   <link rel="canonical" href="https://techtenx.vercel.app/page" />
   ```

5. **Sitemap & Robots.txt**
   - Create `/public/robots.txt`
   - Create `/public/sitemap.xml` (or auto-generate)

**Technical Details:**
- Create component: `components/SEO.tsx` for reusable meta tags
- Use Next.js metadata API or react-helmet
- Add to each page's layout
- Test with Google Search Console

**Acceptance Criteria:**
- ✅ Each page has unique title & description
- ✅ Meta description under 160 characters
- ✅ Open Graph tags present
- ✅ Structured data (JSON-LD) on homepage
- ✅ Robots.txt created
- ✅ Canonical tags on duplicates
- ✅ Test with SEO checker (PageSpeed Insights)

---

## STEP 15: Dark/Light Mode Toggle

### 📋 Detailed Prompt

**What to Build:**
Add theme toggle button to switch between dark and light modes.

**Design Requirements:**
- Toggle button in navigation bar (sun/moon icon)
- Smooth transition between themes
- Remember user preference (localStorage)
- Light theme: light background, dark text
- Dark theme: dark background, light text (current)

**Technical Details:**
- Create context: `context/ThemeContext.tsx`
- Store preference in localStorage
- Use CSS variables or Tailwind dark mode
- Add toggle button to navbar
- Smooth color transitions

**Theme Colors:**

Dark (Current):
- Background: #000000
- Text: #FFFFFF
- Accent: #3B82F6 (blue)

Light:
- Background: #FFFFFF
- Text: #000000
- Accent: #2563EB (darker blue)

**Acceptance Criteria:**
- ✅ Toggle button visible in navbar
- ✅ Theme switches smoothly
- ✅ Preference saved in localStorage
- ✅ Preference persists on reload
- ✅ All pages work in both themes
- ✅ Contrast is good (WCAG AA compliant)
- ✅ Icons animate when toggling

---

## Summary & Next Steps

### Execution Order:
1. **STEP 1:** Pricing Page (20 min) — Sets business model
2. **STEP 2:** AI Demo (30 min) — Wow factor
3. **STEP 3-4:** Individual & Business Pages (50 min) — Audience targeting
4. **STEP 5:** Use Cases (20 min) — Social proof
5. **STEP 6-8:** Service Pages (60 min) — Deep dives
6. **STEP 9:** Contact + Calendly (30 min) — Lead capture
7. **STEP 10:** Testimonials (20 min) — Trust
8. **STEP 11:** Blog (40 min) — SEO & thought leadership
9. **STEP 12:** Animations (45 min) — Polish
10. **STEP 13:** Mobile Polish (15 min) — UX
11. **STEP 14:** SEO Tags (20 min) — Search ranking
12. **STEP 15:** Dark/Light Mode (25 min) — Preference

**Total Time:** ~7-8 hours over multiple sessions

---

**Ready to start? Reply with "START STEP 1" to begin building the Pricing page!**

