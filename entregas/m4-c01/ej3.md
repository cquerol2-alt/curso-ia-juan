---
status: pendiente
classId: m4-c01
exerciseNum: 3
type: A
typeName: "Práctica Guiada"
title: "Usar Copilot Chat"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-06-22T15:13:14.982Z
lastUpdated: 2026-06-22T15:13:14.982Z
xpAwarded: 5
---

# Práctica Guiada: Usar Copilot Chat

**Módulo:** 4 — AI Coding Tools · **Clase:** 01 · **Ejercicio:** 3

## Código

```python
# Proyecto: Calculadora con funciones básicas
# Descripción: suma, resta, multiplicación, división

# función que suma dos números y retorna el resultado
def sumar(a, b):
    return a + b
# función que resta dos números

def restar(a, b):
    return a - b
# función que multiplica dos números    

def multiplicar(a, b):
    return a * b
# función que divide dos números
def dividir(a, b):
    if b == 0:
        return "Error: División por cero"
    return a / b

# función principal que pide números al usuario y muestra opciones

def calculadora():
    print("Bienvenido a la calculadora básica")
    while True:
        print("\nOpciones:")
        print("1. Sumar")
        print("2. Restar")
        print("3. Multiplicar")
        print("4. Dividir")
        print("5. Salir")

        opcion = input("Seleccione una opción (1-5): ")

        if opcion == '5':
            print("Saliendo de la calculadora.")
            break

        num1 = float(input("Ingrese el primer número: "))
        num2 = float(input("Ingrese el segundo número: "))

        if opcion == '1':
            resultado = sumar(num1, num2)
            print(f"Resultado: {resultado}")
        elif opcion == '2':
            resultado = restar(num1, num2)
            print(f"Resultado: {resultado}")
        elif opcion == '3':
            resultado = multiplicar(num1, num2)
            print(f"Resultado: {resultado}")
        elif opcion == '4':
            resultado = dividir(num1, num2)
            print(f"Resultado: {resultado}")
        else:
            print("Opción no válida. Por favor, seleccione una opción del 1 al 5.")
        # llamar a la función principal

if __name__ == "__main__":
    calculadora()

# python
# PSEUDOCODE / PLAN (detailed, step-by-step)
# 1. Purpose: create pytest unit tests for the function `sumar(a, b)` located in:
#    pythonEjemplos.FlaskBasico.src.calciladora
# 2. Import strategy:
#    - Use an absolute import as required: from pythonEjemplos.FlaskBasico.src.calciladora import sumar
#    - Import pytest for assertions and exception testing.
# 3. Test cases to implement (each as a separate pytest function):
#    - test_sum_positive_integers:
#        * Call sumar(2, 3)
#        * Assert result equals 5
#    - test_sum_negative_integers:
#        * Call sumar(-2, -3)
#        * Assert result equals -5
#    - test_sum_mixed_signs:
#        * Call sumar(-2, 3)
#        * Assert result equals 1
#    - test_sum_floats:
#        * Call sumar(1.5, 2.25)
#        * Use pytest.approx to assert result is approximately 3.75
#    - test_sum_with_zero:
#        * Call sumar(0, 5) and sumar(0, 0)
#        * Assert results are 5 and 0 respectively
#    - test_sum_large_numbers:
#        * Use large integers like 10**18 to check no overflow issues
#        * Assert sumar(10**18, 10**18) equals 2 * 10**18
#    - test_sum_string_concat:
#        * Call sumar("a", "b")
#        * Assert it returns "ab" (string concatenation)
#    - test_sum_list_concat:
#        * Call sumar([1], [2])
#        * Assert it returns [1, 2] (list concatenation)
#    - test_sum_incompatible_types_raises:
#        * Call sumar(1, "2")
#        * Expect a TypeError to be raised
# 4. Implementation notes:
#    - Each test is independent, uses direct calls to sumar.
#    - Use clear, small assertions per test.
#    - Rely on pytest.raises for exception behavior.
# 5. File-level: save as src/test_calciladora.py and ensure pytest can discover it.
#
# Now the tests follow.

import pytest
from pythonEjemplos.FlaskBasico.src.calciladora import sumar

def test_sum_positive_integers():
    assert sumar(2, 3) == 5

def test_sum_negative_integers():
    assert sumar(-2, -3) == -5

def test_sum_mixed_signs():
    assert sumar(-2, 3) == 1

def test_sum_floats():
    assert sumar(1.5, 2.25) == pytest.approx(3.75)

def test_sum_with_zero():
    assert sumar(0, 5) == 5
    assert sumar(0, 0) == 0

def test_sum_large_numbers():
    big = 10**18
    assert sumar(big, big) == big + big

def test_sum_string_concat():
    assert sumar("a", "b") == "ab"

def test_sum_list_concat():
    assert sumar([1], [2]) == [1, 2]

def test_sum_incompatible_types_raises():
    with pytest.raises(TypeError):
        sumar(1, "2")
```

## Feedback

_(pendiente de revisión automática)_
