# Frontend Skill - Horarios PWA

## Overview
This skill defines the UI/UX standards for the `horarios` PWA.

## Principles
- **Mobile-First**: Design primarily for mobile devices (portrait view).
- **Vanilla CSS**: Avoid CSS frameworks unless explicitly requested.
- **SPA**: All navigation happens within `index.html`.

## Layout
- Header: App name and Burger Menu icon.
- Main: Content container for different views (Calendar, List, Detail).
- Navigation: Burger menu for settings and CRUD views.

## Component Patterns
- **Large Tap Targets**: Buttons and interactive elements should be at least 48x48px.
- **Simple Numeric Inputs**: Use `type="number"` or `inputmode="numeric"` for hours.
- **Minimal Navigation**: Minimize deep nesting; use flat navigation where possible.
- **Inline Validation**: Provide immediate visual feedback for required or invalid fields.

## Styling
- Use CSS Variables for colors, fonts, and spacing.
- Flexbox and CSS Grid for layouts.
- Primary color: Professional blue or green.
- Error color: Red.
- Success color: Green.

## Modules
- `js/ui.js`: Handles DOM manipulation and rendering.
- `js/app.js`: Main router and initialization.
- `js/calendar.js`: Specific logic for the calendar view.
- `js/employees.js`: Specific logic for employee CRUD.
- `js/hours.js`: Specific logic for hours entry.
