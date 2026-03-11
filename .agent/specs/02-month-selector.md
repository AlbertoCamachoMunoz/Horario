# Spec: Selector de Mes y Año Profesional

## 1. Objetivo
Implementar un selector de fecha (Mes y Año) que sea altamente visible, intuitivo y que permita tanto la navegación secuencial (atrás/adelante) como la selección directa de un mes y año específicos para mejorar la experiencia de usuario en dispositivos móviles.

## 2. Problemas Identificados
- El encabezado actual (h2 + botones) puede confundirse con texto estático o quedar oculto bajo el header fijo.
- Falta de capacidad para saltar a un mes lejano sin múltiples clics.
- Contraste visual insuficiente en modo local (`file://`).

## 3. Propuesta Técnica

### UI/UX (CSS)
- **Header Flotante**: El encabezado del calendario debe tener un contraste fuerte (fondo ligeramente gris o sombra pronunciada).
- **Interactividad**: El texto del mes (`Marzo 2026`) se convertirá en un elemento interactivo (botón/dropdown) para abrir un selector rápido.
- **Botones de Navegación**: Aumentar el área de toque (mínimo 48x48px) y añadir iconos claros.

### Estructura HTML
```html
<div id="calendar-header" class="calendar-controls">
    <button id="prev-month" class="nav-btn" aria-label="Mes anterior">&lt;</button>
    <div id="month-year-picker" class="date-display">
        <span id="current-month-label">Marzo</span>
        <span id="current-year-label">2026</span>
    </div>
    <button id="next-month" class="nav-btn" aria-label="Mes siguiente">&gt;</button>
</div>
```

### Lógica (JS)
- **Componente Picker**: Al hacer clic en el nombre del mes o año, se mostrará un modal o un `select` oculto para cambiar rápidamente.
- **Sincronización**: Al cambiar el mes/año, el calendario debe re-renderizarse inmediatamente.

## 4. Archivos a Modificar
- `app/index.html`: Actualizar estructura del header del calendario.
- `app/styles.css`: Añadir estilos de contraste, sombras y estados `:active`.
- `app/js/calendar.js`: Implementar la lógica de apertura del selector directo.

## 5. Criterios de Aceptación
1. El selector es visible inmediatamente al cargar la app (debajo del título "Horarios").
2. Los botones `<` y `>` cambian el mes correctamente.
3. El diseño es 100% responsivo y táctil.
