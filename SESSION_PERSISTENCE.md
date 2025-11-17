# Session Persistence - How It Works Now

## SessionStorage Keys (Persisted in Browser)

When user logs in, these are stored:
```javascript
sessionStorage.setItem('authToken', jwtToken)           // JWT from backend
sessionStorage.setItem('currentUser', username)          // Username string
sessionStorage.setItem('currentRole', role)              // 'admin' or 'buyer'
sessionStorage.setItem('userLoggedIn', 'true')          // Legacy flag
```

## SessionStorage Behavior

- **Persists during:** All route navigations within same tab
- **Persists during:** Page refresh (F5)
- **Cleared when:** Browser tab is closed
- **Cleared when:** User clicks "Logout" button (manual clear)
- **NOT cleared when:** Navigating to Shop/Men/Women/Kids routes

## How Frontend Uses SessionStorage

### 1. Navbar Component
```javascript
// Check if logged in
const loggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
const user = sessionStorage.getItem('currentUser');
const role = sessionStorage.getItem('currentRole');

// Show "Seller Panel" button ONLY if role === 'admin'
if (role === 'admin') {
  // Display green "Seller Panel" button
}
```

### 2. AdminPanel Component
```javascript
// Check if user has valid auth token (not just the flag)
if (!sessionStorage.getItem('authToken')) {
  navigate('/login');  // Only redirect if NO token exists
}
// Otherwise: Allow access, even if navigating from Shop
```

### 3. ProductList Component
```javascript
// Get token for API requests
const token = sessionStorage.getItem('authToken');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

// Make API call
fetch('/api/products', { headers })
```

### 4. AddProduct Component
```javascript
// Set product owner to current user
const userId = sessionStorage.getItem('currentUser');
// Backend automatically sets owner_id from JWT token (safer)
```

## Login Flow

```
1. User enters admin / admin123
↓
2. Frontend: POST /api/auth/login with credentials
↓
3. Backend: Verify password, generate JWT token, return {user, token}
↓
4. Frontend: Store in sessionStorage
   - authToken
   - currentUser
   - currentRole
   - userLoggedIn
↓
5. Redirect to /admin-panel (for admin role)
↓
6. User can now click Shop/Men/Women/Kids freely
   - SessionStorage NOT cleared
   - Navbar shows "Seller Panel" button
↓
7. Click "Seller Panel" button
   - Navigate to /admin-panel
   - SessionStorage still exists
   - AdminPanel component doesn't redirect
```

## Logout Flow

```
1. User clicks "Logout" button
↓
2. Frontend: Clear all sessionStorage keys
   - sessionStorage.removeItem('userLoggedIn')
   - sessionStorage.removeItem('currentUser')
   - sessionStorage.removeItem('currentRole')
   - sessionStorage.removeItem('authToken')
↓
3. Redirect to /login
↓
4. User must login again
```

## Tab Isolation

- **Same Tab:** SessionStorage shared
- **New Tab:** New sessionStorage (must login again)
- **Private/Incognito:** Cleared when window closes

Example:
```
Tab 1: Login as admin → sessionStorage created
Tab 2: Open localhost:5173 → new sessionStorage (empty)
Tab 1: Still logged in ✓
Tab 2: Shows login page ✓
```

## Debugging Tips

### Check current session in browser console:
```javascript
// See all stored data
console.log(sessionStorage)

// Check specific values
console.log(sessionStorage.getItem('authToken'))
console.log(sessionStorage.getItem('currentUser'))

// Clear manually (for testing)
sessionStorage.clear()
```

### Common Problems:

**Problem:** Logged in but can't access admin panel
```
Solution: 
- Check if sessionStorage.getItem('authToken') exists
- If not: Login again
- If yes: Check console for errors
```

**Problem:** "I see Shop button but no Seller Panel button"
```
Solution:
- Check if sessionStorage.getItem('currentRole') === 'admin'
- If not: Login with admin account (not buyer account)
```

**Problem:** Going to Shop logs me out
```
Solution (OLD - NOW FIXED):
- Was caused by AdminPanel checking userLoggedIn flag
- NOW: AdminPanel only checks if authToken exists
- Session should persist across all routes
```

---

## Why We Changed This

### Before (Broken)
```javascript
// AdminPanel.jsx - OLD
useEffect(() => {
  if (sessionStorage.getItem('userLoggedIn') !== 'true') {
    navigate('/login');  // ❌ Could redirect unexpectedly
  }
}, [navigate]);
```

**Problem:** This effect ran on every render. If any route change happened, it checked the flag and could redirect if flag wasn't found.

### After (Fixed)
```javascript
// AdminPanel.jsx - NEW
useEffect(() => {
  if (!sessionStorage.getItem('authToken')) {
    navigate('/login');  // ✓ Only redirect if NO token
  }
}, [navigate]);
```

**Solution:** Only redirect if the actual JWT token is missing. This is more reliable because:
1. JWT token proves user is authenticated to backend
2. It's checked before any sensitive operations
3. It's harder to accidentally clear
4. More secure than simple boolean flag

---

## Summary

✅ **SessionStorage persists** across all route navigations
✅ **Admin users can browse** Shop/Men/Women/Kids freely  
✅ **Seller Panel button** in navbar for easy access
✅ **Session only clears** on logout or tab close
✅ **Backend validates** JWT on every API call

*No more mysterious logouts! 🎉*
