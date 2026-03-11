# Employee Work Hours PWA – Technical Specification

## 1. Overview
Mobile-oriented PWA / SPA built with JavaScript, HTML and CSS to manage employee working hours with a calendar interface.

Goals:
- Simple hour entry
- Employee management
- Automatic cost calculation
- Mobile-first
- Offline capable

---

# 2. Frontend Architecture

## Application Type
Progressive Web App implemented as a Single Page Application.

Stack:
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3

Optional:
- Day.js for dates

---

# 3. Main Screen

Calendar showing current month.

Features:
- Current day highlighted
- Navigate between months

Action:
Tap any day → show employee list.

---

# 4. Day Employees List

Shows employees.

First option:
Todos los empleados

Each row:

Employee name  
[ hours input ]

Rules:
- integer only
- required
- > 0

Todos los empleados applies same hours to all.

---

# 5. Employee Detail

View worked hours:

- day
- week
- month
- year

Calculation:

hours * hourly_rate

Totals displayed.

---

# 6. Burger Menu

Options:

1. Employees CRUD
2. Hour price CRUD
3. Default hours setting

---

# 7. Employees CRUD

Fields:

| field | type |
|------|------|
| id | autoincrement |
| nombre | string |
| tlf | string nullable |
| direccion | string nullable |
| vehiculo | boolean |
| activo | boolean |

Inactive employees kept for history.

---

# 8. Hour Price CRUD

Fields:

| field | type |
|------|------|
| id | int |
| price_hour | float |
| start_date | date |

Allows price history.

---

# 9. Default Hours

Setting example:

default_hours = 8

Used when entering daily hours.

---

# 10. Validation Rules

Hours:
- integer
- >0
- not null
- not empty

Employee:
- name required

Prevent:
- negative hours
- duplicate employee/date records

---

# 11. Database Specification

Preferred: SQLite  
Fallback: JSON storage

---

# 12. SQLite Schema

## employees

CREATE TABLE employees (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nombre TEXT NOT NULL,
 tlf TEXT,
 direccion TEXT,
 vehiculo BOOLEAN NOT NULL,
 activo BOOLEAN NOT NULL
);

## work_hours

CREATE TABLE work_hours (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 employee_id INTEGER NOT NULL,
 date TEXT NOT NULL,
 hours INTEGER NOT NULL,
 FOREIGN KEY(employee_id) REFERENCES employees(id)
);

## price_hour

CREATE TABLE price_hour (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 price_hour REAL NOT NULL,
 start_date TEXT NOT NULL
);

## settings

CREATE TABLE settings (
 key TEXT PRIMARY KEY,
 value TEXT
);

Example:

default_hours = 8

---

# 13. JSON Alternative

{
 "employees":[],
 "work_hours":[],
 "price_hour":[],
 "settings":{
  "default_hours":8
 }
}

---

# 14. Calculations

daily_cost = hours * price_hour

Totals:

SUM(hours) * price_hour

---

# 15. PWA Requirements

Files:

manifest.json  
service-worker.js  
index.html

Features:
- offline support
- installable
- local storage

---

# 16. UI Guidelines

Mobile-first.

Principles:

- large tap targets
- simple numeric inputs
- minimal navigation
- inline validation