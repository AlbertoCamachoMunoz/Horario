# Spec 12: Future Date Restriction and Hour Modification Confirmations

## 1. Overview
Implement safety restrictions to prevent entering work hours for future dates and add a confirmation step when modifying existing hour records to prevent accidental changes.

## 2. Future Date Restriction
- **Behavior:** In the calendar view, if a user clicks on a day that is later than today's date:
    - The application must NOT allow opening the "Day Hours" view.
    - A warning toast or message should inform the user: "No se pueden añadir horas a fechas futuras."
- **Exception:** Notes can still be viewed or added? *Clarification: The user said "no se puedan añadir horas", usually implying the whole view for that day is restricted for editing.*
- **Implementation:** Check the selected date against `new Date()` in `calendar.js` or `hours.js`.

## 3. Modification Confirmation
- **Behavior:** In the "Day Hours" view, when the user clicks "GUARDAR HORAS":
    - The system must detect if any employee already had hours registered for that day.
    - If changes are detected in existing records (different hours or clearing hours), a confirmation dialog must appear: "¿Deseas modificar las horas ya existentes para este día?".
- **Scope:** This is independent of the "Paid" status confirmation (which already exists). This applies even to unpaid hours if they are being changed.

## 4. Implementation Details

### JavaScript (calendar.js)
- Update the click event listener for `calendar-day`.
- Add a check: `if (selectedDate > today) return showToast(...)`.

### JavaScript (hours.js)
- Update `saveDayHours` to detect if the `inputs` differ from the `existingMap` data.
- Prompt `confirm()` if modifications to existing records are found.

## 5. Constraints
- The current day (today) is always editable.
- Past days are always editable.
- This restriction does NOT apply to the "Employee Detail" (Histórico) or "Reports" views as they are informative or for payment management.
