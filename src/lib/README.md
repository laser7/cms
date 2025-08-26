# API Structure

This directory contains the modular API structure for the CMS application.

## Structure

### `auth.ts`
Authentication utilities for managing localStorage and auth state.

### `api-client.ts`
Core API client that handles all HTTP requests with authentication.

### `auth-api.ts`
Authentication-related API calls (login, logout, profile).

### `posts-api.ts`
Post-related API calls (CRUD operations).

## Usage

```typescript
// Import specific modules
import { loginUser } from '@/lib/auth-api';
import { getPosts } from '@/lib/posts-api';
import { getAuthToken } from '@/lib/auth';

// Or use the legacy utils/api.ts (maintains backward compatibility)
import { loginUser, getPosts } from '@/utils/api';
```

## Benefits

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Testability**: Each module can be tested independently
4. **Scalability**: Easy to add new API modules as the app grows
5. **Backward Compatibility**: Existing code continues to work via utils/api.ts
