# Month 1 Frontend Development Tickets

**Project**: BEN-137 TabPay
**Phase**: Month 1 - Frontend Prototyping
**Timeline**: Week 1-4 with weekly client syncs

---

## Setup & Tooling

### TICKET-001: Configure TailwindCSS and Design System ✅
**Priority**: High
**Estimated Effort**: 4-6 hours
**Status**: COMPLETED

**Description**
Setup TailwindCSS for styling and establish base design system for the TabPay PWA.

**Acceptance Criteria**
- [x] TailwindCSS installed and configured in Vite
- [x] Custom color palette defined (purple theme: #7C3AED)
- [x] Typography scale established (mobile-optimized)
- [x] Spacing and layout utilities configured
- [x] Mobile-first breakpoints defined
- [x] Base component styles for buttons, inputs, cards

**Resources**
- Primary theme color: #7C3AED (purple)
- Target: Casino floor low-light conditions
- Mobile-first approach for 375px-428px screens

---

### TICKET-002: Setup Routing and Navigation Structure ✅
**Priority**: High
**Estimated Effort**: 3-4 hours
**Status**: COMPLETED

**Description**
Configure React Router and establish navigation structure for the PWA.

**Acceptance Criteria**
- [x] React Router installed and configured
- [x] Route structure defined (landing, menu, cart, checkout, confirmation)
- [ ] Navigation guard/redirect logic for QR code access
- [ ] Browser back button handling
- [ ] Deep linking support for PWA

**Routes**
- `/` - Landing/QR scan entry
- `/menu` - Menu browsing
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/confirmation/:orderId` - Order confirmation

---

## Core Components

### TICKET-003: Create Base Layout Components
**Priority**: High
**Estimated Effort**: 4-6 hours

**Description**
Build reusable layout components for consistent structure across all screens.

**Acceptance Criteria**
- [ ] AppLayout component with header/footer
- [ ] Header component with logo and cart icon
- [ ] Bottom navigation bar (if needed)
- [ ] Loading states and skeletons
- [ ] Error boundary component
- [ ] Toast/notification system

**Design Notes**
- Fixed header with cart indicator
- Mobile-optimized touch targets (44px min)
- Purple theme throughout (#7C3AED)

---

### TICKET-004: Build Reusable UI Component Library
**Priority**: Medium
**Estimated Effort**: 6-8 hours

**Description**
Create a set of reusable UI components used throughout the application.

**Acceptance Criteria**
- [ ] Button component (primary, secondary, disabled states)
- [ ] Input component (text, number, with validation)
- [ ] Card component for menu items
- [ ] Modal/Dialog component
- [ ] Badge component (cart count, status indicators)
- [ ] Quantity selector component
- [ ] Price display component
- [ ] Category chip/tab component

**Technical Notes**
- TypeScript interfaces for all props
- Accessibility attributes (ARIA labels)
- Touch-optimized for mobile

---

## Feature: QR Code Entry

### TICKET-005: Implement QR Code Scanning/Entry
**Priority**: High
**Estimated Effort**: 6-8 hours

**Description**
Build the entry point for the application where users scan QR codes to access venue menus.

**Acceptance Criteria**
- [ ] QR code scanner component (camera-based)
- [ ] Manual table/machine number entry option
- [ ] QR code validation logic (mock for Month 1)
- [ ] Location stored in app state/context
- [ ] Error handling for invalid codes
- [ ] Permission handling for camera access
- [ ] Fallback UI if camera unavailable

**User Flow**
1. User lands on app (via QR scan or direct link)
2. If no location: prompt for QR scan or manual entry
3. Validate location and redirect to menu
4. Location persists in session

**Technical Notes**
- Use `react-qr-reader` or similar library
- Store location in React Context or localStorage
- Mock validation for prototype phase

---

## Feature: Menu Browsing

### TICKET-006: Create Menu Data Structure and Mock Data
**Priority**: High
**Estimated Effort**: 3-4 hours

**Description**
Define TypeScript interfaces for menu data and create comprehensive mock data for development.

**Acceptance Criteria**
- [ ] TypeScript interfaces for menu structure (categories, items, modifiers)
- [ ] Mock menu data with 4-6 categories
- [ ] Mock data includes: drinks, food, pricing, images, descriptions
- [ ] Item availability status
- [ ] Customization options (modifiers, add-ons)
- [ ] Dietary information (optional for Month 1)

**Data Structure**
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  modifiers?: Modifier[];
}

interface Modifier {
  id: string;
  name: string;
  options: ModifierOption[];
  required: boolean;
}
```

---

### TICKET-007: Build Menu Category Navigation
**Priority**: High
**Estimated Effort**: 4-5 hours

**Description**
Create the category navigation system for browsing menu items by type.

**Acceptance Criteria**
- [ ] Horizontal scrollable category tabs
- [ ] Active category highlighting
- [ ] Smooth scroll to category section
- [ ] Sticky category bar on scroll
- [ ] Category icons (optional)
- [ ] Item count per category

**Categories (Initial)**
- Beer & Wine
- Cocktails
- Non-Alcoholic
- Appetizers
- Snacks
- Desserts

---

### TICKET-008: Build Menu Item List and Cards
**Priority**: High
**Estimated Effort**: 6-8 hours

**Description**
Create the menu item display with cards showing product details and add-to-cart functionality.

**Acceptance Criteria**
- [ ] Menu item card component with image, name, price, description
- [ ] Grid/list layout responsive to screen size
- [ ] "Add to Cart" button with loading state
- [ ] Unavailable item styling (grayed out)
- [ ] Quick add vs detailed view options
- [ ] Item images with fallback placeholders
- [ ] Price formatting ($XX.XX)

**Interaction**
- Tap card to view item details
- Quick add button adds default item to cart
- Visual feedback on add (animation, toast)

---

### TICKET-009: Create Item Detail Modal with Customization
**Priority**: Medium
**Estimated Effort**: 6-8 hours

**Description**
Build detailed item view modal for customization options and modifiers.

**Acceptance Criteria**
- [ ] Full-screen or large modal for item details
- [ ] Item image, name, full description
- [ ] Customization options (modifiers, add-ons)
- [ ] Special instructions text field
- [ ] Quantity selector
- [ ] Price calculation with modifiers
- [ ] Add to cart from modal
- [ ] Close/back button

**Example Customizations**
- Drink size (Small, Medium, Large)
- Ice preference (Light, Normal, Extra)
- Garnish options
- Special requests

---

## Feature: Shopping Cart

### TICKET-010: Build Shopping Cart State Management
**Priority**: High
**Estimated Effort**: 5-6 hours

**Description**
Implement cart state management using Context API or state management library.

**Acceptance Criteria**
- [ ] Cart context provider setup
- [ ] Add item to cart action
- [ ] Remove item from cart action
- [ ] Update item quantity action
- [ ] Clear cart action
- [ ] Cart state persists in localStorage
- [ ] Cart count calculation
- [ ] Subtotal calculation
- [ ] Cart item interface with modifiers

**Technical Notes**
- Use React Context + useReducer or Zustand
- Persist to localStorage for session continuity
- Handle duplicate items with same modifiers

---

### TICKET-011: Create Cart Drawer/Page UI
**Priority**: High
**Estimated Effort**: 6-8 hours

**Description**
Build the cart interface where users review items before checkout.

**Acceptance Criteria**
- [ ] Cart drawer slides from right or full page view
- [ ] List of cart items with details
- [ ] Quantity adjustment controls
- [ ] Remove item button
- [ ] Subtotal display
- [ ] Tax estimate (if applicable)
- [ ] Total price calculation
- [ ] Empty cart state with CTA
- [ ] Proceed to checkout button
- [ ] Continue shopping link

**Design Notes**
- Swipe gesture to open/close drawer (mobile)
- Fixed footer with total and checkout button
- Item thumbnails with customizations listed

---

## Feature: Location & Checkout

### TICKET-012: Build Location Entry/Confirmation Component
**Priority**: High
**Estimated Effort**: 4-5 hours

**Description**
Create the interface for users to confirm or update their location before checkout.

**Acceptance Criteria**
- [ ] Display current location (table/machine number)
- [ ] Option to edit location
- [ ] Location validation
- [ ] Visual confirmation of location
- [ ] Help text for location entry
- [ ] Format validation (e.g., "Table 42" or "Machine 123")

**User Flow**
1. User proceeds to checkout
2. Confirm location screen shows current location
3. Edit option if incorrect
4. Validation before proceeding to payment

---

### TICKET-013: Create Checkout Flow UI (Payment Mockup)
**Priority**: High
**Estimated Effort**: 6-8 hours

**Description**
Build checkout interface with payment mockup (no real payment processing in Month 1).

**Acceptance Criteria**
- [ ] Checkout page with order summary
- [ ] Location confirmation displayed
- [ ] Itemized list with quantities and prices
- [ ] Subtotal, tax, and total calculation
- [ ] Payment method selector (mockup)
- [ ] Tip selection options (optional)
- [ ] Payment button (mockup - shows success)
- [ ] Terms and conditions link
- [ ] Loading state during "processing"

**Payment Methods (Mock)**
- Credit/Debit Card
- Apple Pay (visual only)
- Google Pay (visual only)

**Technical Notes**
- No actual payment processing
- Mock success response after 2-3 second delay
- Generate mock order ID for confirmation

---

## Feature: Order Confirmation

### TICKET-014: Build Order Confirmation Screen
**Priority**: High
**Estimated Effort**: 4-5 hours

**Description**
Create the post-order confirmation screen with order details and estimated delivery time.

**Acceptance Criteria**
- [ ] Order confirmation success message
- [ ] Order number display
- [ ] Estimated delivery time (mock)
- [ ] Order summary (items, location, total)
- [ ] Order status indicator (Received → Preparing → On the way → Delivered)
- [ ] Return to menu button
- [ ] View order history link (optional)

**Design Notes**
- Large checkmark or success icon
- Clear order number for reference
- Estimated time: "Your order will arrive in 15-20 minutes"

---

### TICKET-015: Create Order Status Tracking UI (Static)
**Priority**: Low
**Estimated Effort**: 3-4 hours

**Description**
Build a static order status tracking component showing order progress stages.

**Acceptance Criteria**
- [ ] Progress indicator with stages
- [ ] Stage labels (Received, Preparing, Delivering, Delivered)
- [ ] Visual checkmarks for completed stages
- [ ] Current stage highlighted
- [ ] Estimated time per stage (static mock)

**Technical Notes**
- No real-time updates in Month 1
- Static mock showing "Preparing" status
- Foundation for Month 2 real-time integration

---

## Polish & Testing

### TICKET-016: Mobile Responsive Design Review
**Priority**: High
**Estimated Effort**: 4-6 hours

**Description**
Comprehensive review and refinement of mobile responsive design across all screens.

**Acceptance Criteria**
- [ ] Test on iPhone SE (375px), iPhone 14 (390px), iPhone 14 Pro Max (428px)
- [ ] Test on Android devices (various sizes)
- [ ] Portrait and landscape orientations
- [ ] Touch target sizes (minimum 44x44px)
- [ ] Scrolling behavior smooth
- [ ] No horizontal scroll issues
- [ ] Text legibility at all sizes
- [ ] Form inputs properly sized for mobile keyboards

**Testing Checklist**
- Safari iOS
- Chrome Android
- PWA installed mode
- Low-light readability (dark theme testing)

---

### TICKET-017: PWA Installation and Offline Functionality
**Priority**: Medium
**Estimated Effort**: 5-6 hours

**Description**
Test and refine PWA installation flow and basic offline capabilities.

**Acceptance Criteria**
- [ ] Install prompt appears correctly
- [ ] App installs successfully on iOS and Android
- [ ] App icon displays correctly
- [ ] Splash screen configured
- [ ] Service worker registers properly
- [ ] Basic offline page/message
- [ ] Cached assets load offline
- [ ] App shell works offline

**Technical Notes**
- Test installation from Safari (iOS) and Chrome (Android)
- Verify manifest.json configuration
- Test service worker caching strategies
- Month 1: basic offline page only (full offline in Month 3)

---

### TICKET-018: Accessibility Audit and Improvements
**Priority**: Medium
**Estimated Effort**: 4-5 hours

**Description**
Conduct accessibility review and implement improvements for WCAG compliance.

**Acceptance Criteria**
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on all icons and buttons
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader testing (VoiceOver/TalkBack)
- [ ] Form inputs properly labeled
- [ ] Error messages accessible
- [ ] Semantic HTML structure

**Testing Tools**
- Lighthouse accessibility score
- axe DevTools
- Screen reader manual testing

---

### TICKET-019: Performance Optimization
**Priority**: Medium
**Estimated Effort**: 3-4 hours

**Description**
Optimize application performance for smooth mobile experience.

**Acceptance Criteria**
- [ ] Lighthouse performance score > 90
- [ ] Images optimized (WebP format)
- [ ] Lazy loading for images
- [ ] Code splitting for routes
- [ ] Bundle size analysis and optimization
- [ ] Remove unused dependencies
- [ ] Fast initial load time (<3s on 3G)

**Metrics to Track**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size

---

### TICKET-020: Client Demo Preparation
**Priority**: High
**Estimated Effort**: 3-4 hours

**Description**
Prepare comprehensive demo environment and walkthrough for end-of-month client sync.

**Acceptance Criteria**
- [ ] Demo script prepared covering all features
- [ ] Mock data is realistic and complete
- [ ] Test account/venue setup
- [ ] QR codes generated for demo
- [ ] Known issues documented
- [ ] Demo video/screenshots (optional)
- [ ] Feedback collection plan

**Demo Flow**
1. QR code scan entry
2. Menu browsing and categories
3. Item customization
4. Add to cart workflow
5. Checkout process
6. Order confirmation
7. PWA installation

---

## Summary

**Total Tickets**: 20
**Estimated Total Effort**: 90-110 hours
**Target Completion**: End of Month 1 (Week 4)

**Priority Breakdown**
- High Priority: 13 tickets (foundational features)
- Medium Priority: 6 tickets (polish and optimization)
- Low Priority: 1 ticket (future foundation)

**Weekly Targets**
- **Week 1**: Setup & Core Components (Tickets 1-4)
- **Week 2**: QR Code + Menu Browsing (Tickets 5-9)
- **Week 3**: Cart + Checkout (Tickets 10-13)
- **Week 4**: Confirmation + Polish (Tickets 14-20)
