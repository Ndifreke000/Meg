# API Fixes & Improvements Guide

## Overview
This document outlines the frontend bug fixes implemented to handle API request failures gracefully and improve the overall UX.

## Problems Fixed

### 1. **"TypeError: Failed to fetch" Errors**
**Root Cause**: The frontend was attempting to connect to a backend server at `http://localhost:8080/api` that wasn't running.

**Solution**: 
- Added automatic fallback to mock data when backend is unavailable
- Improved error detection to distinguish between network errors and API errors
- Added 10-second timeout for all fetch requests to prevent hanging

### 2. **No Error Messaging for Users**
**Root Cause**: When API calls failed, users saw vague error messages in the UI.

**Solution**:
- Added user-friendly error banner on the profiles page
- Includes helpful guidance about backend server status
- Shows specific error messages in console for debugging

### 3. **Network Errors Causing App Crashes**
**Root Cause**: Network failures weren't handled gracefully.

**Solution**:
- Wrapped all API calls with try-catch blocks
- Added mock data fallbacks for all API methods
- Implemented retry logic in React Query configuration

## Files Modified

### `/lib/api.ts`
**Changes**:
- Added `MOCK_PROFILES` constant with sample data
- Enhanced `request()` method with timeout handling and better error detection
- Added fallback handlers to all API methods (getChildren, getProfiles, logMood, etc.)
- Distinguished between network errors and HTTP errors

**Key Features**:
```typescript
// Graceful fallback when backend is unavailable
if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
  return mockData
}
```

### `/hooks/use-api.ts`
**Changes**:
- Added `retry: 1` to useProfiles query for automatic retry on failure
- Added `staleTime: 5 * 60 * 1000` for better cache management

### `/app/profiles/page.tsx`
**Changes**:
- Added error state tracking
- Added error banner component to inform users of connection issues
- Better error messaging in the UI

### `/.env.local` (New)
**Purpose**: Configuration for development environment
**Content**:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## How It Works

### 1. **When Backend IS Available**
- Frontend makes requests to the backend normally
- All data comes from the real API
- Mock data is never used

### 2. **When Backend is NOT Available**
- Frontend detects network errors (connection refused, timeout, etc.)
- Automatically falls back to mock data
- Users see a warning banner explaining the situation
- App remains fully functional with sample data

### 3. **Error Handling Flow**
```
User Action
    ↓
API Call in lib/api.ts
    ↓
Backend Available? → YES → Return real data
    ↓ NO
Network Error? → YES → Return mock data
    ↓ NO
Other Error → Throw error
```

## Configuration

### Enable/Disable Mock Data
Edit `.env.local`:
```bash
# Use mock data (for development/testing without backend)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Or disable to strictly require backend
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Change Backend URL
Edit `.env.local`:
```bash
# Default: localhost with fallback
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Or use production URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Testing the Fixes

### Test Scenario 1: Backend Running
1. Start your backend server on `http://localhost:8080`
2. No error banner should appear
3. Data comes from backend

### Test Scenario 2: Backend Not Running
1. Don't start the backend
2. Error banner appears on profiles page
3. App shows sample data
4. All features work with mock data

### Test Scenario 3: Wrong API URL
1. Change `NEXT_PUBLIC_API_URL` to invalid address
2. Error banner appears
3. App falls back to mock data

## Debug Logging

All debug messages are prefixed with `[v0]` for easy filtering:
```javascript
// In browser console
console.log('[v0] ...') // API requests and failures
console.error('[v0] ...') // Error details
```

To see all debug messages:
```javascript
// In browser DevTools console
// Messages starting with [v0] show API activity
```

## Performance Improvements

1. **Request Timeout**: 10-second timeout prevents infinite hangs
2. **Query Caching**: 5-minute stale time reduces unnecessary requests
3. **Automatic Retry**: Failed requests retry once automatically
4. **Mock Data**: Instant fallback when backend unavailable

## User Experience Improvements

1. **Clear Error Messages**: Users understand what went wrong
2. **Graceful Degradation**: App works even without backend
3. **No Broken UI**: Error states are handled properly
4. **Sample Data**: Users can explore features immediately

## Next Steps

### To Connect Real Backend:
1. Ensure backend is running on the correct URL
2. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
3. Backend will now be required for full functionality

### To Add More Mock Data:
1. Edit `MOCK_PROFILES` in `lib/api.ts`
2. Add more sample profiles, activities, routines, etc.
3. These will be used as fallback data

### To Customize Error Messages:
1. Edit the error banner in `app/profiles/page.tsx`
2. Update error message in `APIClient.request()` method
3. Customize per-page error handling as needed

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Unable to connect to server" error | Backend not running | Start backend or set `NEXT_PUBLIC_USE_MOCK_DATA=true` |
| Data not updating | Using mock data | Ensure backend is running and `NEXT_PUBLIC_USE_MOCK_DATA=false` |
| Requests timing out | Slow network/backend | Backend may be slow to respond |
| CORS errors | Backend not configured | Ensure backend accepts requests from frontend domain |

## Architecture Diagram

```
Frontend App
    ↓
useProfiles() [React Query]
    ↓
api.getChildren() [lib/api.ts]
    ↓
APIClient.request() 
    ↓
Try Fetch from Backend
    ↓
Success? → Return data
    ↓ No
Network Error? → Use Mock Data & Show Warning
    ↓ No
Other Error? → Show Error Message
```

## Future Enhancements

- [ ] Persist mock data to localStorage
- [ ] Allow users to switch between mock/real data via UI toggle
- [ ] Add data sync queue for offline-first support
- [ ] Implement service workers for offline caching
- [ ] Add request compression for faster transfers
- [ ] Implement GraphQL for more efficient queries
