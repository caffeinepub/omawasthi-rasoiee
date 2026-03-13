# omawasthi rasoiee

## Current State
- App uses Internet Identity for login
- Desktop header shows "Recipes Book" (wrong -- should be "omawasthi rasoiee")
- Admin panel only shows when `isCallerAdmin()` returns true from backend
- Mobile menu has "omawasthi rasoiee" correctly but desktop nav doesn't
- Login UI shows Internet Identity popup directly

## Requested Changes (Diff)

### Add
- `LoginModal` component: friendly email + name + password form UI
  - Two modes: Login and Sign Up
  - Sign Up: name, email, mobile, password fields
  - Login: email, password fields
  - On submit, triggers Internet Identity login internally
  - After II login, saves name/email/mobile to backend via `registerUser`
  - Stores email/password locally in localStorage for session persistence
- Local admin bypass: if user enters admin credentials (email: omawasthi379@gmail.com, password: omawasthi07122006), set `isLocalAdmin=true` in localStorage; admin panel shown immediately
- `AdminLoginPage`: secret admin login page shown at `/admin-om2024` hash or via admin password entry

### Modify
- `Header.tsx`: Change "Recipes Book" text to "omawasthi rasoiee" in desktop nav logo
- `App.tsx`: Replace direct Internet Identity login calls with new LoginModal flow; use local admin state alongside backend `isAdmin`
- `Header.tsx`: Show Admin tab if `isAdmin` (backend) OR `isLocalAdmin` (local)
- `useQueries.ts`: `useGetRegisteredUsers` should not require `identity` check -- use actor availability only

### Remove
- Nothing removed, existing features preserved

## Implementation Plan
1. Fix header title text "Recipes Book" → "omawasthi rasoiee" in `Header.tsx`
2. Create `useLocalAuth` hook: manages localStorage-based admin state + user login state
3. Create `LoginModal` component: email/name/password form that triggers II login + saves registration
4. Update `App.tsx`: wire LoginModal, use `isAdmin || isLocalAdmin` for admin panel display
5. Update `Header.tsx`: use combined admin state, show Login button that opens LoginModal
6. Create `AdminLoginPage` component for secret admin access (hash-based)
7. Fix `useGetRegisteredUsers` to not gate on `identity` presence
