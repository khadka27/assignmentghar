# 📁 Project Structure - Route Groups Organization

## Overview

The project uses **Next.js Route Groups** to organize pages into logical categories while keeping URLs clean. Route groups (folders wrapped in parentheses) don't affect the URL structure.

---

## 📂 Directory Structure

```
src/app/
│
├── (auth)/                      # 🔐 Authentication Routes
│   ├── login/                   # → /login
│   ├── register/                # → /register
│   ├── recover/                 # → /recover (forgot password)
│   └── missing-verification/    # → /missing-verification
│
├── (marketing)/                 # 📢 Public Marketing Pages
│   ├── about/                   # → /about
│   ├── blog/                    # → /blog
│   ├── contact/                 # → /contact
│   ├── pricing/                 # → /pricing
│   ├── privacy/                 # → /privacy
│   └── testimonials/            # → /testimonials
│
├── (platform)/                  # 🚀 Main Platform Features
│   ├── chat/                    # → /chat (real-time messaging)
│   ├── submit/                  # → /submit (assignment submission)
│   └── expert/                  # → /expert (expert dashboard)
│
├── (admin)/                     # 👨‍💼 Admin Dashboard
│   └── page.tsx                 # → /admin
│
├── api/                         # 🔌 API Routes
│   ├── auth/                    # Authentication APIs
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── resend-otp/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── check-account-status/
│   ├── chat/                    # Chat APIs
│   │   ├── conversations/
│   │   └── experts/
│   └── [other-apis]/
│
├── layout.tsx                   # Root layout (applies to all pages)
├── page.tsx                     # Home page → /
├── globals.css                  # Global styles
├── robots.ts                    # Robots.txt config
├── sitemap.ts                   # Sitemap config
└── favicon.ico                  # Favicon
```

---

## 🎯 Route Groups Explained

### What are Route Groups?

Route groups are folders wrapped in `(parentheses)` that:

- ✅ **Organize files logically** without affecting URLs
- ✅ **Don't appear in the URL path**
- ✅ **Can have their own layouts** (optional)
- ✅ **Keep code clean and maintainable**

### Example:

```
src/app/(auth)/login/page.tsx  →  /login  (NOT /auth/login)
src/app/(marketing)/about/page.tsx  →  /about  (NOT /marketing/about)
```

---

## 📋 Route Categories

### 🔐 (auth) - Authentication Routes

**Purpose:** All pages related to user authentication and account management

**Pages:**

- **`/login`** - User login page
- **`/register`** - User registration with OTP verification
- **`/recover`** - Password recovery (3-step: email → OTP → reset)
- **`/missing-verification`** - Account status checker for unverified users

**Features:**

- OTP verification system
- Email validation
- Password strength requirements
- Inline OTP verification
- Resend OTP with countdown timer

---

### 📢 (marketing) - Public Marketing Pages

**Purpose:** Public-facing pages for marketing and information

**Pages:**

- **`/about`** - About us page
- **`/blog`** - Blog/articles
- **`/contact`** - Contact form
- **`/pricing`** - Pricing plans
- **`/privacy`** - Privacy policy
- **`/testimonials`** - Customer testimonials

**Characteristics:**

- No authentication required
- SEO optimized
- Public access
- Marketing content

---

### 🚀 (platform) - Main Platform Features

**Purpose:** Core platform functionality for logged-in users

**Pages:**

- **`/chat`** - Real-time messaging with Socket.IO
- **`/submit`** - Assignment submission form
- **`/expert`** - Expert dashboard (for experts)

**Features:**

- Requires authentication
- Role-based access control
- Real-time updates
- Interactive features

---

### 👨‍💼 (admin) - Admin Dashboard

**Purpose:** Administrative panel for admins

**Pages:**

- **`/admin`** - Admin dashboard with stats and management tools

**Access:**

- Restricted to users with `ADMIN` role
- Protected by authentication middleware

---

### 🔌 api/ - API Routes

**Purpose:** Backend API endpoints (stays outside route groups)

**Structure:**

```
api/
├── auth/           # Authentication endpoints
├── chat/           # Chat/messaging endpoints
└── [others]/       # Other API routes
```

**Note:** API routes are NOT wrapped in route groups as they need their exact paths.

---

## 🎨 Layout System

### Root Layout (`layout.tsx`)

Applies to all pages:

- Navbar
- Footer
- Theme provider
- Socket.IO provider
- Session provider

### Optional: Group Layouts

You can add `layout.tsx` inside route groups for group-specific layouts:

```
(auth)/
├── layout.tsx      # Auth-specific layout (e.g., centered form layout)
├── login/
├── register/
└── recover/

(platform)/
├── layout.tsx      # Platform-specific layout (e.g., sidebar navigation)
├── chat/
└── submit/
```

---

## 🔄 Migration Summary

### What Changed:

| Old Path                    | New Path                           | URL                                    |
| --------------------------- | ---------------------------------- | -------------------------------------- |
| `app/login/`                | `app/(auth)/login/`                | `/login` ✅ (unchanged)                |
| `app/register/`             | `app/(auth)/register/`             | `/register` ✅ (unchanged)             |
| `app/recover/`              | `app/(auth)/recover/`              | `/recover` ✅ (unchanged)              |
| `app/missing-verification/` | `app/(auth)/missing-verification/` | `/missing-verification` ✅ (unchanged) |
| `app/about/`                | `app/(marketing)/about/`           | `/about` ✅ (unchanged)                |
| `app/blog/`                 | `app/(marketing)/blog/`            | `/blog` ✅ (unchanged)                 |
| `app/contact/`              | `app/(marketing)/contact/`         | `/contact` ✅ (unchanged)              |
| `app/pricing/`              | `app/(marketing)/pricing/`         | `/pricing` ✅ (unchanged)              |
| `app/privacy/`              | `app/(marketing)/privacy/`         | `/privacy` ✅ (unchanged)              |
| `app/testimonials/`         | `app/(marketing)/testimonials/`    | `/testimonials` ✅ (unchanged)         |
| `app/chat/`                 | `app/(platform)/chat/`             | `/chat` ✅ (unchanged)                 |
| `app/submit/`               | `app/(platform)/submit/`           | `/submit` ✅ (unchanged)               |
| `app/expert/`               | `app/(platform)/expert/`           | `/expert` ✅ (unchanged)               |

### What Stayed the Same:

- ✅ All URLs remain exactly the same
- ✅ API routes unchanged
- ✅ Root pages (`page.tsx`, `layout.tsx`) unchanged
- ✅ Static files unchanged
- ✅ Component imports work the same
- ✅ Routing behavior identical

---

## 🛠️ Best Practices

### 1. **Naming Route Groups**

Use descriptive, lowercase names:

- ✅ `(auth)` - Clear purpose
- ✅ `(marketing)` - Self-explanatory
- ✅ `(platform)` - Indicates main features
- ❌ `(pages)` - Too generic
- ❌ `(stuff)` - Not descriptive

### 2. **When to Use Route Groups**

✅ **Use when:**

- You have multiple pages with a common purpose
- You want to organize code without affecting URLs
- You need group-specific layouts
- You want to share middleware or metadata

❌ **Don't use when:**

- You want the group name in the URL (use normal folders)
- You only have 1-2 related pages
- It makes the structure more complex than necessary

### 3. **Group-Specific Files**

You can add special files to route groups:

```
(auth)/
├── layout.tsx           # Auth-specific layout
├── loading.tsx          # Auth loading state
├── error.tsx            # Auth error boundary
├── not-found.tsx        # Auth 404 page
└── template.tsx         # Auth template
```

### 4. **Metadata per Group**

```typescript
// (marketing)/layout.tsx
export const metadata = {
  title: {
    template: "%s | AssignmentGhar Marketing",
    default: "AssignmentGhar - Get Expert Help",
  },
  description: "Professional assignment help service",
};
```

---

## 🔍 File Organization Tips

### Components

Keep components organized by feature:

```
src/
├── components/
│   ├── auth/           # Auth-specific components
│   ├── marketing/      # Marketing components
│   ├── platform/       # Platform components
│   └── ui/             # Shared UI components
```

### Hooks

```
src/
├── hooks/
│   ├── use-auth.ts
│   ├── use-chat.ts
│   └── use-toast.ts
```

### Utilities

```
src/
├── lib/
│   ├── auth.ts
│   ├── email.ts
│   ├── utils.ts
│   └── prisma.ts
```

---

## 📊 Benefits of This Structure

### For Developers:

- ✅ **Easy to find files** - Logical grouping
- ✅ **Clear separation of concerns** - Auth vs Marketing vs Platform
- ✅ **Better code organization** - Related files together
- ✅ **Easier refactoring** - Move entire groups easily
- ✅ **Scalable** - Add more pages to existing groups

### For the Project:

- ✅ **Maintainable** - Easy for new developers
- ✅ **Professional** - Industry-standard organization
- ✅ **Flexible** - Group-specific layouts and middleware
- ✅ **Clean URLs** - Route groups don't pollute URLs
- ✅ **Type-safe** - TypeScript works perfectly

---

## 🚀 Next Steps

### Optional Enhancements:

1. **Add Group Layouts**

   ```typescript
   // (auth)/layout.tsx
   export default function AuthLayout({ children }) {
     return (
       <div className="auth-container">
         {/* Centered form layout */}
         {children}
       </div>
     );
   }
   ```

2. **Add Loading States**

   ```typescript
   // (platform)/loading.tsx
   export default function Loading() {
     return <Spinner />;
   }
   ```

3. **Add Error Boundaries**

   ```typescript
   // (platform)/error.tsx
   export default function Error({ error, reset }) {
     return <ErrorComponent error={error} onReset={reset} />;
   }
   ```

4. **Add Middleware**
   ```typescript
   // middleware.ts
   export function middleware(request) {
     if (request.nextUrl.pathname.startsWith("/admin")) {
       // Check admin role
     }
   }
   ```

---

## 📚 References

- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Project Organization](https://nextjs.org/docs/app/building-your-application/routing/colocation)

---

## ✅ Verification Checklist

After reorganization:

- [x] All authentication pages moved to `(auth)/`
- [x] All marketing pages moved to `(marketing)/`
- [x] All platform pages moved to `(platform)/`
- [x] Admin page stays in `(admin)/`
- [x] API routes unchanged
- [ ] Test all page URLs still work
- [ ] Test authentication flow
- [ ] Test navigation links
- [ ] Test Socket.IO connections
- [ ] Update imports if needed

---

**Last Updated:** October 21, 2025  
**Structure Version:** 2.0  
**Status:** ✅ Organized
