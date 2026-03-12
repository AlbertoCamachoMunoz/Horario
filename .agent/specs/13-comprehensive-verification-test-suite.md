# Spec 13: Plan de Verificación y Pruebas Integrales (QA)

## 1. Introducción
Este documento detalla las pruebas necesarias para validar que todas las especificaciones técnicas (Spec 01 a 12) se han implementado correctamente y que no existen regresiones.

## 2. Bloque 1: Navegación y Menú (Spec 03, 04)
| ID | Prueba | Pasos | Resultado Esperado |
|:---|:---|:---|:---|
| 1.1 | Orden del Menú | Abrir menú lateral | 1. Calendario, 2. Detalle Empleado, 3. Histórico, 4. Configurar Empleados, 5. Configurar Precio/Hora, 6. Configuración. |
| 1.2 | Cambio de Vistas | Pulsar cada opción | La vista cambia instantáneamente sin errores en la consola y resalta la vista actual. |

## 3. Bloque 2: Gestión de Horas y Restricciones (Spec 12)
| ID | Prueba | Pasos | Resultado Esperado |
|:---|:---|:---|:---|
| 2.1 | Fecha Futura | Pulsar un día posterior a hoy | Se abre el día, pero la sección de horas de empleados NO aparece (está oculta). |
| 2.2 | Fecha Pasada/Hoy | Pulsar hoy o ayer | La sección de horas aparece y permite entrada numérica. |
| 2.3 | Confirmación Modif. | Cambiar horas de un día que ya tenía datos y guardar | Aparece confirmación: "¿Deseas modificar las horas ya existentes para este día?". |
| 2.4 | Protección Pagados | Intentar cambiar horas de un registro marcado como PAGADO | Aparece aviso crítico de reset a "Pendiente de Pago". |

## 4. Bloque 3: Sistema de Notas (Spec 11)
| ID | Prueba | Pasos | Resultado Esperado |
|:---|:---|:---|:---|
| 3.1 | Ubicación Notas | Abrir un día con notas | Las notas aparecen arriba de todo, antes que las horas de empleados. |
| 3.2 | Formulario Plegado | Ver sección "Añadir Nota" | El formulario aparece plegado. Al pulsar la cabecera, se despliega. |
| 3.3 | Colores y Tipos | Añadir nota Roja (Imp), Amarilla (Alert), Azul (Info) | Las notas se guardan con su color de borde correspondiente. |
| 3.4 | Visualización Cal. | Ver calendario con días con notas | 1 nota: banda lateral. 2-3 notas: franjas verticales proporcionales. >3 notas: color sólido de mayor prioridad. |
| 3.5 | Borrado Seguro | Pulsar "X" en una nota | Pide confirmación antes de borrar. |

## 5. Bloque 4: Detalle de Empleado (Spec 06, 09, 10)
| ID | Prueba | Pasos | Resultado Esperado |
|:---|:---|:---|:---|
| 4.1 | Auto-colapso | Entrar a detalle de empleado con semanas pagadas y pendientes | Semanas 100% pagadas aparecen cerradas. Semanas con pendientes aparecen abiertas. |
| 4.2 | Indicador Verde | Ver cabecera de semana pagada | Muestra badge verde "TODO PAGADO" en lugar de botón. |
| 4.3 | Subtotal Pendiente | Ver pie de una semana con días sin pagar | Muestra suma: "X h = Y.YY €" en fondo rojizo suave. |
| 4.4 | Resumen Final | Ir al final del scroll | El bloque azul de total (Horas y Coste) aparece abajo del todo, no arriba. |
| 4.5 | Semanas Vacías | Ver semana sin horas registradas | Aparece en gris, deshabilitada y no permite desplegarse. |

## 6. Bloque 5: Histórico y Precios (Spec 07, 08)
| ID | Prueba | Pasos | Resultado Esperado |
|:---|:---|:---|:---|
| 5.1 | Filtros Histórico | Cambiar filtro a "Solo Pendientes" | Solo muestra registros no pagados y el total se etiqueta como "TOTAL PENDIENTE". |
| 5.2 | Cálculo Precios | Ver registros de fechas donde no había precio configurado | Usa el precio más antiguo disponible en lugar de multiplicar por 0. |
| 5.3 | Cruce de Meses | Ver una semana que empieza el mes anterior | Se listan todos los días de la semana (ej: 30/02, 01/03...) correctamente desglosados. |

## 7. Pruebas de Integridad de Datos
| ID | Prueba | Resultado Esperado |
|:---|:---|:---|
| 7.1 | Persistencia | Al recargar la página (F5), todos los datos, notas y estados de pago se mantienen. |
| 7.2 | Independencia | Añadir horas a un empleado nuevo no cambia el estado de "Pagado" de los empleados antiguos en el mismo día. |
