# TabPay Backend

Casino ordering REST API for the TabPay mobile PWA. Enables guests to order food and drinks directly from their slot machine or gaming table.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Set up database
npm run db:push      # Push schema to database
npm run db:seed      # Seed with demo data

# 4. Start development server
npm run dev          # Runs on http://localhost:3000
```

## Project Overview

**What is TabPay?**
A Progressive Web App that lets casino patrons order drinks and food without leaving their seat. They scan a QR code, browse the menu, pay with Apple Pay/Google Pay/card, and a server delivers to their location.

**This Backend Provides:**
- REST API for venues, menus, and orders
- User authentication (JWT-based)
- Guest checkout support
- Stripe payment processing
- Order status tracking

**Target Client:** Potawatomi Casino (demo), expandable to other venues

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Language | TypeScript 5.x |
| Database | PostgreSQL 14+ |
| ORM | Prisma 5.x |
| Auth | JWT (jsonwebtoken) |
| Payments | Stripe |
| Validation | Zod |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Demo data seeding
│   └── migrations/        # Database migrations
├── src/
│   ├── index.ts           # App entry point
│   ├── config/            # Environment & app config
│   ├── middleware/        # Express middleware (auth, errors, etc.)
│   ├── routes/            # Route definitions
│   │   ├── auth.ts
│   │   ├── venues.ts
│   │   ├── menu.ts
│   │   ├── orders.ts
│   │   └── admin.ts
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript type definitions
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## API Overview

### Public Endpoints (No Auth)
```
GET  /api/v1/venues                    # List venues
GET  /api/v1/venues/:id                # Venue details
GET  /api/v1/venues/:id/bars           # Service bars for venue
GET  /api/v1/bars/:id/menu             # Menu for a service bar
GET  /api/v1/menu-items/:id            # Item details with modifiers
GET  /api/v1/orders/number/:orderNum   # Order by number (guest access)
```

### Auth Endpoints
```
POST /api/v1/auth/register             # Create account
POST /api/v1/auth/login                # Get JWT token
POST /api/v1/auth/logout               # Invalidate session
POST /api/v1/auth/refresh              # Refresh token
```

### Protected Endpoints (Require JWT)
```
GET    /api/v1/profile                 # Current user profile
PATCH  /api/v1/profile                 # Update profile
GET    /api/v1/profile/payment-methods # Saved payment methods
POST   /api/v1/orders                  # Create order
GET    /api/v1/orders                  # User's order history
GET    /api/v1/orders/:id              # Order details
POST   /api/v1/orders/:id/pay          # Pay for order
```

### Admin Endpoints (Require Admin Role)
```
POST   /api/v1/admin/menu-items        # Create menu item
PATCH  /api/v1/admin/menu-items/:id    # Update menu item
GET    /api/v1/admin/orders            # All orders
PATCH  /api/v1/admin/orders/:id/status # Update order status
```

## Database Schema

### Core Models
- **User** - Registered users with auth
- **Venue** - Casino locations
- **ServiceBar** - Bar/station within a venue
- **Category** - Menu categories (Cocktails, Beer, Snacks, etc.)
- **MenuItem** - Individual menu items
- **Modifier** - Customization options (Size, Ice, Garnish)
- **Order** - Customer orders with items and payment info

See `prisma/schema.prisma` for complete schema with all fields and relationships.

### Key Relationships
```
Venue → has many → ServiceBar → has many → MenuItem
MenuItem → has many → Modifier → has many → ModifierOption
User → has many → Order → has many → OrderItem
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/tabpay"

# Server
PORT=3000
NODE_ENV=development

# Auth
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Stripe (test keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Business Config
TABPAY_SERVICE_FEE=1.50
DEFAULT_TAX_RATE=0.0875
```

## NPM Scripts

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Compile TypeScript
npm run start         # Run compiled JS (production)

npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to DB (dev)
npm run db:migrate    # Create migration
npm run db:seed       # Seed demo data
npm run db:studio     # Open Prisma Studio GUI
npm run db:reset      # Reset database
```

## Development Workflow

### 1. Making Schema Changes
```bash
# Edit prisma/schema.prisma
npm run db:push           # Apply changes (dev only)
npm run db:generate       # Regenerate client
```

### 2. Adding a New Endpoint
1. Define route in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic in `src/services/`
4. Add types in `src/types/`

### 3. Testing Endpoints
```bash
# Using curl
curl http://localhost:3000/api/v1/venues

# Using Prisma Studio to inspect data
npm run db:studio
```

## Key Concepts

### Guest vs Authenticated Orders
- **Guest**: No account needed. Order tracked by order number. Email/phone required.
- **Authenticated**: Full order history, saved payment methods, saved locations.

### Order Flow
```
1. Browse menu → 2. Add to cart → 3. Enter location → 4. Pay → 5. Track status
```

### Order Statuses
```
received → preparing → delivering → delivered
                ↓
            cancelled
```

### Pricing Calculation
```
subtotal    = sum of (item price + modifiers) × quantity
tax         = subtotal × 8.75%
serviceFee  = $1.50 (TabPay fee)
total       = subtotal + tax + tip + serviceFee
```

## Related Documentation

- [SETUP.md](./SETUP.md) - Detailed environment setup
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Code standards & PR process
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & decisions
- [SPRINT_1.md](./SPRINT_1.md) - Sprint tickets & planning
- [prisma/schema.prisma](./prisma/schema.prisma) - Database schema

## Frontend Repository

The React PWA frontend lives in `../frontend/`. See its README for frontend-specific setup.

## Questions?

- Check existing documentation first
- Review the Prisma schema for data structure questions
- Look at `SPRINT_1.md` for feature requirements
