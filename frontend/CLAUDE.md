# TabPay Frontend - Claude Context

## Project Overview

TabPay is a casino ordering PWA that allows guests to order drinks and food directly from their table or slot machine. The app prioritizes a seamless, premium experience that feels like having a personal concierge.

### Two User Journeys

1. **Guest Checkout (Primary - 80%+ of users)**
   - Scans QR code at table/machine
   - QR contains venue, bar, and location parameters
   - No account needed - just order and pay
   - Apple Pay / Google Pay for frictionless checkout

2. **Registered Users (Power users, regulars)**
   - Creates account for saved payments, order history, favorites
   - More invested, expects polished experience

---

## Brand Kit

### Experience Philosophy

**The Feeling:** TabPay should feel like having a personal concierge in your pocket.

Users should feel:
- **Effortless** - "That was easy"
- **Cared for** - "They've got me covered"
- **In control** - "I didn't miss a beat of my game"
- **Premium** - "This is a classy operation"

**The Tone:** Confident, warm, efficient. Not corporate. Not playful/childish. Think: a sharp bartender who remembers your drink and has it ready before you ask.

---

### Color Palette

#### Primary: TabPay Purple
```css
--color-purple-50:  #f5f3ff;
--color-purple-100: #ede9fe;
--color-purple-200: #ddd6fe;
--color-purple-300: #c4b5fd;
--color-purple-400: #a78bfa;
--color-purple-500: #8b5cf6;
--color-purple-600: #7c3aed;  /* Primary brand color */
--color-purple-700: #6d28d9;
--color-purple-800: #5b21b6;
--color-purple-900: #4c1d95;
```

#### Secondary: Champagne Gold
Premium warmth, casino luxury, rewards/success states
```css
--color-gold-50:  #fdfbf7;
--color-gold-100: #faf5eb;
--color-gold-200: #f5ecd8;
--color-gold-300: #ebdbb8;
--color-gold-400: #e5c158;
--color-gold-500: #d4af37;  /* Primary gold */
--color-gold-600: #b8962e;
--color-gold-700: #967826;
--color-gold-800: #755e1f;
--color-gold-900: #5c4a1a;
```

#### Neutrals: Warm Slate (Purple-tinted)
```css
--color-slate-50:  #faf9fc;
--color-slate-100: #f4f3f7;
--color-slate-200: #e8e6ed;
--color-slate-300: #d4d1dc;
--color-slate-400: #a8a3b5;
--color-slate-500: #7c7689;
--color-slate-600: #544d6a;
--color-slate-700: #3d3654;
--color-slate-800: #252033;
--color-slate-900: #1a1625;  /* Dark backgrounds */
```

#### Semantic Colors
```css
--color-success: #22c55e;  /* Green - confirmations */
--color-warning: #f59e0b;  /* Amber - wait times, alerts */
--color-error:   #ef4444;  /* Red - errors */
--color-info:    #8b5cf6;  /* Purple - notifications */
```

#### Usage Guidelines
- **Purple** = TabPay brand, primary actions, CTAs
- **Gold** = Premium moments (rewards, success, tips, upgrades)
- **Warm Slate** = Everything else (backgrounds, text, borders)

---

### Typography

#### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

#### Usage
- **Everything:** Inter with weight hierarchy
- **Headlines:** Inter Bold (700) with tight letter-spacing (-0.025em)
- **Body:** Inter Regular (400) and Medium (500)
- **Prices/Numbers:** Inter Semibold (600) with `tabular-nums` for alignment
- **Emphasis:** Use font-weight for hierarchy, not different typefaces

#### Type Scale
```css
--text-xs:   0.75rem;   /* 12px - captions, timestamps */
--text-sm:   0.875rem;  /* 14px - secondary text */
--text-base: 1rem;      /* 16px - body text */
--text-lg:   1.125rem;  /* 18px - emphasized body */
--text-xl:   1.25rem;   /* 20px - section headers */
--text-2xl:  1.5rem;    /* 24px - page titles */
--text-3xl:  1.875rem;  /* 30px - hero headlines */
--text-4xl:  2.25rem;   /* 36px - landing hero */
```

#### Font Weights
- Regular (400): Body text
- Medium (500): Labels, buttons, emphasis
- Semibold (600): Card titles, section headers
- Bold (700): Page titles, hero text, prices

---

### Visual Language

#### Border Radius
```css
--radius-sm:   0.375rem;  /* 6px - small elements */
--radius-md:   0.5rem;    /* 8px - inputs */
--radius-lg:   0.75rem;   /* 12px - buttons */
--radius-xl:   1rem;      /* 16px - cards */
--radius-2xl:  1.5rem;    /* 24px - modals, large cards */
--radius-full: 9999px;    /* pills, badges */
```

#### Shadows (Light Mode)
```css
--shadow-sm: 0 1px 2px rgba(26, 22, 37, 0.05);
--shadow-md: 0 4px 6px rgba(26, 22, 37, 0.07), 0 2px 4px rgba(26, 22, 37, 0.05);
--shadow-lg: 0 10px 15px rgba(26, 22, 37, 0.1), 0 4px 6px rgba(26, 22, 37, 0.05);
--shadow-xl: 0 20px 25px rgba(26, 22, 37, 0.1), 0 8px 10px rgba(26, 22, 37, 0.04);
```

#### Spacing
Base unit: 4px. Common values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

---

### Component Guidelines

#### Buttons
- **Primary:** Solid purple, white text, subtle shadow
- **Secondary:** Purple outline/ghost, fills on hover
- **Gold accent:** For premium actions (tips, rewards)
- **Min height:** 48px on mobile for touch targets
- **Border radius:** `rounded-xl` (12px)

#### Cards
- Background: white (light) / slate-800 (dark)
- Border: 1px slate-200 (light) / slate-700 (dark)
- Border radius: `rounded-2xl` (16px)
- Padding: 16-24px
- Hover: subtle lift + shadow increase

#### Inputs
- Padding: 14-16px vertical
- Border radius: `rounded-lg` (8px)
- Focus: purple ring (2px)
- Error: red border + helper text

#### Navigation
- Bottom nav for mobile app
- Sticky headers with backdrop blur
- Clear back buttons in flows

---

### Motion & Feedback

#### Timing
```css
--duration-instant: 0ms;    /* toggles, color changes */
--duration-fast:    150ms;  /* hovers, small changes */
--duration-normal:  200ms;  /* transitions, modals */
--duration-slow:    300ms;  /* complex animations */
```

#### Easing
- Default: `ease-out`
- Looping: `ease-in-out`

#### Principles
- Fast and functional, not showy
- Confirm actions instantly (optimistic UI)
- Subtle is better than dramatic

---

### Iconography

**Primary:** Lucide React (`lucide-react`)
**Secondary:** Heroicons (`@heroicons/react`)

#### Sizes
- 24px: Navigation, primary actions
- 20px: Inline, secondary actions
- 16px: Small indicators
- 12-14px: Tiny indicators in mockups/compact UI

#### Style
- Outline style primarily
- Solid icons for: Active nav states, emphasis
- `strokeWidth={1.5}` for Lucide icons (slightly thinner = more elegant)

---

### Dark Mode & Background Strategy

Casino environments vary. Support both modes, but be intentional:

#### Key Learnings
- **Full dark (slate-950 everywhere) feels too heavy** - rejected in testing
- **Light backgrounds with dark accents** work better for premium feel
- **Dark sections as contrast breaks** (stats, rewards, footer) add rhythm
- **Gold accents pop on dark backgrounds** - use dark for gold-heavy sections

#### Recommended Approach
- Default: Light backgrounds (`white`, `slate-50`)
- Headers/hero areas: Can use purple gradient cards on light background
- Accent sections: Dark (`slate-900`) for stats, testimonials, rewards
- Footer: Dark (`slate-900`) for visual closure
- Never: Full-page dark for main content areas

---

### Copy Guidelines

**Do:**
- "Ready when you are" (not "Your cart is empty")
- "On its way" (not "Order processing")
- "Thanks for the tip!" (warm acknowledgment)

**Don't:**
- Corporate jargon
- Overly casual/playful
- Negative framing

---

## Technical Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 7
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **State:** React Context + useReducer
- **PWA:** VitePWA + Workbox
- **Icons:** Heroicons

---

## File Structure

```
src/
├── components/
│   ├── ui/          # Base components (Button, Input, Card, etc.)
│   ├── layout/      # AppLayout, Header, etc.
│   └── menu/        # Menu-specific components
├── context/         # React contexts (Auth, Cart)
├── data/            # Mock data for development
├── pages/           # Route pages
├── routes/          # Router configuration
└── types/           # TypeScript interfaces
```

---

## Key Decisions

1. **Stripe Connect** for payments - single charge split between casino and TabPay
2. **Service fee:** $1.50 per order (goes to TabPay)
3. **Age verification:** Handled by casino at entry, not in-app
4. **`isAgeVerified` flag:** Kept for future expansion beyond casinos

---

## Landing Page Patterns

### Recommended Structure
```
Navigation (fixed, glassmorphism)
Hero Section (text left, visual right on desktop)
Features Section ("The TabPay Difference" - bento grid)
How It Works (3-step visual flow)
Final CTA (contained card on light background)
Footer (dark, multi-column)
```

### What Works
- **Traditional layouts** - Don't reinvent the wheel, make it perfect
- **Bento grid for features** - Mix large and small cards, varying spans
- **Contained sections** - Max-width containers, consistent padding
- **Visual rhythm** - Alternate light/dark sections for contrast
- **Trust indicators** - Stars, order counts, delivery times in hero

### What Doesn't Work
- Full dark pages (too heavy)
- Generic 4-card feature rows (boring)
- Oversized/experimental layouts (confusing)
- Purple gradients as full-page backgrounds

---

## UI Patterns

### Floating Elements (Cards, Badges)
Position elements that "float" outside their container:
```tsx
// Container needs margin to give floating elements room
<div className="relative mx-8 sm:mx-16">
  {/* Main content */}
  <div className="relative">...</div>

  {/* Floating card - anchor to edge, then translate */}
  <div className="absolute left-0 top-8 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-3">
    ...
  </div>
</div>
```
**Key:** Use `translate-x-1/2` or `-translate-x-1/2` to push halfway off edge consistently.

### Phone Mockups (Pure CSS/Tailwind)
```tsx
<div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
  {/* Side buttons */}
  <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-sm" />

  {/* Screen */}
  <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
    {/* Dynamic Island */}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full" />

    {/* App content */}
    <div className="pt-14 px-4">...</div>
  </div>
</div>
```

**Key details that sell the illusion:**
- Side buttons (3px wide rectangles)
- Dynamic Island with camera dots
- Screen bezel glow (`bg-gradient-to-b from-primary-500/20`)
- Screen glare overlay (`from-white/10 via-transparent`)
- Home indicator bar at bottom
- Realistic app UI inside (not placeholder boxes)

### Decorative Background Elements
Add "whimsy" with blurred gradient blobs:
```tsx
{/* Background decorations - pointer-events-none so they don't block clicks */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
  <div className="absolute top-1/2 -left-24 w-72 h-72 bg-gold-100 rounded-full blur-3xl opacity-40" />
</div>
```

**Guidelines:**
- Use brand colors at low opacity (10-40%)
- Large blur values (blur-2xl, blur-3xl)
- Position partially off-screen for subtlety
- Mix purple and gold for brand consistency

### Bento Grid Layouts
For feature sections with varying importance:
```tsx
<div className="grid lg:grid-cols-3 gap-6">
  {/* Large feature - 2 cols, 2 rows */}
  <div className="lg:col-span-2 lg:row-span-2">...</div>

  {/* Smaller features */}
  <div>...</div>
  <div>...</div>

  {/* Wide feature - full width */}
  <div className="lg:col-span-3">...</div>
</div>
```

### Step/Process Indicators
For "How it Works" sections:
```tsx
<div className="relative inline-flex mb-8">
  {/* Icon box */}
  <div className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl">
    <Icon className="w-14 h-14 text-white" />
  </div>
  {/* Number badge */}
  <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center ring-4 ring-primary-100">
    <span className="text-xl font-bold text-primary-600">1</span>
  </div>
</div>
```

**Connecting line between steps (desktop):**
```tsx
<div className="hidden lg:block absolute top-[60px] left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-[2px]">
  <div className="h-full bg-gradient-to-r from-primary-300 via-gold-300 to-green-300 rounded-full" />
</div>
```

### Auth/Form Page Structure
Use card with distinct sections for visual hierarchy:
```tsx
<div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 overflow-hidden">
  {/* Header - logo, back link, branding */}
  <div className="relative px-6 sm:px-8 pt-6 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
    <Link to="/" className="absolute top-3 left-4 ...">← Home</Link>
    <div className="flex flex-col items-center pt-3">
      {/* Logo */}
    </div>
  </div>

  {/* Content - form fields */}
  <div className="px-6 sm:px-8 py-5">
    {/* Form */}
  </div>

  {/* Footer - secondary actions */}
  <div className="px-6 sm:px-8 py-3 bg-slate-50 border-t border-slate-100 text-center">
    {/* Toggle prompt, links */}
  </div>
</div>
```

**Guidelines:**
- Keep forms centered, single-column on all screen sizes
- Mobile padding: `px-6`, Desktop: `sm:px-8`
- 48px minimum touch targets (casino users may be distracted)
- Don't use split-screen layouts for auth - speed > immersion

### Smooth Height Transitions
Avoid layout jumping when showing/hiding form fields:
```tsx
// ❌ DON'T: Conditional rendering causes jumping
{!isLogin && <input ... />}

// ✅ DO: Use max-height with overflow-hidden
<div className={`transition-all duration-300 ease-out ${
  showField ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
}`}>
  <input tabIndex={showField ? 0 : -1} ... />
</div>
```

**Key points:**
- Use `max-h-20` (or appropriate value) instead of `max-h-full`
- Add `overflow-hidden` to clip content during collapse
- Use `tabIndex={-1}` on hidden fields for accessibility
- Pair with `opacity` for smoother visual transition

### Toggle Pill with Sliding Indicator
For mode switching (login/register, tabs, etc.):
```tsx
<div className="relative flex bg-slate-100 rounded-xl p-1">
  {/* Sliding background indicator */}
  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-out ${
    isFirstOption ? 'left-1' : 'left-[calc(50%+2px)]'
  }`} />

  {/* Option buttons */}
  <button className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
    isFirstOption ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
  }`}>
    Option 1
  </button>
  <button className="...">Option 2</button>
</div>
```

### Enhanced Depth with Custom Shadows
For premium feel, use layered and colored shadows:
```tsx
// Card with layered shadow + subtle ring
<div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5">

// Hover lift effect
<div className="hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.2)] transition-all duration-300">

// Colored shadow (purple glow on buttons)
<div className="shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40">

// Gradient glow behind card
<div className="absolute -inset-2 bg-gradient-to-b from-primary-200/40 via-slate-200/50 to-gold-200/40 rounded-[2.5rem] blur-2xl opacity-70" />
```

**Pattern for depth:**
1. Base shadow for elevation
2. `ring-1 ring-slate-900/5` for subtle definition
3. Colored shadow (`shadow-primary-500/25`) for brand elements
4. Hover: increase shadow + slight `translate-y` lift

---

## Utility Classes Reference

Custom utilities defined in `index.css`:

```css
/* Gradients */
.bg-gradient-brand        /* Purple gradient */
.bg-gradient-brand-radial /* Purple radial gradient */
.bg-gradient-gold         /* Gold gradient */
.text-gradient-gold       /* Gold text gradient */

/* Glass effects */
.glass                    /* Light glassmorphism */
.glass-dark               /* Dark glassmorphism */

/* Glows */
.glow-purple              /* Purple box shadow glow */
.glow-gold                /* Gold box shadow glow */

/* Animations */
.animate-slide-up         /* Slide up entrance */
.animate-fade-in          /* Fade in */
.animate-scale-in         /* Scale up entrance */
.animate-pulse-soft       /* Subtle pulse */
.animate-shimmer          /* Loading shimmer */

/* Safe areas */
.safe-bottom              /* iOS safe area padding */
.safe-top                 /* iOS safe area padding */
```
