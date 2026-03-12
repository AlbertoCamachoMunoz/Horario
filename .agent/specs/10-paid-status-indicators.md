# Spec 10: Weekly Paid Status Indicators

## 1. Overview
Enhance the visual feedback of the weekly blocks in the "Employee Detail" view by adding a "TODO PAGADO" (Fully Paid) indicator when all recorded hours in a week are paid.

## 2. Dynamic Status Indicator
- **Fully Paid State:** If all recorded days in a week are marked as paid:
    - Replace the "PAGAR SEMANA" button with a green label/badge saying "TODO PAGADO".
    - The week remains collapsible/expandable, but the indicator shows completion.
- **Pending State:** If at least one day is unpaid:
    - Show the standard "PAGAR SEMANA" button in its original color.
    - Show the standard weekly totals (Hours | Cost).

## 3. Interaction Logic
- When a user expands a "Fully Paid" week and unchecks a day's payment:
    - The "TODO PAGADO" label must instantly revert to the "PAGAR SEMANA" button.
    - The week's header background and overall styling must revert to the "Pending" state (uncollapsed by default in next render, though the current view remains open for the user).

## 4. Implementation Details

### CSS (styles.css)
- Add styles for the `.badge-all-paid` (Green background, white text, bold).
- Ensure the header maintains consistent spacing whether it shows a button or a badge.

### JavaScript (employee-detail.js)
- Update the `renderDashboard` loop to check if `weekUnpaidH === 0` (and `week.days.length > 0`).
- Use conditional rendering for the button/badge area in the `week-header`.
- Ensure the `toggleDayPay` function triggers a re-render so the header updates immediately when a checkbox is changed.

## 5. Constraints
- Empty weeks (no records) should NOT show "TODO PAGADO"; they remain in their "Disabled/Empty" state.
- The indicator must be reactive to the `toggleDayPay` action.
