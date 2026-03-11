# Spec: Corrección de Layout Global y Espaciado de Cabecera

## 1. Objetivo
Garantizar que todas las vistas de la aplicación comiencen exactamente debajo de la cabecera azul, eliminando cualquier solapamiento visual y asegurando una jerarquía de capas (z-index) consistente en todo el proyecto.

## 2. Problemas Identificados
- **Márgenes por Defecto**: El `h1` del título tiene márgenes de navegador que pueden alterar la altura real percibida de la cabecera.
- **Margen Insuficiente**: El `margin-top` actual de `main` es muy ajustado (70px) para un diseño moderno con sombras.
- **Jerarquía de Capas**: Necesidad de blindar el `z-index` para que el contenido nunca pase por encima de la barra de navegación.

## 3. Propuesta Técnica

### CSS (Global)
- **Reset de Títulos**: Eliminar márgenes por defecto de `h1`, `h2`, `h3` dentro del header y las vistas.
- **Ajuste de Header**: 
    - Fijar la altura de la cabecera con precisión.
    - Asegurar que `header-content` no desborde.
- **Offset de Main**: 
    - Cambiar `margin-top` por `padding-top` en el `body` o `main` para evitar colapsos de margen.
    - Aumentar el espacio libre a un valor más seguro (ej. 80px - 90px).
- **Z-Index Maestro**:
    - `header`: 1000
    - `#side-menu`: 1100
    - `.view`: 1 (Capa base)
    - `.calendar-controls`: 10 (Capa de controles)

## 4. Archivos a Modificar
- `app/styles.css`: Centralizar toda la lógica de espaciado y capas.

## 5. Criterios de Aceptación
1. Al cargar cualquier vista (Calendario, Empleados, Precios), el primer elemento visible debe estar totalmente separado de la cabecera azul.
2. No debe haber ningún "salto" visual al cambiar entre páginas.
3. El menú hamburguesa debe cubrir tanto el header como el contenido al abrirse.
