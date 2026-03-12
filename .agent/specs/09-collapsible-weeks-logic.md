# Spec 09: Collapsible Weeks Logic in Employee Detail

## 1. Overview
Introduce collapsible behavior to the weekly blocks in the "Employee Detail" view. The default state of each week depends on whether it contains any unpaid hours.

## 2. Default State Logic
When the dashboard is rendered:
- **Weeks with Unpaid Hours:** Must be **Expanded** (Desglosada) by default.
- **Weeks with All Hours Paid:** Must be **Collapsed** (Glosada) by default.

## 3. UI/UX Behavior
- Each weekly block header should act as a toggle or have a dedicated toggle icon.
- A smooth transition (CSS) should animate the collapsing/expanding of the `week-content`.
- The user can manually toggle any week regardless of its default state.

## 4. Implementation Details

### CSS (styles.css)
- Add classes for the collapsed state (e.g., `.week-block.collapsed .week-content { display: none; }` or similar with height transition).
- Style the header to indicate it is clickable (cursor: pointer).
- Add an arrow icon or +/- indicator that rotates/changes based on state.

### JavaScript (employee-detail.js)
- Update `renderDashboard` to calculate if a week is "fully paid".
- Add a `collapsed` class to the `week-block` element if all days are paid.
- Implement a `toggleWeek(element)` function to switch the `collapsed` class.
- Ensure the "Pendiente semana" footer is also hidden when the week is collapsed (it belongs to `week-content`).

## 5. Constraints
- The logic must run every time the month/year is changed or a payment status is toggled (re-render).
- The "Fully Paid" check must consider the current `only_unpaid_logic` setting if applicable, but generally, if everything visible is paid, it collapses.
