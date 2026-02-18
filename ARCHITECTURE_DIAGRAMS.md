# Architecture Diagrams & Visual Guides

## 1. Data Flow - Before vs After

### BEFORE (With Errors)
```
User Action
    ↓
useProfiles() [React Query]
    ↓
api.getChildren() [lib/api.ts]
    ↓
fetch() to backend
    ↓
❌ Network Error / Timeout
    ↓
💥 Unhandled Error / App Crash
    ↓
User sees: "TypeError: Failed to fetch"
```

### AFTER (Graceful Fallback)
```
User Action
    ↓
useProfiles() [React Query]
    ↓
api.getChildren() [lib/api.ts]
    ↓
fetch() to backend
    ↓
Success? ──YES──→ Return Real Data ──→ ✅ Display Data
    │
    NO (Network Error)
    ↓
Check: USE_MOCK_DATA = true?
    ↓
    YES ──→ Return Mock Data ──→ ✅ Display Data
    │      Show Warning Banner
    NO
    ↓
Throw Error ──→ ⚠️ Show Error Message
```

---

## 2. Error Handling Flow

```
                    ┌─────────────────────┐
                    │   API Request       │
                    │  (10 sec timeout)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              SUCCESS (200)           FAILURE
                    │                     │
           Return JSON Data      Is it Network Error?
                    │             /              \
                    │          YES                NO
                    │           │                  │
              Display ──────→ Check Mock ──→ Throw Error
                   ↓            Mode?          │
                   ✅          /      \        │
                           YES      NO        │
                            │        │        │
                   Use Mock ─┤  Throw │────────┘
                   Data      │ Error  │
                    │        │        │
              Display ────┐   │        │
              Sample Data │   │        │
              + Warning   │   │        │
              Banner ────┘   │        │
                             │        │
                      Error Modal ────┘
                        Shown
```

---

## 3. API Client Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   APIClient Class                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  private request<T>(endpoint, options)           │   │
│  │  ┌─────────────────────────────────────────┐     │   │
│  │  │ 1. Get token from localStorage          │     │   │
│  │  │ 2. Validate token format                │     │   │
│  │  │ 3. Create fetch request                 │     │   │
│  │  │ 4. Add 10-second timeout                │     │   │
│  │  │ 5. Send to backend                      │     │   │
│  │  │ 6. Parse response                       │     │   │
│  │  │ 7. Handle errors                        │     │   │
│  │  └─────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Fallback Methods                                │   │
│  │  ┌─────────────────────────────────────────┐     │   │
│  │  │ getChildren()                           │     │   │
│  │  │ createChild()                           │     │   │
│  │  │ logMood()                               │     │   │
│  │  │ getMoodHistory()                        │     │   │
│  │  │ ... (15 more methods)                   │     │   │
│  │  │                                         │     │   │
│  │  │ Each with:                              │     │   │
│  │  │ - Try real API first                    │     │   │
│  │  │ - Catch network errors                  │     │   │
│  │  │ - Return mock data if enabled           │     │   │
│  │  └─────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Configuration Management

```
┌─────────────────────────────────────────────────┐
│        Environment Configuration                │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
    .env.local      next.config.mjs
        │                  │
    ┌───┴───┐         ┌────┴────┐
    │       │         │         │
API_URL  USE_MOCK   Pass to    Default
    │       │      Frontend    Values
    │       │         │         │
    └───┬───┴─────────┴────┬────┘
        │                  │
  process.env          Frontend
  [Server]              [Browser]
        │                  │
        │        window.location
        │        (NEXT_PUBLIC_*)
        │                  │
        └──────┬───────────┘
               │
        NEXT_PUBLIC_API_URL
        NEXT_PUBLIC_USE_MOCK_DATA
```

---

## 5. React Query Integration

```
┌────────────────────────────────────┐
│    useProfiles() Hook              │
├────────────────────────────────────┤
│                                    │
│  useQuery({                        │
│    queryKey: ['profiles']          │
│    queryFn: () => {                │
│      return api.getChildren()      │
│    }                               │
│    retry: 1           ← NEW        │
│    staleTime: 5min    ← NEW        │
│  })                                │
│                                    │
│  Returns: {                        │
│    data,     ← profiles array      │
│    isLoading ← loading state       │
│    error,    ← error if failed     │
│    ...       ← other utilities     │
│  }                                 │
│                                    │
└────────────────────────────────────┘
         │
         └──────────────────┐
                            │
                  Caching Strategy
                  ┌─────────┬──────────┐
                  │         │          │
            Fresh Data   Stale Data   Revalidate
            (0-5 min)    (5+ min)     (refetch)
                │           │           │
          Use from       Mark Stale   Fetch New
          Cache          Show Old      Replace
          (Fast)         Data (Fast)   with New
```

---

## 6. Error State Management

```
                    ┌──────────────┐
                    │  API Error   │
                    └──────┬───────┘
                           │
                    ┌──────┴──────────┐
                    │                 │
            Network Error      HTTP Error
            (isNetworkError=    (status code)
             true)                  │
                │                   │
        ┌──────────────┐    ┌───────┴────────┐
        │              │    │                │
    Use Mock       No Mock  401 Unauth   500 Server
    Data &        Throw     Error        Error
    Warn User     Error     Message      Message
        │           │           │            │
        │           │           │            │
    Show Banner Show Modal   Show Modal    Show Modal
    "Connection  with error  "Please      "Backend
     Issue"      details     Log In"      Error"
```

---

## 7. Mock Data System

```
┌───────────────────────────────────────────┐
│        MOCK_PROFILES (in lib/api.ts)      │
├───────────────────────────────────────────┤
│                                           │
│  [                                        │
│    {                                      │
│      id: 'mock-1',                        │
│      name: 'Emma',                        │
│      role: 'child',                       │
│      age: 7,                              │
│      special_needs: ['ADHD'],             │
│      created_at: ISO_DATE                 │
│    },                                     │
│    {                                      │
│      id: 'mock-2',                        │
│      name: 'Sarah',                       │
│      role: 'parent',                      │
│      created_at: ISO_DATE                 │
│    }                                      │
│  ]                                        │
│                                           │
└───────────────────────────────────────────┘
         │
         ├─→ Used by getChildren()
         ├─→ Used by getProfiles()
         ├─→ Used when network fails
         └─→ Used when USE_MOCK_DATA=true
```

---

## 8. Request Timeout Mechanism

```
┌─────────────────────────────────────┐
│      Promise.race() Pattern         │
├─────────────────────────────────────┤
│                                     │
│  Promise.race([                     │
│                                     │
│    fetch(url)  ────────────┐        │
│       │                    │        │
│       │ (response)         │        │
│       └──────────────┬─────┘        │
│                      │              │
│                      ↓              │
│              ┌───────────────┐      │
│              │ Returns First │      │
│              │ Promise to    │      │
│              │ Settle        │      │
│              └───────────────┘      │
│                      │              │
│                      ↑              │
│       timeout(10s) ──┴─────────┐    │
│          │                     │    │
│          │ (10 sec passes)     │    │
│          └─────────────────────┘    │
│                                     │
│  Winner = First to complete         │
│  Fetch finishes? ─→ Use response    │
│  Timeout first? ─→ Throw error      │
│                                     │
└─────────────────────────────────────┘
```

---

## 9. UI Component Hierarchy

```
┌──────────────────────────────────────────────┐
│              ProfilesPage                    │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Error Banner (NEW)                    │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ Show IF hasError = true          │  │  │
│  │  │ Amber bg, warning icon, message  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Page Header                          │  │
│  │  Title: "Profiles & Setup"            │  │
│  │  Subtitle: Description                │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Family Profiles Section               │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Profile Card 1 (Emma)           │  │  │
│  │  │  ┌──────────────────────────────┐│  │  │
│  │  │  │ Name, Age, Special Needs    ││  │  │
│  │  │  │ Created Date, Action Button  ││  │  │
│  │  │  └──────────────────────────────┘│  │  │
│  │  └──────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Profile Card 2 (Sarah)          │  │  │
│  │  │  ...                             │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Setup Checklist Section               │  │
│  │  - Item 1 (✓ completed)                │  │
│  │  - Item 2 (○ not completed)            │  │
│  │  - Item 3 (○ not completed)            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Add Family Member Button              │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 10. Lifecycle - API Call Journey

```
User clicks
"Create Profile"
     │
     ↓
Form submitted
     │
     ↓
createProfile.mutateAsync(data)
     │
     ↓
api.createChild(data)
     │
     ├─ Try: request<Profile>('/children', {POST})
     │      │
     │      ├─ fetch() to backend
     │      │
     │      ├─ Success? ─YES─→ Return data ────┐
     │      │                                   │
     │      └─ Error? ──YES─→ Network Error? ──┐
     │                       │                  │
     │                   NO──┘  YES             │
     │                         │               │
     │                    Is Mock OK? ────────┐│
     │                    /          \        ││
     │                 YES            NO     ││
     │                  │              │     ││
     │           Return Mock  Return Error ││
     │           Data            │        ││
     │                           │        ││
     └─────────────────────────┬─┴────────┘│
                               │           │
                            Catch error ──┘
                               │
                      Try-Catch handles:
                      - Real data
                      - Mock data  
                      - Error message
                               │
                               ↓
                    Update React Query
                      └─ invalidateQueries
                           invalidate cache
                               │
                               ↓
                      Show Toast Message
                      ✅ Success or ❌ Error
                               │
                               ↓
                          UI Updates
```

---

## 11. Development vs Production Mode

```
┌──────────────────────────────────────────────────┐
│            Development Mode                      │
│  (NEXT_PUBLIC_USE_MOCK_DATA=true)               │
├──────────────────────────────────────────────────┤
│                                                  │
│  User Action                                    │
│     │                                           │
│     ├─→ Backend available? ──YES──→ Use real   │
│     │                               data        │
│     │                                           │
│     └─→ Backend unavailable? ─YES──→ Use mock   │
│                                       data +    │
│                                       warning   │
│                                       banner    │
│                                                  │
│  Benefits:                                      │
│  ✓ Develop without backend                      │
│  ✓ Quick feedback                              │
│  ✓ Can test with real backend when ready       │
│                                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│           Production Mode                        │
│  (NEXT_PUBLIC_USE_MOCK_DATA=false)              │
├──────────────────────────────────────────────────┤
│                                                  │
│  User Action                                    │
│     │                                           │
│     ├─→ Backend available? ──YES──→ Use real   │
│     │                               data        │
│     │                                           │
│     └─→ Backend unavailable? ─YES──→ Show      │
│                                       error     │
│                                       message   │
│                                       (no mock)│
│                                                  │
│  Benefits:                                      │
│  ✓ Requires real backend                        │
│  ✓ No misleading sample data                    │
│  ✓ Users see when backend fails                 │
│  ✓ Clear error states                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 12. Browser Console Output Example

```
┌────────────────────────────────────────────┐
│   Browser DevTools Console                 │
├────────────────────────────────────────────┤
│                                            │
│ [v0] API request: http://localhost:8080/  │
│      api/children                          │
│                                            │
│ [v0] Network/fetch error: Failed to fetch  │
│                                            │
│ [v0] Using mock data for getChildren       │
│                                            │
│ (App continues working with sample data)   │
│                                            │
│ User sees:                                 │
│ ┌────────────────────────────────────────┐ │
│ │⚠️  Connection Issue                    │ │
│ │                                        │ │
│ │Unable to connect to the server.        │ │
│ │Using sample data for demonstration.    │ │
│ │                                        │ │
│ │Make sure the backend server is running,│ │
│ │or the app will use sample data.        │ │
│ └────────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

## Summary

These diagrams show:
1. **Data Flow** - How requests are processed
2. **Error Handling** - What happens when things fail
3. **Architecture** - How components fit together
4. **Configuration** - How settings control behavior
5. **Caching** - How data is managed
6. **Lifecycle** - Journey of an API call
7. **UI** - Visual component structure
8. **Modes** - Development vs Production differences

The key improvement: **Graceful Degradation**
- Instead of crashing, the app provides fallback data
- Users are informed of issues
- All features remain functional
