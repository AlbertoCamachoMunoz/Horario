# Spec 11: Daily Notes System and Calendar Visualization

## 1. Overview
Add a system to attach multiple categorized notes to any day in the calendar. These notes will be displayed in the daily hours view and represented visually on the main calendar grid using colored stripes or priority colors.

## 2. Note Categories and Priority
Notes must have one of the following types, each with an associated color:
1. **Importante (Important):** Red (`#f44336`) - Priority 1 (Highest)
2. **Alerta (Alert):** Yellow (`#ffc107`) - Priority 2
3. **Info (Information):** Blue (`#2196F3`) - Priority 3

## 3. Database Schema
Add a new object store named `day_notes`:
- `id`: Auto-incrementing primary key.
- `date`: String (YYYY-MM-DD), indexed.
- `content`: String (The note text).
- `type`: String ('important', 'alert', 'info').

## 4. UI Changes (view-day-hours)
- **Location:** Below the employee hours list in the "Día X" view.
- **Notes List:** Display existing notes for the selected day.
- **Add Note Form:**
    - Text area for the note content.
    - Selector/Buttons for color (Red, Yellow, Blue).
    - "Añadir Nota" button.
- **Delete Note:** Ability to remove individual notes.

## 5. Calendar Visualization Logic
The cell for a day in the calendar grid must reflect its notes:
- **0 Notes:** Standard background.
- **1-3 Notes of different colors:**
    - Use vertical stripes to represent the colors.
    - **1 Color:** Solid background of that color (at low opacity or as a side bar/indicator).
    - **2 Colors:** Split 50/50 vertically (e.g., `linear-gradient(to right, red 50%, blue 50%)`).
    - **3 Colors:** Split in three (33% each).
- **More than 3 Notes OR complex combinations:**
    - If there are > 3 notes and they contain different colors, use the **highest gravity color** as a solid background:
        1. If any is Red -> Red.
        2. Else if any is Yellow -> Yellow.
        3. Else -> Blue.

## 6. Implementation Details

### CSS (styles.css)
- Add classes for note cards in the list.
- Define stripe patterns for the calendar cells using `linear-gradient`.

### JavaScript
- **db.js:** Update `initDB` to include the `day_notes` store.
- **hours.js:** Add logic to load, save, and delete notes for the selected day.
- **calendar.js:** Update `render` to fetch notes for all days in the current month and apply the background logic.

## 7. Constraints
- Notes are independent of employee hours.
- Deleting all hours for a day should NOT delete the notes.
- The calendar stripes must be clearly visible but not obscure the day number.
