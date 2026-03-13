# omawasthi rasoiee

## Current State
- App has Contact page (card layout, no photo, avatar initials only)
- Admin panel accessible only to Internet Identity admin via nav tab
- Fonts: Fraunces + Figtree loaded via local woff2 (may fail to load)
- User registration modal already implemented

## Requested Changes (Diff)

### Add
- Hash-based admin URL: when `window.location.hash === '#admin-omawasthi07122006'`, auto-navigate to admin view
- Owner photo on Contact page using `/assets/uploads/IMG-20251202-WA0007-1.jpg`
- Animated owner intro section: photo slides in from left, text on right: "I am Om Awasthi, the owner of this app. If you have any problem, please contact me"

### Modify
- ContactPage: redesign with hero layout -- photo (left, animated slide-in) + owner message (right), then contact details below
- index.css: fix fonts by switching to Google Fonts @import for Fraunces + Figtree (reliable loading)
- App.tsx: add useEffect to detect URL hash and auto-navigate to admin view

### Remove
- Nothing removed

## Implementation Plan
1. Fix index.css fonts via @import from Google Fonts
2. Update ContactPage.tsx: hero section with uploaded photo (left) + animated owner message (right), contact details below
3. Update App.tsx: useEffect to check window.location.hash on mount, if matches secret, navigate to admin
4. Admin URL for user: append `#admin-omawasthi07122006` to app URL
