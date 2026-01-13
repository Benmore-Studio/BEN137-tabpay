# TabPay Backend - Sprint Planning (Months 1-2)

> **Project:** TabPay Casino Ordering Demo - Premium Tier
> **Timeline:** 2 months of backend development
> **Sprint Duration:** 2 weeks each

---

## Sprint 1: Foundation & Core Infrastructure
**Duration:** Weeks 1-2 (Jan 13-26, 2026)
**Goal:** Establish project foundation, database setup, and core API structure
**Capacity:** 17 points (adjusted for completed work + pulled forward tickets)

---

### TICKET: TP-001 - Project Setup & Configuration
**Type:** Infrastructure
**Priority:** Critical
**Estimate:** 1 point (reduced - partially complete)
**Schedule:** Jan 13, 2026
**Status:** 🟡 In Progress (~50% complete - Express/TS/Prisma done, needs ESLint, CORS, API versioning)

**Description:**
Set up the backend project with proper configuration, environment management, and development tooling.

**Acceptance Criteria:**
- [x] Express.js server with TypeScript configured
- [ ] ESLint + Prettier configured for code quality
- [x] Environment variable management (.env)
- [ ] CORS configuration for frontend communication
- [ ] Error handling middleware
- [ ] API versioning structure (`/api/v1/`)

**Technical Notes:**
- Use `dotenv` for environment variables
- Configure CORS to allow frontend origin (add `cors` package)
- Set up structured error responses with status codes

---

### TICKET: TP-002 - Database Setup & Seeding
**Type:** Infrastructure
**Priority:** Critical
**Estimate:** 5 points
**Schedule:** Complete
**Status:** ✅ Complete (Prisma schema + seed script implemented with venue, 4 bars, 6 categories, 22 menu items, modifiers)

**Description:**
Configure PostgreSQL database connection, run initial migrations, and create seed data for development/demo.

**Acceptance Criteria:**
- [x] PostgreSQL database created and connected
- [x] Prisma migrations applied successfully
- [x] Seed script creates demo data:
  - 1 venue (Potawatomi Casino mock)
  - 4 service bars with different locations
  - 6 categories (Beer & Wine, Cocktails, Non-Alcoholic, Appetizers, Snacks, Desserts)
  - 22 menu items with realistic pricing
  - Common modifiers (Size, Ice, Garnish, Sauce options)
- [x] `npm run db:seed` works reliably
- [x] Prisma Studio accessible for data inspection

**Technical Notes:**
- Seed data should match frontend mock data for consistency
- Include realistic casino-style pricing ($6-18 range)
- Add sample images via URLs (Unsplash)

---

### TICKET: TP-003 - Venue & Service Bar API
**Type:** Feature
**Priority:** High
**Estimate:** 3 points
**Schedule:** Jan 14-15, 2026
**Status:** ⬜ Not Started
**Dependencies:** TP-001 (API versioning structure)

**Description:**
Create REST endpoints for retrieving venue and service bar information.

**Endpoints:**
```
GET  /api/v1/venues              - List all active venues
GET  /api/v1/venues/:id          - Get venue details
GET  /api/v1/venues/:id/bars     - List service bars for a venue
GET  /api/v1/bars/:id            - Get service bar details with status
```

**Acceptance Criteria:**
- [ ] All endpoints return proper JSON responses
- [ ] Service bar endpoint includes real-time status fields (activeOrders, waitTime, status)
- [ ] Proper error handling for non-existent resources (404)
- [ ] Response includes related data (venue includes serviceBars count)

**Response Example:**
```json
{
  "id": "uuid",
  "name": "High Roller Lounge",
  "location": "Main Floor - Near Poker Tables",
  "activeOrders": 5,
  "availableServers": 2,
  "estimatedWaitMinutes": 8,
  "status": "low"
}
```

---

### TICKET: TP-004 - Menu & Category API
**Type:** Feature
**Priority:** High
**Estimate:** 5 points
**Schedule:** Jan 16-20, 2026
**Status:** ⬜ Not Started
**Dependencies:** TP-001, TP-003

**Description:**
Create REST endpoints for menu browsing with categories, items, and modifiers.

**Endpoints:**
```
GET  /api/v1/categories                    - List all categories (sorted)
GET  /api/v1/bars/:barId/menu              - Get full menu for a service bar
GET  /api/v1/bars/:barId/menu/:categoryId  - Get items by category
GET  /api/v1/menu-items/:id                - Get item details with modifiers
```

**Acceptance Criteria:**
- [ ] Menu items include full modifier details with options
- [ ] Items marked `available: false` are filtered or flagged
- [ ] Dietary info (vegetarian, vegan, glutenFree) included
- [ ] Categories sorted by `sortOrder` field
- [ ] Prices returned as numbers (not strings)

**Response Example (Menu Item):**
```json
{
  "id": "uuid",
  "name": "Classic Margarita",
  "description": "Tequila, lime juice, and triple sec...",
  "price": 14.00,
  "imageUrl": "https://...",
  "available": true,
  "dietary": {
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true
  },
  "modifiers": [
    {
      "id": "uuid",
      "name": "Ice",
      "required": false,
      "maxSelections": 1,
      "options": [
        { "id": "uuid", "name": "Light Ice", "priceAdjustment": 0 },
        { "id": "uuid", "name": "No Ice", "priceAdjustment": 0 }
      ]
    }
  ]
}
```

---

## Sprint 2: Authentication & User Management
**Duration:** Weeks 3-4 (Jan 27 - Feb 9, 2026)
**Goal:** Implement user authentication, sessions, and profile management
**Note:** TP-005 and TP-006 pulled forward to Sprint 1

---

### TICKET: TP-005 - User Registration
**Type:** Feature
**Priority:** Critical
**Estimate:** 5 points
**Schedule:** Jan 21-23, 2026 (pulled forward from Sprint 2)
**Status:** ⬜ Not Started
**Dependencies:** TP-001 (API structure, error handling)

**Description:**
Implement user registration with email/password authentication.

**Endpoint:**
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Acceptance Criteria:**
- [ ] Email validation (format + uniqueness)
- [ ] Password hashing with bcrypt (cost factor 12)
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number
- [ ] Phone number validation
- [ ] Returns JWT token on successful registration
- [ ] Creates default UserPreferences record
- [ ] Proper error messages for validation failures

**Technical Notes:**
- Use `bcryptjs` for password hashing
- Use `jsonwebtoken` for JWT generation
- Store JWT secret in environment variable

---

### TICKET: TP-006 - User Login & Sessions
**Type:** Feature
**Priority:** Critical
**Estimate:** 3 points
**Schedule:** Jan 24-26, 2026 (pulled forward from Sprint 2)
**Status:** ⬜ Not Started
**Dependencies:** TP-005 (User model, JWT setup)

**Description:**
Implement user login with JWT-based session management.

**Endpoints:**
```
POST /api/v1/auth/login    - Login with credentials
POST /api/v1/auth/logout   - Invalidate session
POST /api/v1/auth/refresh  - Refresh JWT token
```

**Acceptance Criteria:**
- [ ] Login returns JWT token (7 day expiry)
- [ ] Session stored in database for tracking
- [ ] Logout invalidates session token
- [ ] Refresh endpoint issues new token
- [ ] Failed login returns generic error (security)
- [ ] Rate limiting on login attempts (5 per minute)

**Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-02-02T00:00:00Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### TICKET: TP-007 - Auth Middleware & Protected Routes
**Type:** Feature
**Priority:** Critical
**Estimate:** 3 points

**Description:**
Create authentication middleware and establish protected route patterns.

**Acceptance Criteria:**
- [ ] `requireAuth` middleware validates JWT from Authorization header
- [ ] Middleware attaches `req.user` with user data
- [ ] Expired tokens return 401 with clear message
- [ ] Invalid tokens return 401
- [ ] Optional auth middleware for routes that work with/without auth

**Technical Notes:**
```typescript
// Usage pattern
router.get('/profile', requireAuth, profileController.get);
router.get('/menu', optionalAuth, menuController.list);
```

---

### TICKET: TP-008 - User Profile API
**Type:** Feature
**Priority:** High
**Estimate:** 5 points

**Description:**
Create endpoints for user profile management.

**Endpoints:**
```
GET    /api/v1/profile              - Get current user profile
PATCH  /api/v1/profile              - Update profile fields
GET    /api/v1/profile/preferences  - Get user preferences
PATCH  /api/v1/profile/preferences  - Update preferences
```

**Acceptance Criteria:**
- [ ] Profile includes user info, preferences, saved locations count
- [ ] Can update: firstName, lastName, phone, dateOfBirth
- [ ] Cannot update: email (requires verification flow)
- [ ] Preferences: defaultTipPercent, notifications, autoReorder
- [ ] Validation on all updatable fields

**Response Example (Profile):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isAgeVerified": false,
    "hasPaymentMethod": true
  },
  "preferences": {
    "defaultTipPercent": 18,
    "notifications": true,
    "autoReorder": false
  },
  "savedLocationsCount": 2,
  "paymentMethodsCount": 1
}
```

---

### TICKET: TP-009 - Saved Locations API
**Type:** Feature
**Priority:** Medium
**Estimate:** 3 points

**Description:**
Allow users to save their frequent delivery locations (slot machine numbers, table IDs).

**Endpoints:**
```
GET    /api/v1/profile/locations      - List saved locations
POST   /api/v1/profile/locations      - Add new location
PATCH  /api/v1/profile/locations/:id  - Update location
DELETE /api/v1/profile/locations/:id  - Remove location
```

**Acceptance Criteria:**
- [ ] Max 5 saved locations per user
- [ ] One location can be marked as default
- [ ] Setting new default unsets previous default
- [ ] Location includes venue reference
- [ ] Label required (e.g., "My usual slot", "Poker table")

---

## Sprint 3: Order Flow - Part 1
**Duration:** Weeks 5-6
**Goal:** Implement order creation, cart validation, and basic order management

---

### TICKET: TP-010 - Order Creation API
**Type:** Feature
**Priority:** Critical
**Estimate:** 8 points

**Description:**
Implement order creation with cart validation, pricing calculation, and order storage.

**Endpoint:**
```
POST /api/v1/orders
```

**Request Body:**
```json
{
  "venueId": "uuid",
  "serviceBarId": "uuid",
  "deliveryLocation": "Slot A-247",
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 2,
      "modifiers": [
        { "optionId": "uuid" }
      ],
      "specialInstructions": "Extra lime please"
    }
  ],
  "tip": 3.50,
  "isASAP": true,
  "scheduledFor": null
}
```

**Acceptance Criteria:**
- [ ] Validates all menu items exist and are available
- [ ] Validates all modifier options are valid for the items
- [ ] Calculates subtotal (base prices + modifier adjustments)
- [ ] Calculates tax (8.75% configurable)
- [ ] Adds TabPay service fee ($1.50)
- [ ] Generates human-readable order number (e.g., "TP1ABC2D")
- [ ] Works for both authenticated users and guests
- [ ] Guest orders require email and phone
- [ ] Returns created order with all calculated totals

**Pricing Logic:**
```
subtotal = sum(item.unitPrice * item.quantity)
tax = subtotal * TAX_RATE
serviceFee = $1.50
total = subtotal + tax + tip + serviceFee
```

---

### TICKET: TP-011 - Order Retrieval API
**Type:** Feature
**Priority:** High
**Estimate:** 3 points

**Description:**
Endpoints to retrieve order details and order history.

**Endpoints:**
```
GET /api/v1/orders/:id           - Get order by ID
GET /api/v1/orders/number/:num   - Get order by order number
GET /api/v1/orders               - List user's orders (auth required)
```

**Acceptance Criteria:**
- [ ] Order includes all items with modifier details
- [ ] Order includes current status and timestamps
- [ ] User can only view their own orders (or by order number for guests)
- [ ] List endpoint supports pagination (limit/offset)
- [ ] List sorted by createdAt descending (newest first)

---

### TICKET: TP-012 - Order Status Management
**Type:** Feature
**Priority:** High
**Estimate:** 3 points

**Description:**
Implement order status tracking and updates.

**Endpoints:**
```
GET   /api/v1/orders/:id/status  - Get current status
PATCH /api/v1/orders/:id/status  - Update status (admin only)
GET   /api/v1/orders/:id/history - Get status history
```

**Status Flow:**
```
received → preparing → delivering → delivered
    ↓          ↓           ↓
cancelled  cancelled   cancelled (before delivery)
```

**Acceptance Criteria:**
- [ ] Status changes create OrderStatusHistory record
- [ ] Status change updates relevant timestamp (preparedAt, deliveredAt, etc.)
- [ ] Invalid status transitions return 400 error
- [ ] Status endpoint returns estimated delivery time

---

## Sprint 4: Payments & Order Completion
**Duration:** Weeks 7-8
**Goal:** Integrate Stripe for payments and complete order flow

---

### TICKET: TP-013 - Stripe Integration Setup
**Type:** Infrastructure
**Priority:** Critical
**Estimate:** 5 points

**Description:**
Set up Stripe SDK and payment infrastructure.

**Acceptance Criteria:**
- [ ] Stripe SDK installed and configured
- [ ] Test API keys in environment variables
- [ ] Webhook endpoint configured (`/api/v1/webhooks/stripe`)
- [ ] Webhook signature verification working
- [ ] Stripe customer creation on user registration

**Technical Notes:**
- Use Stripe test mode only
- Set up webhook for: `payment_intent.succeeded`, `payment_intent.failed`
- Store Stripe customer ID on User model if needed

---

### TICKET: TP-014 - Payment Method Management
**Type:** Feature
**Priority:** High
**Estimate:** 5 points

**Description:**
Allow users to save and manage payment methods via Stripe.

**Endpoints:**
```
GET    /api/v1/profile/payment-methods      - List saved methods
POST   /api/v1/profile/payment-methods      - Add payment method
DELETE /api/v1/profile/payment-methods/:id  - Remove method
PATCH  /api/v1/profile/payment-methods/:id  - Set as default
POST   /api/v1/payment/setup-intent         - Create SetupIntent for adding card
```

**Acceptance Criteria:**
- [ ] Creates Stripe SetupIntent for secure card entry
- [ ] Stores PaymentMethod reference (not card details)
- [ ] Displays last 4 digits and brand
- [ ] One method can be marked as default
- [ ] Supports card, Apple Pay, Google Pay types
- [ ] Updates `hasPaymentMethod` flag on User

---

### TICKET: TP-015 - Order Payment Processing
**Type:** Feature
**Priority:** Critical
**Estimate:** 8 points

**Description:**
Process payments for orders using Stripe PaymentIntents.

**Endpoints:**
```
POST /api/v1/orders/:id/pay           - Pay for an order
POST /api/v1/orders/:id/pay/confirm   - Confirm payment (3DS)
```

**Flow:**
1. Create PaymentIntent with order total
2. If saved payment method → attempt charge
3. If guest → return client_secret for frontend payment
4. Handle 3D Secure if required
5. On success → update order status to 'received'

**Acceptance Criteria:**
- [ ] Creates PaymentIntent with correct amount (in cents)
- [ ] Supports saved payment methods
- [ ] Supports guest checkout (card entry on frontend)
- [ ] Handles 3D Secure authentication flow
- [ ] Updates order with stripePaymentIntentId
- [ ] Sets `paidAt` timestamp on successful payment
- [ ] Webhook handler confirms payment status

---

### TICKET: TP-016 - Order Cancellation & Refunds
**Type:** Feature
**Priority:** Medium
**Estimate:** 3 points

**Description:**
Allow order cancellation and process refunds when applicable.

**Endpoint:**
```
POST /api/v1/orders/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Acceptance Criteria:**
- [ ] Can only cancel orders in 'received' or 'preparing' status
- [ ] Cancellation triggers Stripe refund
- [ ] Order status set to 'cancelled'
- [ ] Cancellation reason and timestamp stored
- [ ] Full refund issued (no partial refunds in MVP)

---

### TICKET: TP-017 - Guest Checkout Flow
**Type:** Feature
**Priority:** High
**Estimate:** 5 points

**Description:**
Enable complete guest checkout without account creation.

**Acceptance Criteria:**
- [ ] Order creation accepts guestEmail and guestPhone
- [ ] Payment via Stripe Checkout or Elements (no saved methods)
- [ ] Order accessible via order number (no auth required)
- [ ] Guest can view order status by order number
- [ ] Email sent with order confirmation and tracking link

---

## Sprint 5: Admin & Operational Features
**Duration:** Weeks 9-10 (if continuing)
**Goal:** Basic admin panel API for menu management

---

### TICKET: TP-018 - Admin Authentication
**Type:** Feature
**Priority:** High
**Estimate:** 3 points

**Description:**
Add admin role and separate admin authentication.

**Acceptance Criteria:**
- [ ] Admin role flag on User model
- [ ] Admin-only middleware (`requireAdmin`)
- [ ] Admin login uses same auth flow
- [ ] Admin endpoints protected by role check

---

### TICKET: TP-019 - Menu Management API (Admin)
**Type:** Feature
**Priority:** High
**Estimate:** 8 points

**Description:**
CRUD endpoints for managing menu items and categories.

**Endpoints:**
```
POST   /api/v1/admin/categories          - Create category
PATCH  /api/v1/admin/categories/:id      - Update category
DELETE /api/v1/admin/categories/:id      - Delete category

POST   /api/v1/admin/menu-items          - Create menu item
PATCH  /api/v1/admin/menu-items/:id      - Update menu item
DELETE /api/v1/admin/menu-items/:id      - Delete menu item
PATCH  /api/v1/admin/menu-items/:id/availability - Toggle availability
```

**Acceptance Criteria:**
- [ ] Full CRUD for categories
- [ ] Full CRUD for menu items
- [ ] Can update item price, description, availability
- [ ] Can assign/remove modifiers from items
- [ ] Soft delete preferred (mark inactive vs delete)
- [ ] Validation on all inputs

---

### TICKET: TP-020 - Order Management API (Admin)
**Type:** Feature
**Priority:** High
**Estimate:** 5 points

**Description:**
Admin endpoints for viewing and managing all orders.

**Endpoints:**
```
GET   /api/v1/admin/orders                  - List all orders (paginated)
GET   /api/v1/admin/orders/:id              - Get order details
PATCH /api/v1/admin/orders/:id/status       - Update order status
GET   /api/v1/admin/orders/stats            - Order statistics
```

**Acceptance Criteria:**
- [ ] List orders with filters (status, date range, venue, bar)
- [ ] Pagination with total count
- [ ] Status update with note (for history)
- [ ] Basic stats: orders today, revenue today, avg order value
- [ ] Search by order number

---

## Summary

| Sprint | Dates | Focus Area | Key Deliverables |
|--------|-------|------------|------------------|
| 1 | Jan 13-26 | Foundation + Auth Start | Project setup, database, venue/menu APIs, registration, login |
| 2 | Jan 27 - Feb 9 | Auth Completion | Auth middleware, profiles, saved locations |
| 3 | Feb 10-23 | Orders (Part 1) | Order creation, retrieval, status tracking |
| 4 | Feb 24 - Mar 9 | Payments | Stripe integration, payment methods, checkout |
| 5 | Mar 10-23 | Admin | Menu management, order management |

**Total Estimated Points:** ~88 points
**Velocity Assumption:** 20-25 points per sprint

---

## Definition of Done

For each ticket to be considered complete:

1. **Code Complete** - Feature implemented and working
2. **Tests** - Unit tests for business logic, integration tests for APIs
3. **Documentation** - API endpoints documented (can be inline comments)
4. **Code Review** - PR reviewed and approved
5. **No Regressions** - Existing tests still pass
6. **Deployed** - Available on development/staging environment
