# TP-008: User Profile & Preferences API

## Description
Create endpoints for users to view and update their profile information and preferences (default tip, notifications, auto-reorder settings).

## Acceptance Criteria
- [ ] `GET /api/v1/users/me` - Get current user profile
- [ ] `PATCH /api/v1/users/me` - Update profile (firstName, lastName, phone, dateOfBirth)
- [ ] `GET /api/v1/users/me/preferences` - Get user preferences
- [ ] `PATCH /api/v1/users/me/preferences` - Update preferences
- [ ] `POST /api/v1/users/me/verify-age` - Submit age verification (dateOfBirth)
- [ ] `DELETE /api/v1/users/me` - Delete account (soft delete or cascade)
- [ ] All endpoints require authentication
- [ ] Validation for all input fields
- [ ] Write comprehensive tests

## Technical Details

### Endpoints

#### GET /api/v1/users/me
Returns current user profile (excludes password).

#### PATCH /api/v1/users/me
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "dateOfBirth": "ISO date string (optional)"
}
```

#### GET /api/v1/users/me/preferences
Returns user preferences object.

#### PATCH /api/v1/users/me/preferences
```json
{
  "defaultTipPercent": "number (0, 15, 18, 20)",
  "notifications": "boolean",
  "autoReorder": "boolean"
}
```

#### POST /api/v1/users/me/verify-age
```json
{
  "dateOfBirth": "ISO date string"
}
```
Sets `isAgeVerified: true` if user is 21+.

## Files to Create/Modify
- `src/controllers/user.controller.ts`
- `src/routes/users.ts`
- `src/routes/index.ts` - Add users routes
- `src/utils/validation.ts` - Add user validation schemas
- `src/__tests__/users.test.ts`

## Dependencies
- TP-007 (Auth Middleware)

## Labels
- backend
- user-management
- api
