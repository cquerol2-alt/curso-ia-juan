---
status: pendiente
classId: m4-c04
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Refactoring Challenge"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-05-20T15:56:29.130Z
lastUpdated: 2026-05-20T15:56:29.130Z
xpAwarded: 5
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

_(pendiente de revisión automática)_
