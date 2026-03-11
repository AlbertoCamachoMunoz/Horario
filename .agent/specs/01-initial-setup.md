# Spec: Initial Project Setup (PWA)

## Objective
Create the base structure for the Employee Work Hours PWA, including the PWA manifest, service worker, and the core HTML/CSS/JS structure as defined in `orchestrator.md`.

## Files to Create

### Core PWA Files
- `index.html`: Main entry point and SPA container.
- `manifest.json`: PWA configuration.
- `service-worker.js`: Offline support and caching strategy.
- `styles.css`: Base styles (Mobile-first, Vanilla CSS).
- `app.js`: Main application logic (SPA router and initialization).

### Modules (JS)
- `js/db.js`: Database layer (SQLite via sql.js or IndexedDB/localStorage fallback).
- `js/ui.js`: UI rendering and event handling.
- `js/calendar.js`: Calendar-specific logic.
- `js/employees.js`: Employee management logic.
- `js/hours.js`: Work hours management logic.

## DB Schema (SQLite)
As defined in `orchestrator.md`:
- `employees`
- `work_hours`
- `price_hour`
- `settings`

## Implementation Plan
1.  Initialize `index.html` with a basic structure (Calendar placeholder, Burger menu).
2.  Set up `manifest.json` and a basic `service-worker.js`.
3.  Implement the database layer (`db.js`) with the defined schema.
4.  Implement basic UI components (`ui.js`).
5.  Implement the Calendar view.

## Verification
- PWA manifest validation.
- Service worker registration.
- Schema creation on first load.
