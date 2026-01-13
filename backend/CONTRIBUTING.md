# Contributing Guide

Code standards, git workflow, and PR process for the TabPay backend.

## Git Workflow

### Branch Naming

```
feature/TP-XXX-short-description    # New features
fix/TP-XXX-short-description        # Bug fixes
chore/TP-XXX-short-description      # Maintenance, refactoring
docs/TP-XXX-short-description       # Documentation only
```

**Examples:**
```
feature/TP-005-user-registration
fix/TP-012-order-status-validation
chore/TP-001-eslint-setup
docs/update-api-examples
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(auth): add user registration endpoint
fix(orders): validate modifier options before saving
docs(readme): add API endpoint examples
refactor(services): extract pricing calculation
test(auth): add login failure test cases
chore(deps): update prisma to 5.22
```

### Pull Request Process

1. **Create branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/TP-XXX-description
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push and create PR:**
   ```bash
   git push -u origin feature/TP-XXX-description
   ```

4. **PR Title Format:**
   ```
   [TP-XXX] Short description of change
   ```

5. **PR Description Template:**
   ```markdown
   ## Summary
   Brief description of what this PR does.

   ## Ticket
   Closes TP-XXX

   ## Changes
   - Added X endpoint
   - Updated Y service
   - Fixed Z validation

   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] Tested with frontend (if applicable)

   ## Screenshots (if applicable)
   ```

6. **Get review and merge:**
   - At least 1 approval required
   - All checks must pass
   - Squash and merge to main

## Code Standards

### TypeScript

**Use strict types - avoid `any`:**
```typescript
// Bad
function process(data: any) { ... }

// Good
function process(data: OrderCreateInput) { ... }
```

**Use interfaces for object shapes:**
```typescript
// Define in src/types/
interface OrderCreateInput {
  venueId: string;
  serviceBarId: string;
  items: OrderItemInput[];
  tip?: number;
}
```

**Export types from barrel files:**
```typescript
// src/types/index.ts
export * from './order';
export * from './user';
export * from './menu';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `order-service.ts` |
| Classes | PascalCase | `OrderService` |
| Functions | camelCase | `calculateTotal()` |
| Variables | camelCase | `orderItems` |
| Constants | UPPER_SNAKE | `MAX_ITEMS_PER_ORDER` |
| Types/Interfaces | PascalCase | `OrderStatus` |
| Enums | PascalCase | `PaymentMethod` |

### File Organization

**Controllers** - Handle HTTP request/response:
```typescript
// src/controllers/order.controller.ts
export async function createOrder(req: Request, res: Response) {
  const input = req.body as OrderCreateInput;
  const order = await orderService.create(input, req.user?.id);
  res.status(201).json(order);
}
```

**Services** - Business logic:
```typescript
// src/services/order.service.ts
export async function create(input: OrderCreateInput, userId?: string) {
  // Validate items
  // Calculate pricing
  // Create order in database
  // Return order
}
```

**Routes** - Define endpoints:
```typescript
// src/routes/orders.ts
const router = Router();

router.post('/', requireAuth, orderController.createOrder);
router.get('/:id', optionalAuth, orderController.getOrder);

export default router;
```

### Error Handling

**Use custom error classes:**
```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}
```

**Throw errors in services:**
```typescript
// In service
if (!menuItem) {
  throw new NotFoundError('Menu item');
}

if (!menuItem.available) {
  throw new ValidationError('Menu item is not available');
}
```

**Handle in error middleware:**
```typescript
// src/middleware/error.ts
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code
      }
    });
  }

  // Unknown error
  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
}
```

### API Response Format

**Success responses:**
```typescript
// Single resource
res.json({
  id: "uuid",
  name: "Classic Margarita",
  price: 14.00
});

// Collection
res.json({
  data: [...items],
  pagination: {
    total: 100,
    limit: 20,
    offset: 0
  }
});

// Created resource
res.status(201).json(newOrder);
```

**Error responses:**
```typescript
res.status(400).json({
  error: {
    message: "Invalid email format",
    code: "VALIDATION_ERROR",
    details: {
      field: "email",
      value: "not-an-email"
    }
  }
});
```

### Database Queries

**Use Prisma's typed queries:**
```typescript
// Good - fully typed
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    items: {
      include: {
        menuItem: true,
        modifiers: true
      }
    }
  }
});

// Avoid raw queries unless necessary
```

**Use transactions for multi-step operations:**
```typescript
const order = await prisma.$transaction(async (tx) => {
  // Create order
  const order = await tx.order.create({ ... });

  // Create order items
  await tx.orderItem.createMany({ ... });

  // Update service bar stats
  await tx.serviceBar.update({ ... });

  return order;
});
```

### Environment Variables

**Always use config module:**
```typescript
// src/config/index.ts
export const config = {
  port: parseInt(process.env.PORT || '3000'),
  jwtSecret: process.env.JWT_SECRET!,
  stripeKey: process.env.STRIPE_SECRET_KEY!,
  taxRate: parseFloat(process.env.DEFAULT_TAX_RATE || '0.0875'),
  serviceFee: parseFloat(process.env.TABPAY_SERVICE_FEE || '1.50'),
};

// Validate required vars on startup
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}
```

**Never hardcode secrets:**
```typescript
// Bad
const secret = "my-jwt-secret";

// Good
const secret = config.jwtSecret;
```

## Testing Guidelines

### Test File Location
```
src/
├── services/
│   ├── order.service.ts
│   └── order.service.test.ts    # Co-located tests
```

### Test Naming
```typescript
describe('OrderService', () => {
  describe('create', () => {
    it('should create order with valid items', async () => { });
    it('should throw ValidationError for unavailable items', async () => { });
    it('should calculate correct total with modifiers', async () => { });
  });
});
```

### What to Test
- **Services:** Business logic, calculations, validation
- **Controllers:** Request/response handling (integration tests)
- **Utils:** Helper functions

### What Not to Test
- Prisma queries directly (trust the ORM)
- Express routing (framework responsibility)
- Third-party libraries

## Code Review Checklist

When reviewing PRs, check for:

- [ ] **Functionality:** Does it do what the ticket requires?
- [ ] **Types:** Are types properly defined? No `any`?
- [ ] **Errors:** Are errors handled appropriately?
- [ ] **Security:** No secrets exposed? Input validated?
- [ ] **Performance:** No N+1 queries? Efficient logic?
- [ ] **Readability:** Clear naming? Comments where needed?
- [ ] **Tests:** Are there tests? Do they pass?

## Quick Reference

### Common Commands
```bash
npm run dev              # Start dev server
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes
npm run db:seed          # Reset and seed data
```

### Common Imports
```typescript
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { AppError, NotFoundError } from '../utils/errors';
import type { Request, Response } from 'express';
```

### Response Status Codes
| Code | Use Case |
|------|----------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |
