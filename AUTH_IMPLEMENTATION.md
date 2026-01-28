# Auth Implementation Plan (Next.js + Prisma + Better Auth)

## Goals
- Support: **Email + Password**, **Google**, **TikTok**
- Use **Prisma** as source of truth for users, accounts, sessions.
- Existing data (currently “yours”) must be **assigned to your first user** created via **email/password** using `pkenneally93@gmail.com` (not Google).

---

## 0) Decisions to lock
- **Auth library**: Better Auth
- **Session strategy**: DB sessions (recommended for SaaS + multi-device logout)
- **Identity model**:
  - One `User`
  - Many linked `Account` rows (email/password, Google, TikTok)
- **Data ownership**:
  - Every domain record must have a single `userId` owner (or `orgId` if you have orgs; still keep a clear owner).

---

## 1) Prisma schema groundwork

### 1.1 Add core auth tables
Create/extend:
- `User`
- `Account` (provider links)
- `Session`
- `VerificationToken` (email verification / password reset if you do that)
- Optional: `Password` (or store hash on `User` — separate table is cleaner)

### 1.2 Add ownership columns to your existing models
For every model that represents “your data” (videos, analytics snapshots, projects, etc.):
- add `userId` (nullable initially for migration)
- add relation + indexes:
  - `@@index([userId])`
- decide delete behavior:
  - usually `onDelete: Cascade` for child records, `Restrict` for critical data

### 1.3 Migration strategy
- Migration A: add nullable `userId` across models + tables for auth.
- Migration B: backfill `userId` for existing rows after seed user exists.
- Migration C: make `userId` **required** once everything is backfilled (optional but recommended).

Deliverables:
- Prisma migrations committed
- `prisma generate` passes
- `prisma migrate dev` passes on a clean DB

---

## 2) Bootstrap the “first user” (your account)

### 2.1 Create a bootstrap script (idempotent)
Create `scripts/bootstrap-owner.ts` that:
- finds a user by email `pkenneally93@gmail.com`
- if missing, creates:
  - `User` (email = `pkenneally93@gmail.com`)
  - a local credentials entry (password hash) **NOT** Google
  - marks as `role = OWNER` (or similar)
- re-run safe (no duplicates)

### 2.2 Decide how password is set
Pick one:
- **Env-based initial password** (e.g. `BOOTSTRAP_PASSWORD`) for first run
- Or **one-time reset flow** (creates user, then you set password via “forgot password”)

Deliverables:
- Script you can run locally + in prod once
- Documented “first run” steps

---

## 3) Assign existing data to the bootstrap user

### 3.1 One-time backfill script
Create `scripts/assign-existing-data-to-owner.ts`:
- fetch owner userId by `pkenneally93@gmail.com`
- for each data table with nullable `userId`:
  - `updateMany({ where: { userId: null }, data: { userId: ownerId }})`
- log counts per table (before/after)
- run in a transaction where reasonable

### 3.2 Guardrails
- Add a safety check:
  - abort if there’s more than 1 user (unless you explicitly allow it)
  - abort if owner user not found
- Save a “migration audit” row (optional) with counts + timestamp

Deliverables:
- Backfill script
- Verified: all existing records now owned by your user

---

## 4) Implement Better Auth in Next.js (App Router)

### 4.1 Set up config + env
Add env vars:
- `AUTH_SECRET` (strong random)
- `DATABASE_URL`
- Google OAuth:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- TikTok OAuth:
  - `TIKTOK_CLIENT_KEY`
  - `TIKTOK_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL` (used for redirects/callbacks)

### 4.2 Auth routes
- Add the Better Auth handler route(s) under `app/api/auth/[...]/route.ts` (or per Better Auth docs)
- Ensure correct runtime:
  - Prefer `nodejs` runtime if any provider needs node APIs (safe default)

### 4.3 Prisma adapter integration
- Wire Better Auth to Prisma models
- Ensure account linking writes:
  - provider
  - providerAccountId
  - access/refresh tokens where needed (TikTok likely)

Deliverables:
- Auth endpoint working in dev
- Can sign up via email/password
- Can log in/out

---

## 5) Email + Password flow (local credentials)

### 5.1 Signup
- Form: email, password
- Rules:
  - normalize email (`trim`, lowercase)
  - password policy (keep sensible: min length, reject common passwords if you want)
- On signup:
  - create user + password hash
  - optional email verification (recommended for multi-user SaaS)

### 5.2 Login
- verify password hash
- create session
- redirect to app

### 5.3 Forgot/reset password (recommended)
- request reset (email)
- token verification
- set new password

Deliverables:
- `/signup`, `/login`, `/forgot-password`, `/reset-password`
- Server actions or route handlers with Zod validation

---

## 6) Google OAuth

### 6.1 Provider setup
- Configure Google OAuth consent + redirect URI(s)
- Implement “Sign in with Google” button

### 6.2 Account linking rules
When Google returns an email:
- If user exists with same email:
  - link Google account to that user
- Else:
  - create new user and link Google account

Deliverables:
- Google sign-in works
- Linking doesn’t create duplicates when email already exists

---

## 7) TikTok OAuth

### 7.1 Provider setup
- Configure TikTok app + redirect URI(s)
- Implement “Continue with TikTok” button

### 7.2 Linking behavior (TikTok often doesn’t provide email)
Rules:
- If TikTok returns an email (rare/depends on scopes):
  - same as Google linking
- If no email:
  - create user with `email = null` (or a placeholder) and require a post-login step:
    - “Add an email” OR “Link to existing account”
  - allow linking TikTok to an existing logged-in user

### 7.3 Token storage
If you’ll later call TikTok APIs:
- store access token + refresh token + expiry on `Account`
- build a refresh helper

Deliverables:
- TikTok login works
- “Add/Link email” flow exists if no email returned
- Token refresh path (if needed)

---

## 8) Protecting routes + server-side access

### 8.1 Middleware / server auth helper
- Implement:
  - `requireUser()` for server actions/route handlers
  - `getUser()` for optional auth
- Enforce:
  - redirect to `/login` when unauthenticated
  - consistent error shape for API routes

### 8.2 Ownership enforcement in DAL
In your DAL/services:
- every query includes `where: { userId }`
- every create sets `userId`
- never accept `userId` from the client

Deliverables:
- No data leakage across users
- All read/write paths scoped by session userId

---

## 9) Roles and admin access (minimal)
Add:
- `User.role` enum: `OWNER | USER`
Bootstrap user gets `OWNER`.

Deliverables:
- Simple guard for owner-only pages/actions

---

## 10) Testing plan (Vitest)
Cover:
- bootstrap owner script is idempotent
- backfill script assigns all null `userId` rows
- signup/login happy path
- incorrect password
- Google linking to existing email
- TikTok no-email path (forces add/link step)
- authorization checks: a user cannot read another user’s rows

Deliverables:
- Unit tests for services
- A small integration test suite hitting route handlers (optional)

---

## 11) Deployment checklist
- Run bootstrap owner script once in prod
- Run backfill script once in prod
- Lock down:
  - secrets in env
  - OAuth redirect URIs for prod domain
- Verify:
  - login/logout
  - callback URLs
  - session cookie settings (secure, sameSite)

---

## Suggested execution order (fast, safe)
1. Prisma auth tables + nullable `userId` columns
2. Bootstrap owner script
3. Backfill existing data to owner
4. Email/password signup + login
5. Route protection + ownership enforcement
6. Google OAuth + linking
7. TikTok OAuth + linking + token storage
8. Tests + hardening
9. Make `userId` required (optional final tightening)
