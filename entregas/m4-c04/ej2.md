---
status: aprobado
classId: m4-c04
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Refactoring Challenge"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-05-20T15:56:29.130Z
lastUpdated: 2026-05-20T15:56:29.130Z
xpAwarded: 0
reviewedAt: "2026-05-21T18:00:00.000Z"
---

# Práctica Guiada: Refactoring Challenge

**Módulo:** 4 — AI Coding Tools · **Clase:** 04 · **Ejercicio:** 2

## Código

```python
from typing import Any, Dict, Iterable, List


def is_active_adult_verified(employee: Dict[str, Any]) -> bool:
    """Return True when the employee is active, an adult, and verified."""
    return (
        employee.get('status') == 'active'
        and employee.get('age', 0) > 18
        and employee.get('verified') is True
    )


def calculate_adjusted_salary(salary: float) -> float:
    """Calculate the adjusted salary after applying a raise."""
    return salary * 1.1


def build_compensation_record(employee: Dict[str, Any], adjusted_salary: float) -> Dict[str, Any]:
    """Build the compensation record for an eligible employee."""
    return {
        'name': employee['name'],
        'new_salary': adjusted_salary,
        'bonus': adjusted_salary * 0.15,
    }


def process_data(records: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Process employee records and return compensation records for eligible people."""
    result: List[Dict[str, Any]] = []
    for employee in records:
        if not is_active_adult_verified(employee):
            continue

        adjusted_salary = calculate_adjusted_salary(employee['salary'])
        if adjusted_salary <= 50000:
            continue

        result.append(build_compensation_record(employee, adjusted_salary))

    return result
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 21/05/2026 18:00 (revisión automática)*

### Lo que está bien
- Refactor limpio: has roto la función original en 3 piezas con responsabilidad clara (`is_active_adult_verified`, `calculate_adjusted_salary`, `build_compensation_record`). Eso es exactamente lo que pide un refactoring challenge.
- Usas type hints (`Dict[str, Any]`, `Iterable`, `List`). Bien, ahí ganas legibilidad y autocompletado.
- Docstrings cortas y al grano en cada función.
- En `process_data` usas `continue` para early-return de cada caso. Mucho más legible que un `if` anidado.

### Sugerencias para mejorar
- `employee['name']` y `employee['salary']` lanzan `KeyError` si el campo falta. Si los datos vienen de un CSV poco fiable, usa `employee.get('name')` o valida con un guard al principio.

### XP: +0 XP (práctica guiada — XP otorgado al entregar)
