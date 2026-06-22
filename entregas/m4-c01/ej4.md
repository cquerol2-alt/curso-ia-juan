---
status: pendiente
classId: m4-c01
exerciseNum: 4
type: B
typeName: "Mini-Reto"
title: "El generador de funciones"
module: 4
moduleName: "AI Coding Tools"
submittedAt: 2026-06-22T15:25:26.679Z
lastUpdated: 2026-06-22T15:25:26.679Z
xpAwarded: 5
---

# Mini-Reto: El generador de funciones

**Módulo:** 4 — AI Coding Tools · **Clase:** 01 · **Ejercicio:** 4

## Código

```python
# Archivo: utiles.py
# Colección de funciones útiles generadas con GitHub Copilot

# funcion que valida si una cadena es un email válido
import re
import uuid
def es_email_valido(email):
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None
# funcion que formatea una fecha (ej: "01/04/2026" → "1 de abril de 2026")
def formatear_fecha(fecha):
    meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
             "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    dia, mes, año = fecha.split('/')
    dia = int(dia)
    mes = int(mes)
    año = int(año)
    return f"{dia} de {meses[mes - 1]} de {año}"
# funcion que ordena un array de objetos por propiedad
def ordenar_por_propiedad(array, propiedad):
    return sorted(array, key=lambda x: x[propiedad])
# funcion que convierte camelCase a snake_case
def camel_a_snake(cadena):
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', cadena).lower()
# funcion que cuenta palabras en un texto
def contar_palabras(texto):
    return len(texto.split())
#funcion que genera un ID único (UUID simple)

def generar_id_unico():
    return str(uuid.uuid4())
# funcion que valida si una contraseña es fuerte (mín 8 caracteres, mayúscula, número)
def es_contrasena_fuerte(contrasena):
    if len(contrasena) < 8:
        return False
    if not re.search(r'[A-Z]', contrasena):
        return False
    if not re.search(r'\d', contrasena):
        return False
    return True
# funcion que pagina un array (ej: página 2 de 10 elementos por página)
def paginar_array(array, pagina, elementos_por_pagina):
    inicio = (pagina - 1) * elementos_por_pagina
    fin = inicio + elementos_por_pagina
    return array[inicio:fin]
# funcion para calcular tiempo transcurrido entre dos fechas
from datetime import datetime
def tiempo_transcurrido(fecha_inicio, fecha_fin):
    formato = "%Y-%m-%d %H:%M:%S"
    inicio = datetime.strptime(fecha_inicio, formato)
    fin = datetime.strptime(fecha_fin, formato)
    return str(fin - inicio)
# funcion para crear un deep clone de un objeto
import copy
def deep_clone(objeto):
    return copy.deepcopy(objeto)

# main para pruebas rápidas
if __name__ == "__main__":
    print(es_email_valido("user@example.com"))
    print(es_email_valido("invalid-email"))
    print(formatear_fecha("15/06/2023"))
    print(ordenar_por_propiedad([{"nombre": "Juan"}, {"nombre": "Ana"}], "nombre"))
    print(camel_a_snake("nombreCompleto"))
    print(contar_palabras("Hola mundo"))
    print(generar_id_unico())
    print(es_contrasena_fuerte("Contraseña123"))
    print(paginar_array([1, 2, 3, 4, 5], 2, 2))
    print(tiempo_transcurrido("2023-06-15 10:00:00", "2023-06-15 12:00:00"))
    print(deep_clone({"nombre": "Juan", "edad": 30}))
```

## Notas de Juan

**Output:**
```
True
False
15 de junio de 2023
[{'nombre': 'Ana'}, {'nombre': 'Juan'}]
nombre_completo
2
756ecd36-b6f9-4c26-aac7-04ea3a4eaf4e
True
[3, 4]
2:00:00
{'nombre': 'Juan', 'edad': 30}
```



## Feedback

_(pendiente de revisión automática)_
