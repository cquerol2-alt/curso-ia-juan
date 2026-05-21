---
status: aprobado
classId: m4-c04
exerciseNum: 1
type: A
typeName: "Práctica Guiada"
title: "TDD con Copilot"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-05-20T12:36:51.327Z
lastUpdated: 2026-05-20T12:36:51.327Z
xpAwarded: 0
reviewedAt: "2026-05-21T18:00:00.000Z"
---

# Práctica Guiada: TDD con Copilot

**Módulo:** 4 — AI Coding Tools · **Clase:** 04 · **Ejercicio:** 1

## Código

```python
import pytest
# Clase que gestiona un carrito de compra con métodos add, remove, apply_discount

class ShoppingCart:

    def __init__(self):
        self.items = []
        self.discount = 0

    def add(self, name, price, quantity=1):
        if quantity < 0:
            raise ValueError("La cantidad no puede ser negativa.")
        self.items.append({"name": name, "price": price, "quantity": quantity})

    def remove(self, name, quantity=1):
        for item in self.items:
            if item["name"] == name:
                if quantity >= item["quantity"]:
                    self.items.remove(item)
                else:
                    item["quantity"] -= quantity
                break

    def apply_discount(self, percentage):
        self.discount = percentage

    def _calculate_total(self):
        return sum(item["price"] * item["quantity"] for item in self.items)

    def total(self):
        total_price = self._calculate_total()
        return total_price * (1 - self.discount / 100)
    

def test_add_product_increases_total():
    cart = ShoppingCart()

    cart.add("manzana", price=2.50, quantity=2)

    assert cart.total() == 5.00


def test_remove_product_decreases_total():
    cart = ShoppingCart()

    cart.add("pan", price=3.00, quantity=3)
    cart.remove("pan", quantity=1)

    assert cart.total() == 6.00


def test_apply_discount_reduces_final_price():
    cart = ShoppingCart()

    cart.add("camiseta", price=20.00, quantity=2)
    cart.apply_discount(25)

    assert cart.total() == 30.00


def test_empty_cart_returns_zero():
    cart = ShoppingCart()

    assert cart.total() == 0


def test_negative_quantity_is_not_allowed():
    cart = ShoppingCart()

    with pytest.raises(ValueError):
        cart.add("libro", price=10.00, quantity=-1)
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 21/05/2026 18:00 (revisión automática)*

### Lo que está bien
- Has seguido el ciclo TDD: tests primero, implementación después. Los 5 tests cubren los casos pedidos (add, remove, descuento, vacío, cantidad negativa).
- Bien separar `_calculate_total` como método privado (guion bajo). Eso ya lo verás formalizado en el AGENTS.md del ej4.
- Usar `pytest.raises(ValueError)` para validar la excepción es lo correcto, no un `try/except` casero.

### Sugerencias para mejorar
- En `remove`, si el producto no existe simplemente no hace nada. Para v2 podrías lanzar `ValueError` o devolver un booleano para que el usuario sepa que la operación no se aplicó.

### XP: +0 XP (práctica guiada — XP otorgado al entregar)
