---
status: pendiente
classId: m4-c01
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Usar sugerencias inline"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-06-22T12:34:32.677Z
lastUpdated: 2026-06-22T12:34:32.677Z
xpAwarded: 5
---

# Práctica Guiada: Usar sugerencias inline

**Módulo:** 4 — AI Coding Tools · **Clase:** 01 · **Ejercicio:** 2

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
```

## Feedback

_(pendiente de revisión automática)_
