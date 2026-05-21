---
status: aprobado
classId: m4-c04
exerciseNum: 4
type: A
typeName: "Práctica Guiada"
title: "Crear AGENTS.md"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-05-20T16:05:11.971Z
lastUpdated: 2026-05-20T16:05:11.971Z
xpAwarded: 0
reviewedAt: "2026-05-21T18:00:00.000Z"
---

# Práctica Guiada: Crear AGENTS.md

**Módulo:** 4 — AI Coding Tools · **Clase:** 04 · **Ejercicio:** 4

## Código

```python
# AGENTS.md

## Nombre del proyecto

Shopping Cart TDD

## Descripción del proyecto

Este proyecto es un ejercicio de Python orientado a practicar TDD, testing con pytest y generación asistida de código con IA.

El objetivo principal es implementar una clase `ShoppingCart` que permita gestionar productos en un carrito de compra, calcular totales, aplicar descuentos y validar casos inválidos como cantidades negativas.

## Stack tecnológico

- Python 3
- pytest
- Git
- GitHub
- Copilot / Cursor como asistente de IA

## Convenciones de código

### Naming

- Usar `snake_case` para nombres de variables, funciones y métodos.
- Usar `PascalCase` para nombres de clases.
- Usar nombres descriptivos, por ejemplo:
  - `add_product`
  - `remove_product`
  - `apply_discount`
  - `calculate_total`

### Estilo de código

- Mantener funciones pequeñas y fáciles de entender.
- Evitar lógica duplicada.
- Separar la lógica interna en métodos privados cuando sea necesario.
- Los métodos privados deben empezar con guion bajo `_`.

Ejemplo:

```python
def _calculate_total(self):
    pass
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 21/05/2026 18:00 (revisión automática)*

### Lo que está bien
- AGENTS.md con la estructura correcta: nombre, descripción, stack, convenciones de naming y estilo. Eso es lo que un agente IA necesita para no improvisar.
- Buena distinción entre `snake_case` para funciones/variables y `PascalCase` para clases, con ejemplos concretos (`add_product`, `_calculate_total`).
- La regla de "métodos privados con guion bajo" la has aplicado de verdad en el ej1 (`_calculate_total`). Eso demuestra que el AGENTS.md no es decoración.

### Sugerencias para mejorar
- Falta una sección de **comandos** (`pytest`, `python -m pytest tests/`, etc.) para que el agente sepa cómo ejecutar tests sin preguntar. Es lo más útil del AGENTS.md en el día a día.
- Añade una sección corta de **qué NO hacer** (ejemplo: "no usar prints para debug, usar logging") — la mayoría de problemas vienen de ahí.

### XP: +0 XP (práctica guiada — XP otorgado al entregar)
