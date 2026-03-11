# Spec: Informes Detallados por Empleado

## 1. Objetivo
Implementar una vista de "Detalle de Empleado" que permita analizar de forma exhaustiva las horas trabajadas y los costes generados, organizados por jerarquía temporal (Mes, Semana, Día), y compararlos con las horas por defecto configuradas.

## 2. Flujo de Usuario
1. **Selección**: El usuario accede a "Informes por Empleado" y ve una lista de todos los empleados.
2. **Dashboard Individual**: Al seleccionar uno, se abre una vista dedicada al empleado.
3. **Filtros**: Selector de Mes/Año (por defecto el actual).
4. **Visualización**:
   - Resumen superior: Total Horas Mes vs Horas Esperadas (basado en horas defecto).
   - Listado por Semanas: "Semana 1 (Día X al Y) - Total: 40h - Coste: XXX€".
   - Desglose por Días (al expandir una semana o ver el mes completo).

## 3. Componentes Técnicos

### Lógica de Semanas
- Utilizaremos semanas de **Lunes a Domingo**.
- Una semana se define por su número de semana en el año o por el rango de fechas dentro del mes seleccionado.
- Cálculo de horas por semana: Suma de `work_hours` entre el lunes y el domingo correspondientes.

### Integración de Precios
- Al igual que en los informes globales, cada día se calculará con el precio vigente en su fecha respectiva (`getPriceForDate`).

### UI/UX
- **Vista Principal**: `view-employee-reports` (Lista de selección).
- **Vista Detalle**: `view-employee-detail` (Dashboard del empleado).
- **Gráficos (Opcional/Futuro)**: Barra de progreso (Horas trabajadas vs Horas contrato).

## 4. Archivos a Modificar / Crear
- `app/index.html`: Añadir las dos nuevas vistas (Lista y Detalle).
- `app/js/employee-detail.js` (Nuevo): Lógica de cálculo semanal y renderizado de detalle.
- `app/styles.css`: Estilos para el desglose de semanas y acordeones de días.

## 5. Criterios de Aceptación
1. Se puede navegar de la lista de empleados al detalle de uno específico.
2. El detalle muestra correctamente las horas sumadas por cada semana del mes.
3. Se muestra el coste económico acumulado por semana y mes.
4. El diseño es limpio y permite ver rápidamente si un empleado ha cumplido sus horas.
