# Especificación Técnica: Sistema de Gestión de Pagos y Lógica de Horas Pendientes

## 1. Objetivo
Implementar un sistema que permita diferenciar las horas trabajadas entre "Pagadas" y "No Pagadas". El sistema debe ser configurable globalmente para que los reportes y totales de los empleados se calculen basándose únicamente en las horas pendientes (no pagadas) o en el total histórico, según la preferencia del usuario.

## 2. Configuración Global (`settings`)
Se añadirá una nueva clave en el almacén de configuración:
- **Clave:** `only_unpaid_logic`
- **Tipo:** `Boolean` (true/false)
- **Descripción:** Si está en `true`, los totales de horas y costes en los reportes solo sumarán las horas marcadas como `paid: false`. Si está en `false`, se mantiene la lógica actual (suma todas las horas independientemente de su estado).
- **Interfaz:** Un interruptor (toggle) en el menú de "Ajustes".

## 3. Modelo de Datos (`work_hours`)
Se extiende el objeto `work_hours` con un nuevo campo:
- **Campo:** `paid`
- **Tipo:** `Boolean`
- **Valor por defecto:** `false`
- **Tratamiento Retroactivo:** Al leer registros antiguos que no posean el campo `paid`, la lógica de la aplicación los tratará automáticamente como `false`.

## 4. Lógica de Entrada de Horas (`hours.js`)
1. **Creación:** Cualquier registro nuevo de horas se guardará con `paid: false`.
2. **Edición:** 
   - Si se sobrescriben las horas de un día que ya estaba marcado como `paid: true`, se debe mostrar un aviso al usuario informando que el estado de pago se reseteará a "No Pagado" (opcionalmente se puede permitir mantener el estado, pero por defecto se resetea para evitar fraudes/errores).

## 5. Visualización en Detalle de Empleado (`employee-detail.js`)
El desglose de horas por empleado (diario, semanal y mensual) reflejará el estado de pago mediante:
- **Colores Semánticos:**
    - **Pendiente:** Fondo `#fff3cd` (amarillo/naranja suave) y borde sutil.
    - **Pagado:** Fondo `#d4edda` (verde suave) y borde sutil.
- **Iconografía/Check:**
    - Se mostrará un checkbox circular al lado de cada día.
    - Si está pagado, el checkbox aparecerá marcado (✓) y bloqueado o con estilo visual de "completado".

## 6. Operaciones de Pago (Acciones)
El sistema permitirá liquidar (pagar) horas en tres niveles:
1. **Nivel Diario:** Checkbox individual en la fila de cada día en el detalle del empleado.
2. **Nivel Semanal:** Botón "Liquidar Semana" en la cabecera de cada bloque de semana.
3. **Nivel Mensual:** Botón "Liquidar Mes" en el resumen superior del panel del empleado.
4. **Nivel Multi-empleado (Reportes):** 
   - En la vista de `reports.js`, se añadirá una opción para "Marcar mes actual como pagado para TODOS los empleados activos".

## 7. Lógica de Cálculo de Totales
La función de renderizado de totales debe aplicar el filtro condicional:

```javascript
// Pseudocódigo de la lógica de cálculo
const applyFilter = await db.getSetting('only_unpaid_logic');
let displayedHours = allHours;

if (applyFilter === true) {
    displayedHours = allHours.filter(h => h.paid === false);
}

const totalHours = displayedHours.reduce((sum, h) => sum + h.hours, 0);
const totalCost = displayedHours.reduce((sum, h) => sum + (h.hours * getPrice(h.date)), 0);
```

## 8. Impacto en la UI (Modificaciones de CSS)
Se deben añadir clases específicas:
- `.row-unpaid`: Color de fondo de advertencia.
- `.row-paid`: Color de fondo de éxito.
- `.badge-status`: Etiqueta pequeña indicando "Pendiente" o "Pagado".

## 9. Plan de Implementación Sugerido
1.  **Fase 1:** Actualizar `db.js` para soportar el nuevo campo y añadir la configuración inicial en `settings.js`.
2.  **Fase 2:** Implementar el interruptor en la UI de Ajustes.
3.  **Fase 3:** Modificar `hours.js` para asegurar que el guardado de horas use el campo `paid: false`.
4.  **Fase 4:** Actualizar `employee-detail.js` con la lógica de filtrado de totales y los estilos visuales.
5.  **Fase 5:** Añadir los controladores de eventos para los botones de pago (día, semana, mes).
6.  **Fase 6:** Implementar la acción masiva en la vista de Reportes Globales.

## 10. Validación y Pruebas
- Verificar que al activar el toggle de ajustes, los totales cambien instantáneamente.
- Confirmar que al marcar una semana como pagada, el total de "pendientes" baje a 0 para esa semana.
- Probar que el pago masivo de reportes afecte a todos los empleados del mes seleccionado.
