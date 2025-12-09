# Solvify Frontend Documentation

## 1. Overview

Solvify is a modern React single-page application built with a robust technology stack:

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with concurrent features |
| **Vite** | Fast build tool and dev server |
| **TypeScript** | Type-safe JavaScript |
| **TailwindCSS** | Utility-first CSS framework |
| **Redux Toolkit** | Global state management |
| **React Query** | Server state & caching |
| **React Router v6** | Client-side routing |
| **shadcn/ui** | Radix-based component library |
| **Axios** | HTTP client for API calls |

---

## 2. Project Structure

```
client/
├── public/                 # Static assets served as-is
├── src/
│   ├── api.ts              # Axios instance & API utilities
│   ├── App.tsx             # Root component with routes
│   ├── main.tsx            # Entry point, provider setup
│   ├── index.css           # Global styles & design tokens
│   ├── assets/             # Images, icons, fonts
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitive components (49 files)
│   │   ├── home/           # Homepage sections (Hero, CTA, etc.)
│   │   ├── Navbar.tsx      # Main navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Logo.tsx        # Brand logo component
│   │   ├── ThemeToggle.tsx # Light/Dark/System toggle
│   │   └── AuthProvider.tsx# Auth initialization wrapper
│   ├── pages/              # Route-level page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (auth, interceptors, cn)
│   ├── store/              # Redux store & slices
│   └── theme/              # Theme provider context
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies & scripts
```

---

## 3. Component Architecture

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/Navbar.tsx` | Responsive navigation with mobile menu, auth state display |
| `Footer` | `components/Footer.tsx` | Site footer with links and branding |
| `Logo` | `components/Logo.tsx` | SVG brand logo with theme support |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Theme switcher (light/dark/system) |

### Home Page Sections

Located in `components/home/`:

- **`Hero.tsx`** - Main hero section with CTA buttons
- **`Services.tsx`** - Service offerings grid
- **`HowItWorks.tsx`** - Process explanation section
- **`WhyChooseUs.tsx`** - Value proposition cards
- **`Testimonials.tsx`** - Customer testimonials carousel
- **`CTA.tsx`** - Call-to-action section

### UI Components (shadcn/ui)

49 reusable components in `components/ui/` including:
- Form controls: `Button`, `Input`, `Select`, `Checkbox`, `Switch`
- Feedback: `Toast`, `Sonner`, `Alert`, `Progress`
- Layout: `Card`, `Dialog`, `Sheet`, `Tabs`, `Accordion`
- Navigation: `NavigationMenu`, `DropdownMenu`, `Menubar`

---

## 4. State Management

### Redux Store (`store/store.ts`)

```typescript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice (`store/authSlice.ts`)

Manages authentication state:

```typescript
interface AuthState {
  user: null | { id: number; name: string; role: string };
  accessToken: string | null;
  status: "idle" | "authenticated" | "unauthenticated";
}
```

**Actions:**
- `login(payload)` - Set user and access token
- `logout()` - Clear auth state
- `setStatus(status)` - Update auth status

### React Query

Used for server state management. Configured in `App.tsx`:

```typescript
const queryClient = new QueryClient();
// Wrapped with <QueryClientProvider client={queryClient}>
```

---

## 5. Routing

All routes defined in `App.tsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Index` | Homepage |
| `/services` | `Services` | Services page |
| `/portfolio` | `Portfolio` | Portfolio/work samples |
| `/about` | `About` | About us page |
| `/contact` | `Contact` | Contact form |
| `/login` | `Login` | User login |
| `/register` | `Register` | User registration |
| `/forgot-password` | `ForgotPassword` | Password recovery |
| `/reset-password/:token` | `ResetPassword` | Password reset with token |
| `*` | `NotFound` | 404 catch-all |

---

## 6. Styling Approach

### TailwindCSS Configuration

- **Dark mode:** Class-based (`darkMode: ["class"]`)
- **Font:** Inter (system fallback)
- **Border radius:** CSS variable `--radius`

### Design Token System (`index.css`)

All colors use HSL format with CSS custom properties:

```css
:root {
  --primary: 221 83% 53%;      /* Blue */
  --secondary: 263 70% 50%;    /* Purple */
  --accent: 160 84% 39%;       /* Green */
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
}

.dark {
  --background: 224 71% 4%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

### Custom Utilities

| Class | Purpose |
|-------|---------|
| `.gradient-primary` | Blue-to-purple gradient |
| `.gradient-hero` | Subtle hero section gradient |
| `.text-gradient` | Gradient text effect |
| `.shadow-soft` | Medium shadow |
| `.shadow-strong` | Large shadow |

### Class Merging Utility (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 7. API Integration

### Axios Instance (`api.ts`)

```typescript
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Sends cookies for auth
});

export const googleAuth = async (code) => {
  return api.get(`/api/auth/google?code=${code}`);
}

export default api;
```

### Fetch Interceptor (`lib/fetchInterceptor.ts`)

Automatically attaches JWT tokens to all fetch requests:

```typescript
export const fetchInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    let [url, config = {}] = args;
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return originalFetch(url, config);
  };
};
```

### Auth Hook (`lib/auth.ts`)

Auto-refreshes auth state on app load:

```typescript
export const useAuth = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const initAuth = async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(login({ user: data.user, accessToken: data.accessToken }));
      }
    }
    initAuth();
  }, [dispatch]);
}
```

---

## 8. Environment Variables

Create a `.env` file in the client root:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | Yes | Backend API base URL (e.g., `http://localhost:3000`) |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `VITE_GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

Example:
```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 9. Build & Development

### Prerequisites
- Node.js 18+
- npm or bun

### Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (default: http://localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Provider Hierarchy

The app wraps components in this order (`main.tsx`):

```tsx
<Provider store={store}>              {/* Redux */}
  <GoogleOAuthProvider>               {/* Google Auth */}
    <ThemeProvider>                   {/* Theme Context */}
      <AuthProvider>                  {/* Auth Init */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
</Provider>
```

---

## 10. Key Features

### Authentication System

- **Email/Password Login** - Traditional form-based auth
- **Google OAuth** - One-click Google sign-in via `@react-oauth/google`
- **Token Refresh** - Automatic JWT refresh on app load
- **Forgot/Reset Password** - Email-based password recovery flow

### Theme System

Custom `ThemeProvider` with three modes:
- **Light** - Forces light theme
- **Dark** - Forces dark theme
- **System** - Follows OS preference

Persisted to `localStorage` under key `solvify:theme`.

### Toast Notifications

Dual toast systems available:
- `@/components/ui/toaster` - shadcn/ui toast
- `sonner` - Modern toast library for notifications

### Responsive Design

- Mobile-first approach
- Container max-width: 1400px
- Responsive navigation with mobile menu

### Form Handling

Uses `react-hook-form` with `zod` validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## Quick Reference

### Adding a New Page

1. Create component in `src/pages/NewPage.tsx`
2. Add route in `App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```

### Using Theme

```tsx
import { useTheme } from "@/theme/ThemeProvider";

function MyComponent() {
  const { effectiveTheme, setThemeChoice } = useTheme();
  // effectiveTheme: "light" | "dark"
  // setThemeChoice: ("light" | "dark" | "system") => void
}
```

### Making API Calls

```tsx
import api from "@/api";

// GET request
const response = await api.get("/api/endpoint");

// POST request
const response = await api.post("/api/endpoint", { data });
```
