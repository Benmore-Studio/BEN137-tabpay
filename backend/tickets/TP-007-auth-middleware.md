# TP-007: Auth Middleware for Protected Routes

## Description
Create authentication middleware to protect routes that require a logged-in user. This middleware will verify JWT tokens, check session validity, and attach user data to the request.

## Acceptance Criteria
- [ ] Create `authMiddleware` that verifies JWT tokens from Authorization header
- [ ] Validate session exists in database and hasn't expired
- [ ] Attach decoded user data (`req.user`) for downstream handlers
- [ ] Return 401 for missing, invalid, or expired tokens
- [ ] Return 401 for sessions that don't exist or are expired
- [ ] Create `optionalAuthMiddleware` for routes that work with or without auth
- [ ] Clean up expired sessions periodically
- [ ] Write comprehensive tests

## Technical Details

### Middleware Functions
```typescript
// Required auth - returns 401 if not authenticated
authMiddleware(req, res, next)

// Optional auth - proceeds without user if not authenticated
optionalAuthMiddleware(req, res, next)
```

### Request Extension
```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    sessionId: string;
  };
}
```

### Error Responses
- `401 NO_TOKEN` - Missing Authorization header
- `401 INVALID_TOKEN` - Token verification failed
- `401 SESSION_NOT_FOUND` - No matching session in database
- `401 SESSION_EXPIRED` - Session has expired

## Files to Create/Modify
- `src/middleware/auth.ts` - Auth middleware
- `src/types/index.ts` - Add AuthenticatedRequest type
- `src/__tests__/auth-middleware.test.ts` - Tests

## Dependencies
- TP-006 (User Login & Sessions) - Completed

## Labels
- backend
- authentication
- middleware
