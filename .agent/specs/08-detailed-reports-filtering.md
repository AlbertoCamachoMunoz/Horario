# Spec 08: Detailed Reports Filtering and Informative View

## 1. Overview
Refactor the "Informes Detallados" (Detailed Reports) view to focus purely on information retrieval and display, removing interactive payment management and introducing report filtering by payment status.

## 2. UI Changes (Informes Detallados)

### Remove Payment Management
- Remove any "PAGAR" (Pay) buttons from the detailed reports view.
- Ensure the view is strictly read-only/informative.

### Report Filtering
- Add a new selector or toggle to choose between three report types:
    1. **Pendiente de Pago** (Unpaid): Shows only hours that have not been paid yet.
    2. **Pagado (Histórico)** (Paid): Shows only hours already marked as paid.
    3. **Todo** (All): Shows all recorded hours regardless of payment status.

## 3. Logic and Data Display

### Filtering Logic
- Update `reports.js` to filter the data based on the `paid` boolean field in the `work_hours` table.
- Filter should apply to the monthly/weekly view currently being generated.

### Information Layout
- Keep the current structure of grouping by employee and week.
- Ensure totals are accurately calculated based on the active filter.

## 4. Constraints
- The view must NOT allow any interaction to change the state of the data (no toggles, no checkboxes, no buttons).
- It should serve as a source for checking history or pending amounts.
