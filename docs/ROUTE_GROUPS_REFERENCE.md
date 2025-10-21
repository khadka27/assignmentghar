# 📁 Route Groups Quick Reference

## ✅ New Folder Structure

```
src/app/
├── (admin)/          → Admin pages (role: ADMIN)
├── (auth)/           → Authentication pages
├── (marketing)/      → Public marketing pages
├── (platform)/       → Main platform features
├── api/              → API routes
└── [root files]      → Home, layout, globals
```

---

## 🎯 Route Mapping

### 🔐 Authentication Routes - (auth)/

```
(auth)/login/                    → /login
(auth)/register/                 → /register
(auth)/recover/                  → /recover
(auth)/missing-verification/     → /missing-verification
```

### 📢 Marketing Routes - (marketing)/

```
(marketing)/about/               → /about
(marketing)/blog/                → /blog
(marketing)/contact/             → /contact
(marketing)/pricing/             → /pricing
(marketing)/privacy/             → /privacy
(marketing)/testimonials/        → /testimonials
```

### 🚀 Platform Routes - (platform)/

```
(platform)/chat/                 → /chat
(platform)/submit/               → /submit
(platform)/expert/               → /expert
```

### 👨‍💼 Admin Routes - (admin)/

```
(admin)/                         → /admin
```

---

## 💡 Key Points

1. **Route groups DON'T affect URLs**

   - `(auth)/login/` still maps to `/login`
   - Parentheses are for organization only

2. **All existing URLs still work**

   - No breaking changes
   - No redirects needed
   - Navigation unchanged

3. **Benefits:**

   - ✅ Better code organization
   - ✅ Easier to find files
   - ✅ Group-specific layouts possible
   - ✅ Clean separation of concerns

4. **API routes stay the same**
   - `api/auth/*` unchanged
   - `api/chat/*` unchanged

---

## 🔧 Quick Navigation

| Need to find... | Look in...                   |
| --------------- | ---------------------------- |
| Login page      | `(auth)/login/page.tsx`      |
| Registration    | `(auth)/register/page.tsx`   |
| About page      | `(marketing)/about/page.tsx` |
| Chat feature    | `(platform)/chat/page.tsx`   |
| Admin panel     | `(admin)/page.tsx`           |
| Auth API        | `api/auth/`                  |
| Chat API        | `api/chat/`                  |

---

## 📝 Created: October 21, 2025
