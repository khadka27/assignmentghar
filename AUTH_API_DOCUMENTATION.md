# Authentication API Documentation

## Overview

This document describes the complete authentication API with standardized error codes, status codes, and response formats following industry best practices.

---

## Table of Contents

1. [Data Model](#data-model)
2. [API Endpoints](#api-endpoints)
3. [Error Codes](#error-codes)
4. [Security](#security)
5. [Response Examples](#response-examples)
6. [Frontend Integration](#frontend-integration)

---

## Data Model

### User Table (PostgreSQL via Prisma)

```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  username      String?   @unique
  email         String    @unique
  password      String    // bcrypt hashed
  role          UserRole  @default(STUDENT)

  // Email Verification
  isVerified    Boolean   @default(false)
  emailVerified DateTime?
  otp           String?   // 6-digit code
  otpExpiry     DateTime? // OTP valid for 10 minutes

  // OAuth
  image         String?

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

## API Endpoints

### 1. POST /api/auth/register

**Purpose:** Register a new user or re-register an unverified user.

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "john123", // Optional
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Behavior:**

| Scenario                      | Status | Response                                      |
| ----------------------------- | ------ | --------------------------------------------- |
| **New user**                  | 201    | `{ message, next: "/verify" }`                |
| **Email exists (UNVERIFIED)** | 200    | `{ message, next: "/verify" }` ← New OTP sent |
| **Email exists (VERIFIED)**   | 409    | `{ code: "EMAIL_TAKEN", message }`            |
| **Username taken**            | 400    | `{ code: "USERNAME_TAKEN", message }`         |
| **Invalid email**             | 400    | `{ code: "INVALID_EMAIL", message }`          |
| **Weak password**             | 400    | `{ code: "WEAK_PASSWORD", message }`          |
| **Missing fields**            | 400    | `{ code: "MISSING_FIELDS", message }`         |
| **Email send fails**          | 500    | `{ code: "EMAIL_SEND_FAILED", message }`      |

**Success Response (201 Created):**

```json
{
  "message": "Verification required. Please check your email for the code.",
  "next": "/verify"
}
```

**Idempotent Behavior:**

- Re-registering an **unverified** email → Regenerates OTP, updates user data, resends email
- Re-registering a **verified** email → Returns 409 conflict

---

### 2. POST /api/auth/verify-otp

**Purpose:** Verify the OTP code sent to user's email.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Behavior:**

| Scenario             | Status | Response                              |
| -------------------- | ------ | ------------------------------------- |
| **Valid OTP**        | 200    | `{ message, next: "/login" }`         |
| **Already verified** | 200    | `{ message, next: "/login" }`         |
| **Invalid OTP**      | 400    | `{ code: "INVALID_OTP", message }`    |
| **Expired OTP**      | 400    | `{ code: "INVALID_OTP", message }`    |
| **User not found**   | 404    | `{ code: "USER_NOT_FOUND", message }` |
| **Missing fields**   | 400    | `{ code: "MISSING_FIELDS", message }` |
| **Invalid format**   | 400    | `{ code: "INVALID_OTP", message }`    |

**Success Response (200 OK):**

```json
{
  "message": "Verified. You can now login.",
  "next": "/login"
}
```

**Side Effects:**

- Sets `isVerified = true`
- Sets `emailVerified = NOW()`
- Clears `otp` and `otpExpiry`
- Sends welcome email (non-blocking)

---

### 3. POST /api/auth/resend-otp

**Purpose:** Resend OTP to unverified user's email.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Behavior:**

| Scenario             | Status | Response                                 |
| -------------------- | ------ | ---------------------------------------- |
| **Unverified user**  | 200    | `{ message }` ← New OTP sent             |
| **Already verified** | 200    | `{ message, next: "/login" }`            |
| **User not found**   | 404    | `{ code: "USER_NOT_FOUND", message }`    |
| **Missing email**    | 400    | `{ code: "MISSING_FIELDS", message }`    |
| **Email send fails** | 500    | `{ code: "EMAIL_SEND_FAILED", message }` |

**Success Response (200 OK):**

```json
{
  "message": "OTP sent. Please check your email."
}
```

**Rate Limiting:**

- Frontend implements 60-second cooldown between resends
- Backend should implement rate limiting (recommended)

---

### 4. POST /api/auth/[...nextauth] (Login via NextAuth)

**Purpose:** Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Behavior:**

| Scenario                           | Status | Response                                             |
| ---------------------------------- | ------ | ---------------------------------------------------- |
| **Valid credentials + verified**   | 200    | `{ token, user, ... }`                               |
| **Valid credentials + UNVERIFIED** | 403    | `"UNVERIFIED: Account not verified..."`              |
| **Wrong password**                 | 401    | `"INVALID_CREDENTIALS: Email or password incorrect"` |
| **Email not found**                | 404    | `"USER_NOT_FOUND: User not found"`                   |
| **OAuth user (no password)**       | 401    | `"INVALID_CREDENTIALS: Please use Google sign-in"`   |

**Error Format:**
NextAuth returns errors as strings in format: `"CODE: message"`

Example: `"UNVERIFIED: Account not verified. Please verify your email."`

**Success:**

- Creates JWT session
- Returns user object
- Frontend redirects to dashboard

**Unverified Handling:**

- Frontend detects `UNVERIFIED` error code
- Automatically sends OTP
- Shows inline verification UI
- Alternative: Redirect to `/missing-verification` page

---

### 5. POST /api/auth/check-account-status

**Purpose:** Check if email exists and verification status.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Behavior:**

| Scenario                     | Response                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------- |
| **User not found**           | `{ exists: false, isVerified: false, message }`                              |
| **User exists (verified)**   | `{ exists: true, isVerified: true, email, name, message, next: "/login" }`   |
| **User exists (unverified)** | `{ exists: true, isVerified: false, email, name, message, next: "/verify" }` |

**Success Response (200 OK) - Unverified:**

```json
{
  "exists": true,
  "isVerified": false,
  "email": "john@example.com",
  "name": "John Doe",
  "message": "Account exists but not verified",
  "next": "/verify"
}
```

**Used By:**

- `/missing-verification` page
- Account recovery flows

---

## Error Codes

### Standard Error Response Format

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

### Error Code Reference

| Code                  | Status | Meaning                                       |
| --------------------- | ------ | --------------------------------------------- |
| `EMAIL_TAKEN`         | 409    | Email already registered (verified account)   |
| `USERNAME_TAKEN`      | 400    | Username already in use                       |
| `INVALID_EMAIL`       | 400    | Email format is invalid                       |
| `WEAK_PASSWORD`       | 400    | Password doesn't meet requirements (8+ chars) |
| `MISSING_FIELDS`      | 400    | Required fields are missing                   |
| `INVALID_OTP`         | 400    | OTP is wrong, expired, or invalid format      |
| `USER_NOT_FOUND`      | 404    | No account with this email                    |
| `INVALID_CREDENTIALS` | 401    | Wrong password or authentication failed       |
| `UNVERIFIED`          | 403    | Account exists but email not verified         |
| `EMAIL_SEND_FAILED`   | 500    | Failed to send verification email             |
| `SERVER_ERROR`        | 500    | Internal server error                         |

---

## Security

### Password Security

- **Hashing:** bcrypt with 12 salt rounds
- **Minimum length:** 8 characters
- **Validation:** Client-side + server-side

### OTP Security

- **Format:** 6-digit numeric code
- **Expiry:** 10 minutes
- **Generation:** Cryptographically random
- **Storage:** Plain text (consider hashing in production)
- **Comparison:** String equality (consider timing-safe comparison)

### Email Normalization

All emails are:

- Trimmed of whitespace
- Converted to lowercase
- Validated with regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Rate Limiting (Recommended)

```typescript
// Not yet implemented - recommendations:
POST /api/auth/register → 5 requests per hour per IP
POST /api/auth/resend-otp → 3 requests per 5 minutes per email
POST /api/auth/verify-otp → 5 attempts per 10 minutes per email
POST /api/auth/[...nextauth] → 10 requests per hour per IP
```

### Session Management

- **Strategy:** JWT (NextAuth)
- **Storage:** HTTP-only cookies
- **Expiry:** 30 days (NextAuth default)

---

## Response Examples

### Scenario 1: Successful Registration (New User)

**Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "SecurePass123!"
}
```

**Response: 201 Created**

```json
{
  "message": "Verification required. Please check your email for the code.",
  "next": "/verify"
}
```

**Email Sent:**

```
To: alice@example.com
Subject: Verify Your Email - AssignmentGhar

Your verification code is: 123456
This code expires in 10 minutes.
```

---

### Scenario 2: Re-Registration (Unverified User)

**Context:** User registered yesterday but never verified

**Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "NewPassword456!"
}
```

**Response: 200 OK**

```json
{
  "message": "Verification required. A new code has been sent to your email.",
  "next": "/verify"
}
```

**Database Update:**

- Password updated to new hash
- New OTP generated
- OTP expiry reset to 10 minutes from now

---

### Scenario 3: Verify OTP (Success)

**Request:**

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "alice@example.com",
  "otp": "123456"
}
```

**Response: 200 OK**

```json
{
  "message": "Verified. You can now login.",
  "next": "/login"
}
```

---

### Scenario 4: Verify OTP (Expired)

**Request:**

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "alice@example.com",
  "otp": "123456"
}
```

**Response: 400 Bad Request**

```json
{
  "code": "INVALID_OTP",
  "message": "Verification code has expired. Please request a new one."
}
```

---

### Scenario 5: Login (Unverified Account)

**Request:**

```bash
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "SecurePass123!"
}
```

**Response: 403 Forbidden**

```json
{
  "error": "UNVERIFIED: Account not verified. Please verify your email."
}
```

**Frontend Behavior:**

1. Detects `UNVERIFIED` error code
2. Extracts email from login form
3. Calls `/api/auth/resend-otp` with email
4. Shows inline OTP verification UI
5. User enters code
6. Calls `/api/auth/verify-otp`
7. On success, user can login

---

### Scenario 6: Login (Wrong Password)

**Request:**

```bash
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "WrongPassword!"
}
```

**Response: 401 Unauthorized**

```json
{
  "error": "INVALID_CREDENTIALS: Email or password incorrect"
}
```

---

### Scenario 7: Login (User Not Found)

**Request:**

```bash
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "nonexistent@example.com",
  "password": "SomePassword123!"
}
```

**Response: 404 Not Found**

```json
{
  "error": "USER_NOT_FOUND: User not found"
}
```

**Frontend Behavior:**

- Shows: "No account found with this email. Please register first."
- Optionally offers "Create Account" button

---

### Scenario 8: Check Account Status (Unverified)

**Request:**

```bash
POST /api/auth/check-account-status
Content-Type: application/json

{
  "email": "alice@example.com"
}
```

**Response: 200 OK**

```json
{
  "exists": true,
  "isVerified": false,
  "email": "alice@example.com",
  "name": "Alice Smith",
  "message": "Account exists but not verified",
  "next": "/verify"
}
```

---

## Frontend Integration

### Error Handling Pattern

```typescript
// Login page example
const handleLogin = async (email: string, password: string) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    // Parse error code from format: "CODE: message"
    const [errorCode, ...messageParts] = result.error.split(": ");
    const errorMessage = messageParts.join(": ");

    switch (errorCode) {
      case "UNVERIFIED":
        // Send OTP and show verification UI
        await sendOTP(email);
        setShowOTPVerification(true);
        break;

      case "USER_NOT_FOUND":
        showToast({
          title: "User Not Found",
          description: "No account found. Please register first.",
        });
        break;

      case "INVALID_CREDENTIALS":
        showToast({
          title: "Login Failed",
          description: "Email or password incorrect",
        });
        break;

      default:
        showToast({
          title: "Error",
          description: errorMessage || "An error occurred",
        });
    }
  } else {
    // Success - redirect to dashboard
    router.push("/dashboard");
  }
};
```

### API Call Pattern

```typescript
// Register example
const handleRegister = async (data: RegisterData) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email.trim().toLowerCase(),
        password: data.password,
        username: data.username,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      switch (result.code) {
        case "EMAIL_TAKEN":
          showError("Email already registered");
          break;
        case "WEAK_PASSWORD":
          showError("Password must be at least 8 characters");
          break;
        default:
          showError(result.message || "Registration failed");
      }
      return;
    }

    // Success - redirect to verify page
    showSuccess(result.message);
    router.push(result.next); // "/verify"
  } catch (error) {
    showError("Network error. Please try again.");
  }
};
```

---

## Migration from Old API

### Changes Required

#### 1. Frontend: Update Error Handling

**Before:**

```typescript
if (result.error.includes("verify your email")) {
  // Handle unverified
}
```

**After:**

```typescript
const errorCode = result.error.split(": ")[0];
if (errorCode === "UNVERIFIED") {
  // Handle unverified
}
```

#### 2. Frontend: Update Success Handling

**Before:**

```typescript
if (data.success) {
  // Handle success
}
```

**After:**

```typescript
if (response.ok) {
  // Handle success
  router.push(data.next); // Use standardized "next" field
}
```

#### 3. Check Response Status Codes

All endpoints now return proper HTTP status codes:

- 200: Success (existing resource)
- 201: Success (new resource created)
- 400: Client error (validation, bad request)
- 401: Unauthorized (wrong password)
- 403: Forbidden (unverified account)
- 404: Not found (user doesn't exist)
- 409: Conflict (resource already exists)
- 500: Server error

---

## Testing

### Test Checklist

- [ ] Register new user → Receives OTP email
- [ ] Register with existing verified email → 409 conflict
- [ ] Register with existing unverified email → New OTP sent
- [ ] Verify OTP (valid) → Account verified
- [ ] Verify OTP (expired) → Error shown
- [ ] Verify OTP (wrong code) → Error shown
- [ ] Resend OTP → New code sent
- [ ] Login (verified user) → Success
- [ ] Login (unverified user) → OTP flow triggered
- [ ] Login (wrong password) → Error shown
- [ ] Login (non-existent email) → Error shown
- [ ] Check account status (all scenarios) → Correct response

### Postman Collection

```json
{
  "info": {
    "name": "AssignmentGhar Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register New User",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!@#\"\n}"
        }
      }
    }
    // ... more endpoints
  ]
}
```

---

## Conclusion

Your authentication system now follows industry-standard practices with:

✅ Consistent error codes across all endpoints  
✅ Proper HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500)  
✅ Standardized response format with `message` and `next` fields  
✅ Idempotent registration (re-registering unverified users)  
✅ Clear error handling with specific codes  
✅ Email normalization (trim + lowercase)  
✅ Secure password hashing (bcrypt)  
✅ OTP expiration (10 minutes)  
✅ Comprehensive frontend integration examples

**Next Steps:**

1. Test all flows end-to-end
2. Implement rate limiting
3. Add timing-safe OTP comparison
4. Consider hashing OTPs in database
5. Add monitoring and logging
6. Write unit tests for each endpoint

---

**Version:** 2.0.0  
**Last Updated:** 2025-10-21  
**Author:** AssignmentGhar Development Team
