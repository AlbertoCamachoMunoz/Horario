# Spec: Informes y Ventana de Retención de Datos (1 Año)

## 1. Objetivo
Implementar una vista de "Informes" para calcular el coste mensual de cada empleado y establecer un sistema de "Ventana Deslizante" (Sliding Window) que elimine automáticamente datos con más de 12 meses de antigüedad, ofreciendo previamente una exportación en formato CSV.

## 2. Componente A: Informes Mensuales
### UI/UX
- Añadir sección "Informes" al menú lateral.
- Vista con un selector de Mes y Año.
- Lista de empleados mostrando: Horas Totales del Mes y Coste Total (€).

### Lógica de Cálculo (Crucial)
El coste no es una simple multiplicación por el precio actual. Debe respetar el **historial de precios**.
1. Obtener todas las horas de un empleado en un mes.
2. Para cada registro de horas, buscar el precio vigente en esa fecha específica.
3. Sumar `(horas * precio_vigente)` para obtener el total.

## 3. Componente B: Ventana de Retención (Limpieza Automática)
### Algoritmo de Detección
- Al iniciar la app (`app.js`), comprobar si existe un registro en `settings` llamado `last_cleanup_month`.
- Comparar el mes/año actual con el de los datos en la tabla `work_hours`.
- Buscar registros de `work_hours` cuya fecha sea estrictamente anterior a `Mes Actual - 12 meses`.

### Flujo de Exportación y Borrado
Si se detectan datos antiguos:
1. **Bloqueo/Modal**: Mostrar un modal irremplazable: *"Se han detectado datos del año pasado (Ej: Marzo 2025). Por límite de espacio, se van a archivar."*
2. **Generación CSV**: Recopilar esos datos antiguos, cruzarlos con los nombres de empleados y generar un String en formato CSV (`Fecha;Empleado;Horas`).
3. **Opciones del Usuario**:
   - **"Exportar y Enviar"**:
     - Usar `navigator.share()` (Web Share API) para intentar enviar el CSV directamente a la app de correo (muy soportado en móviles).
     - **Fallback**: Si no soporta Web Share, forzar la descarga del `.csv` al disco duro.
   - **"Borrar sin Exportar"**: Elimina los datos directamente tras una confirmación.
4. **Borrado Físico**: Una vez exportado/confirmado, eliminar esos registros de la IndexedDB y actualizar `last_cleanup_month`.

## 4. Archivos a Modificar / Crear
- `app/index.html`: Nueva vista de Informes y Modal de Limpieza.
- `app/js/reports.js` (Nuevo): Lógica de cálculo financiero.
- `app/js/cleanup.js` (Nuevo): Servicio en segundo plano para detección de datos antiguos, generación de Blob CSV y borrado.
- `app/js/app.js`: Inyectar la llamada a `cleanup.checkOldData()` al inicio.

## 5. Estructura del CSV de Exportación
```csv
Fecha,ID_Empleado,Nombre_Empleado,Horas
2025-03-01,1,Juan Perez,8
2025-03-02,1,Juan Perez,8
```
