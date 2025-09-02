# API Library Documentation

This directory contains all the API client functions for the CMS system.

## Available APIs

### Authentication API (`auth-api.ts`)
- `login()` - User login
- `logout()` - User logout
- `getUserInfo()` - Get current user information

### Users API (`users-api.ts`)
- `getUsers()` - Get list of users
- `getUserById()` - Get user by ID
- `createUser()` - Create new user
- `updateUser()` - Update existing user
- `deleteUser()` - Delete user

### Dashboard API (`dashboard-api.ts`)
- `getDashboardStats()` - Get dashboard statistics

### Audio API (`audio-api.tsx`)
- `getSoundtracks()` - Get list of soundtracks with pagination and filtering
- `getSoundtrackById()` - Get single soundtrack by ID
- `createSoundtrack()` - Create new soundtrack
- `updateSoundtrack()` - Update existing soundtrack
- `deleteSoundtrack()` - Delete soundtrack

### Yijing API (`yijing-api.ts`)
- `getYijingPosts()` - Get list of Yijing posts
- `getYijingPostById()` - Get Yijing post by ID
- `createYijingPost()` - Create new Yijing post
- `updateYijingPost()` - Update existing Yijing post
- `deleteYijingPost()` - Delete Yijing post

## Audio API Details

The Audio API provides comprehensive management for soundtrack files in the CMS system.

### Endpoints
- `GET /admin/soundtracks` - List soundtracks with pagination and filtering
- `GET /admin/soundtracks/:id` - Get soundtrack by ID
- `POST /admin/soundtracks` - Create new soundtrack
- `PUT /admin/soundtracks/:id` - Update soundtrack
- `DELETE /admin/soundtracks/:id` - Delete soundtrack

### Query Parameters for List Endpoint
- `page` (number, default: 1) - Page number for pagination
- `page_size` (number, default: 10) - Number of items per page
- `search` (string, optional) - Search term for title/composer
- `category` (string, optional) - Filter by category

### Response Format
All API responses follow this structure:
```typescript
{
  code: number;      // 0 for success, 1 for error
  data: T;          // Response data
  error: string;    // Error message (empty if success)
  msg: string;      // Status message
}
```

### Soundtrack Data Structure
```typescript
interface Soundtrack {
  id: number;
  title: string;
  composer: string;
  category: string;
  cover: string;        // URL to cover image
  url: string;          // URL to audio file
  created_at: string;   // ISO date string
}
```

## Usage Examples

### Fetching Soundtracks
```typescript
import { getSoundtracks } from '@/lib/audio-api';

// Get first page with 20 items
const response = await getSoundtracks({ page: 1, page_size: 20 });

// Search for specific soundtracks
const searchResponse = await getSoundtracks({ 
  search: '易经', 
  category: '易经讲解' 
});

if (response.code === 0) {
  const soundtracks = response.data.list;
  const total = response.data.total;
  // Process soundtracks...
}
```

### Creating a Soundtrack
```typescript
import { createSoundtrack } from '@/lib/audio-api';

const newSoundtrack = {
  title: '易经讲解 - 第一卦',
  composer: '张三',
  category: '易经讲解',
  cover: 'https://example.com/cover.jpg',
  url: 'https://example.com/audio.mp3'
};

const response = await createSoundtrack(newSoundtrack);
if (response.code === 0) {
  console.log('Soundtrack created:', response.data);
}
```

### Error Handling
```typescript
try {
  const response = await getSoundtracks();
  if (response.code === 0) {
    // Success
    console.log(response.data);
  } else {
    // API error
    console.error('API Error:', response.msg);
  }
} catch (error) {
  // Network or other error
  console.error('Network Error:', error);
}
```

## Authentication

All API calls automatically include the authentication token from localStorage. The token is managed by the `AuthContext` and automatically refreshed when needed.

## Development vs Production

The API client automatically handles different environments:
- **Development**: Uses relative paths that work with Next.js API proxy
- **Production**: Uses the full API base URL

## Error Handling

The API client provides comprehensive error handling:
- Network errors
- CORS errors
- Authentication errors (401)
- Server errors
- JSON parsing errors

All errors are logged to the console and returned in a consistent format for UI handling.
