# Token Refresh Implementation - Key Takeaways

[References](https://claude.ai/share/2f4e4882-bf8b-4965-afbb-9240355941dd)

## 🎯 Initial Problem
**Question**: How to automatically refresh access tokens when they expire without manual intervention?

**Context**: 
- Backend issues access + refresh tokens on login
- Access token in Authorization header, refresh token in httpOnly cookie
- Need automatic refresh when access token expires on protected routes

---

## 🤔 Key Discovery Process

### 1. Server-Side vs Client-Side Approach
**Initial Thought**: Handle token refresh in server-side middleware
- **Challenge Identified**: Original request would die, complex memory management needed
- **Key Realization**: Client-side handling is simpler and more reliable

### 2. Understanding the Authentication Flow
**Current Setup**:
- `deserializeUser` middleware: Verifies tokens globally, attaches user to req
- `requireAuth` middleware: Guards protected routes
- **Insight**: Already detecting expired tokens (401 in catch block)

### 3. Client-Side Detection Mechanism
**Question Explored**: How does client detect expired tokens?
- **Answer**: Server returns 401 → Client intercepts this response
- **Key Concept**: Wrap HTTP requests with custom logic

---

## 🔑 Core Technical Solutions

### 1. HTTP Request Interception
```javascript
// Pattern: Wrapper function that handles retries
const myCustomFetch = async (url, options) => {
  let response = await fetch(url, options)
  
  if (response.status === 401) {
    // Auto-refresh logic here
  }
  
  return response
}
```

### 2. Cross-Origin Cookie Handling
**Problem**: How to send httpOnly cookies across different ports?
- **Solution**: CORS with `credentials: true` + `credentials: 'include'` in fetch
- **Key Insight**: Browser automatically sends cookies, JS doesn't need to read them

### 3. Token Storage Strategy
**Challenge**: Where to store and update access tokens?
- **Solution**: Redux store + localStorage for persistence
- **Pattern**: Global state management for shared token access

### 4. Race Condition Prevention
**Problem**: Multiple simultaneous requests triggering refresh
- **Solution**: Single refresh promise, other requests wait and retry

---

## 📋 Complete Implementation Strategy

### 1. Token Management (Redux)
- Store access token in Redux + localStorage
- Actions: `setTokens`, `updateAccessToken`, `logout`
- Persistence across browser sessions

### 2. API Client Class
- Centralized request handling
- Automatic token injection
- 401 detection and refresh logic
- Prevent multiple simultaneous refreshes

### 3. Refresh Flow
1. Request fails with 401
2. Call `/refresh` endpoint (sends httpOnly cookie automatically)
3. Update Redux store with new access token
4. Retry original request with new token
5. Handle edge cases (refresh token expired → redirect to login)

### 4. Component Integration
```javascript
// Simple usage - complexity hidden
const response = await api.get('/api/user/profile')
```

---

## 🎭 User Experience
- **Seamless**: Token refresh happens transparently
- **No interruption**: Original requests complete successfully
- **Fallback**: Redirect to login only when refresh token expires
- **No manual intervention**: Fully automated process

---

## 🏗️ Architecture Benefits

### Client-Side Approach Wins Because:
1. **Simpler flow**: No complex server-side request memory management
2. **Better separation**: Auth logic stays in client, business logic in server
3. **Scalable**: Works with any number of simultaneous requests
4. **Maintainable**: Clear responsibilities and error handling

### Key Technical Insights:
- **Browser handles cookies**: No need for JS to read httpOnly cookies
- **Redux for global state**: Shared token access across components  
- **Singleton pattern**: One API client instance prevents conflicts
- **Promise-based**: Clean async/await patterns throughout

---

## 🚀 Final Implementation Checklist

### Backend Requirements:
- ✅ CORS configured with `credentials: true`
- ✅ `/refresh` endpoint accepts httpOnly cookies
- ✅ Returns new access token in JSON response

### Frontend Requirements:
- ✅ Redux store for token management
- ✅ API client with auto-refresh logic  
- ✅ All requests use centralized API client
- ✅ Proper error handling and user redirection

### Critical Success Factors:
- **Race condition handling**: Single refresh promise
- **Token persistence**: localStorage + Redux
- **Proper CORS setup**: Credentials included in requests
- **Edge case handling**: Refresh token expiration → login redirect

---

## 💡 Learning Journey Highlights

**From**: Manual Postman token refresh  
**To**: Fully automated, transparent token management

**Key Mental Model**: Think of it as an "intelligent HTTP client" that learns from failures and automatically recovers, keeping the user experience smooth and uninterrupted.
---


## 👨🏻‍💻 Code Setup
```javascript
// ============================================
// 1. TOKEN STORE (Redux Toolkit Slice)
// ============================================
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken') || null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.isAuthenticated = true
      
      // Store in localStorage for persistence
      localStorage.setItem('accessToken', action.payload.accessToken)
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.accessToken = null
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
    }
  }
})

export const { setTokens, updateAccessToken, logout } = authSlice.actions
export default authSlice.reducer

// ============================================
// 2. API CLIENT WITH AUTO-REFRESH
// ============================================
import { store } from './store' // Your Redux store
import { updateAccessToken, logout } from './authSlice'

class ApiClient {
  constructor() {
    this.isRefreshing = false
    this.refreshPromise = null
  }

  async makeRequest(url, options = {}) {
    try {
      // Get current token from Redux store
      const state = store.getState()
      const accessToken = state.auth.accessToken

      // Add authorization header if token exists
      const requestOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        credentials: 'include' // Important: includes httpOnly cookies
      }

      // Make the initial request
      let response = await fetch(url, requestOptions)

      // If 401 and we have a token, try to refresh
      if (response.status === 401 && accessToken) {
        response = await this.handleTokenRefresh(url, requestOptions)
      }

      return response

    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async handleTokenRefresh(originalUrl, originalOptions) {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      await this.refreshPromise
      // Retry with updated token after refresh completes
      const newToken = store.getState().auth.accessToken
      const updatedOptions = {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          'Authorization': `Bearer ${newToken}`
        }
      }
      return fetch(originalUrl, updatedOptions)
    }

    // Start refresh process
    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const newToken = await this.refreshPromise
      
      if (newToken) {
        // Retry original request with new token
        const updatedOptions = {
          ...originalOptions,
          headers: {
            ...originalOptions.headers,
            'Authorization': `Bearer ${newToken}`
          }
        }
        return fetch(originalUrl, updatedOptions)
      } else {
        // Refresh failed, redirect to login
        this.redirectToLogin()
        throw new Error('Authentication required')
      }
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  async performTokenRefresh() {
    try {
      const refreshResponse = await fetch('/refresh', {
        method: 'POST',
        credentials: 'include' // Sends httpOnly refresh token cookie
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const newAccessToken = data.accessToken // Adjust based on your API response

        // Update Redux store with new token
        store.dispatch(updateAccessToken(newAccessToken))
        
        return newAccessToken
      } else {
        // Refresh failed, user needs to log in again
        store.dispatch(logout())
        return null
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      store.dispatch(logout())
      return null
    }
  }

  redirectToLogin() {
    // Redirect to login page (adjust based on your routing setup)
    window.location.href = '/login'
    // OR if using React Router: navigate('/login')
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// ============================================
// 3. CONVENIENT API METHODS
// ============================================
export const api = {
  get: (url, options) => apiClient.makeRequest(url, { ...options, method: 'GET' }),
  post: (url, data, options) => apiClient.makeRequest(url, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(data)
  }),
  put: (url, data, options) => apiClient.makeRequest(url, {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(data)
  }),
  delete: (url, options) => apiClient.makeRequest(url, { ...options, method: 'DELETE' })
}

// ============================================
// 4. USAGE IN REACT COMPONENTS
// ============================================

// Example: User Profile Component
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { api } from './apiClient'

function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useSelector(state => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/user/profile')
      
      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (newData) => {
    try {
      const response = await api.put('/api/user/profile', newData)
      
      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>User Profile</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {/* Profile editing form would go here */}
        </div>
      )}
    </div>
  )
}

// ============================================
// 5. LOGIN COMPONENT (Sets Initial Tokens)
// ============================================

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setTokens } from './authSlice'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: allows setting httpOnly cookies
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store tokens in Redux (refresh token is already in httpOnly cookie)
        dispatch(setTokens({
          accessToken: data.accessToken,
          user: data.user
        }))

        navigate('/dashboard')
      } else {
        // Handle login error
        const error = await response.json()
        console.error('Login failed:', error.message)
      }
    } catch (error) {
      console.error('Login request failed:', error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  )
}

// ============================================
// 6. BACKEND CORS CONFIGURATION (For Reference)
// ============================================

/*
// In your Express.js backend
import cors from 'cors'

app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true // CRITICAL: Allows cookies to be sent/received
}))

// Your refresh endpoint should look like:
app.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' })
    }

    const decoded = verifyRefreshToken(refreshToken)
    const newAccessToken = generateAccessToken(decoded.userId)

    // Set new access token in response headers (optional)
    res.setHeader('Authorization', `Bearer ${newAccessToken}`)

    res.json({
      accessToken: newAccessToken,
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})
*/
```