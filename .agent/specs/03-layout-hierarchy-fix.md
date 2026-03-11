# Spec: Corrección de Layout y Jerarquía Visual

## 1. Objetivo
Resolver el solapamiento visual entre la cabecera fija y el selector de fecha del calendario, garantizando una separación clara y una jerarquía de capas (z-index) correcta para evitar interferencias con el menú hamburguesa.

## 2. Problemas Identificados
- **Espaciado Insuficiente**: `main` solo tiene 10px de margen superior extra, lo que causa colisión visual con el `header` fijo.
- **Conflicto de Sombras**: La sombra del selector de mes choca con la sombra del header.
- **Z-Index**: Riesgo de que elementos del calendario queden por encima del menú desplegable o viceversa.

## 3. Propuesta Técnica

### CSS (Ajustes Estructurales)
- **Incrementar Spacing**: Aumentar el `margin-top` de `main` de `10px` a `25px` adicionales para crear "aire" respirable entre la cabecera y el contenido.
- **Z-Index Audit**: 
    - `header`: 1000 (Mantener como capa superior).
    - `#side-menu`: 1100 (Debe estar POR ENCIMA del header al abrirse).
    - `.calendar-controls`: 100 (Debe estar por debajo de cualquier UI de navegación).
    - `#toast-container`: 10000 (Siempre arriba de todo).
- **Header Polished**: Añadir un ligero `padding-bottom` al header para que no se sienta tan apretado con el título.

### Estilo de la Cabecera del Calendario
- Asegurar que `.calendar-controls` sea `position: relative` para manejar su propio contexto de apilamiento de forma segura.

## 4. Archivos a Modificar
- `app/styles.css`: Reajustar variables de espaciado y jerarquía de z-index.

## 5. Criterios de Aceptación
1. Al hacer scroll, el selector de mes pasa limpiamente bajo la cabecera azul.
2. El menú hamburguesa se abre por encima de cualquier otro elemento sin transparencia indeseada.
3. Hay una separación visual clara (mínimo 20-30px) entre el borde inferior de la cabecera azul y el inicio del selector blanco.
