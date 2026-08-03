# FBMS — Integration Testing Checklist

Branch under test: `integration-testing`
Last updated: 2026-08-04 by Kazi

## Before you start

```bash
git checkout integration-testing
git pull origin integration-testing
npm run install:all
```

Keep your existing `backend/.env` and `frontend/.env` — nothing there changed.

```bash
npm run dev:backend
npm run dev:frontend
```

Health check: `GET http://127.0.0.1:4000/api/health` should return `{"status":"ok"}`.

Test user: `admin@fbms.com` / `Admin123` (Super Admin — sees everything). Other demo accounts are on the login page if you need role-specific testing.

## How to report a bug

Add a row to the table for your module, or open a GitHub Issue and link it here. Don't just say "it's broken" — include:

```
**Page/endpoint:**
**Steps to reproduce:**
**Expected:**
**Actual:**
**Console/terminal error (if any):**
```

## Status legend

✅ Confirmed working ⬜ Not tested yet ❌ Broken (see notes) 🔧 Fix in progress

---

## Auth & Session — Kazi

| Check | Status | Notes |
|---|---|---|
| Login with valid credentials | ✅ | |
| Login with wrong password shows error | ✅ | |
| Logout clears session | ✅ | |
| Refresh page keeps you logged in | ✅ | |
| Protected routes redirect to login when logged out | ⬜ | |

## Dashboard — Kazi

| Check | Status | Notes |
|---|---|---|
| Stat cards show real counts (not 0 or hardcoded) | ✅ | |
| Recent activities list populates | ✅ | |
| Quick actions match your role | ⬜ | check with a non-admin account |
| Branch manager sees only their branch's numbers | ⬜ | |

## Users & Roles — Kazi

| Check | Status | Notes |
|---|---|---|
| List users, search, filter | ⬜ | |
| Create user | ⬜ | |
| Edit user | ⬜ | |
| Activate/deactivate user | ⬜ | |
| Assign role/branch | ⬜ | |

## Branches — Arfin

| Check | Status | Notes |
|---|---|---|
| List branches, pagination | 🔧 | pagination crash fixed, please re-verify |
| Search/filter branches | ⬜ | |
| Create/edit branch | ⬜ | |
| Activate/deactivate branch | ⬜ | |

## Brand Assets — Arfin

| Check | Status | Notes |
|---|---|---|
| Upload asset | ⬜ | |
| List/search/filter assets | ⬜ | |
| Pagination | ⬜ | not yet audited for the same LIMIT/OFFSET bug — flag if it crashes |

## Campaigns — Labiba

| Check | Status | Notes |
|---|---|---|
| List campaigns, pagination | 🔧 | debug logs removed, please re-verify |
| Create/edit campaign | ⬜ | |
| Assign campaign to branches | ⬜ | |
| Attach assets to campaign | ⬜ | |

## Customization Requests — Mir

| Check | Status | Notes |
|---|---|---|
| Submit request | ⬜ | |
| List/filter by status | 🔧 | pagination crash fixed, please re-verify |
| Approve/reject/request revision | ⬜ | |
| Review comments | ⬜ | |

## Guidelines, Notifications, Reports, Profile — unassigned

These exist in the codebase but aren't listed in the original team split. Need an owner each, or Kazi picks these up.

| Module | Owner | Status |
|---|---|---|
| Guidelines | TBD | 🔧 pagination crash fixed, needs full test |
| Notifications | TBD | ⬜ |
| Reports | TBD | ⬜ |
| Profile | TBD | ⬜ |

---

## Known fixed (2026-08-04)

- mysql2 `LIMIT ? OFFSET ?` crash on Branches, Requests, Guidelines pagination
- Debug logs printing plaintext passwords/JWT payloads to console (auth, campaigns)

## Do not merge to `main` until

- [ ] Every row above is ✅
- [ ] Guidelines/Notifications/Reports/Profile have owners and are tested
- [ ] No console errors on any page for a fresh login → click-through of every nav item