# DB Skill - Horarios PWA

## Overview
This skill defines the database layer for the `horarios` project.

## Stack
- Primary: SQLite (via `sql.js` or similar library if needed).
- Secondary/Fallback: LocalStorage or IndexedDB if SQLite is not feasible.

## Conventions
- Use `snake_case` for table and column names.
- Always include an `id INTEGER PRIMARY KEY AUTOINCREMENT`.
- Use `TEXT` for dates in `YYYY-MM-DD` format.
- Use `BOOLEAN` (stored as 0 or 1 in SQLite) for flags like `activo`, `vehiculo`.

## Initial Schema
- `employees`: (id, nombre, tlf, direccion, vehiculo, activo)
- `work_hours`: (id, employee_id, date, hours)
- `price_hour`: (id, price_hour, start_date)
- `settings`: (key PRIMARY KEY, value)

## Patterns
- All DB operations should be asynchronous (using `Promise`).
- Centralize all queries in `js/db.js`.
- Provide a `initDb()` function that creates tables if they don't exist.
