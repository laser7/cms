# CORS Solutions for CMS Project

## Problem
The logout functionality was failing due to CORS policy blocking the `Authorization` header in preflight requests to `https://dev.guara.fun/admin/logout`.

## Solution: Next.js Proxy (Recommended by Backend Team)

### Primary Solution: Automatic Proxy
- **Next.js Proxy Configuration**: Added rewrite rules in `next.config.ts`
- **Automatic Detection**: API client automatically uses proxy in development
- **CORS Bypass**: All API requests go through `/api/*` → `https://dev.guara.fun/*`
- **No Code Changes**: Works transparently with existing API calls

### How It Works
1. **Development**: All API calls use `/api/endpoint` (proxied to backend)
2. **Production**: All API calls use direct `https://dev.guara.fun/endpoint`
3. **Automatic**: No manual switching required

### Enhanced Error Handling
- Specific CORS error detection and logging
- Graceful error handling for network issues

## Usage

### Automatic Proxy (Current Implementation)
The API client now automatically uses the proxy in development:
1. **Development**: All requests go through `/api/*` → `https://dev.guara.fun/*`
2. **Production**: All requests go directly to `https://dev.guara.fun/*`
3. **No Configuration**: Works out of the box

### Testing the Proxy
1. Start your development server: `npm run dev`
2. All API calls will automatically use the proxy
3. Check browser network tab - you should see requests to `/api/admin/logout` instead of `https://dev.guara.fun/admin/logout`

### Error Handling
The system includes robust error handling:
1. Enhanced CORS error detection and logging
2. Local cleanup regardless of API response
3. Graceful degradation for network issues

## Testing
The logout functionality now works in the following scenarios:
- ✅ **Proxy-based logout** (primary solution)
- ✅ Local cleanup even if API fails completely
- ✅ Proper error handling and user feedback

## Files Modified
- `src/lib/api-client.ts` - Automatic proxy detection and CORS handling
- `src/lib/auth-api.ts` - Proxy support and simplified logout
- `src/contexts/AuthContext.tsx` - Simplified logout logic with proxy
- `next.config.ts` - Proxy configuration for development
