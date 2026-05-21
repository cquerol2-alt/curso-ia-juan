---
status: aprobado
classId: m4-c04
exerciseNum: 3
type: A
typeName: "Práctica Guiada"
title: "Debug con IA"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-05-20T16:02:44.857Z
lastUpdated: 2026-05-20T16:02:44.857Z
xpAwarded: 0
reviewedAt: "2026-05-21T18:00:00.000Z"
---

# Práctica Guiada: Debug con IA

**Módulo:** 4 — AI Coding Tools · **Clase:** 04 · **Ejercicio:** 3

## Código

```python
def calculate_discount(price, discount_percent):
    return price * discount_percent / 100
# Resultado: calculate_discount(100, 20) = 20
print(calculate_discount(100, 20))
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 21/05/2026 18:00 (revisión automática)*

### Lo que está bien
- La función está bien: `price * discount_percent / 100` devuelve el importe del descuento (no el precio final), y el comentario lo deja claro: `calculate_discount(100, 20) = 20`. Es lo que el ejercicio pedía.
- Pones un `print` al final para validar la salida — el clásico smoke test antes de pasar a tests más serios.

### Sugerencias para mejorar
- Para la próxima añade una mínima validación: `if discount_percent < 0 or discount_percent > 100:` lanzar `ValueError`. Es el siguiente paso natural después de detectar el bug original.

### XP: +0 XP (práctica guiada — XP otorgado al entregar)
