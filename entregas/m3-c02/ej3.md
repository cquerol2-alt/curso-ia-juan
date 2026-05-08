---
status: aprobado
classId: m3-c02
exerciseNum: 3
type: A
typeName: "Práctica Guiada"
title: "JSON mode"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-08T15:46:29.351Z
lastUpdated: 2026-05-08T17:43:36.000Z
xpAwarded: 0
reviewedAt: 2026-05-08T17:43:36.000Z
---

# Práctica Guiada: JSON mode

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 02 · **Ejercicio:** 3

## Código

```python
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": """
Analiza esta película: "Dune (2021) es una epopeya de ciencia ficción dirigida por Denis Villeneuve."

Responde en JSON con estos campos:
- titulo (string)
- genero (string)
- director (string)
- año (number)
- description (string corta)
"""
        }
    ],
    temperature=0,
    max_tokens=200,
    response_format={"type": "json_object"}
)

movie = json.loads(response.choices[0].message.content)

print(f"Película: {movie['titulo']} ({movie['año']}), director: {movie['director']}")
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 08/05/2026 17:43 (revisión automática)*

### Lo que está bien
- Uso correcto de `response_format={"type": "json_object"}` — es exactamente la forma de forzar al modelo a devolver JSON válido en lugar de texto libre. Esto es lo clave de la clase.
- Buen reflejo: `temperature=0` cuando lo que quieres es **datos estructurados**, no creatividad. Aquí no quieres que el modelo "improvise" el año de la peli.
- Has cerrado el bucle correctamente: el modelo devuelve un string JSON → `json.loads(...)` lo parseas a dict → accedes a los campos con `movie['titulo']`. Ese es el patrón.
- Buen detalle pedir explícitamente los campos en el prompt (`titulo`, `genero`, `director`, `año`, `description`). Sin esa lista el modelo se inventa la estructura.

### Sugerencias para mejorar
- En modo JSON, OpenAI **exige** que la palabra "JSON" aparezca en algún sitio del prompt. Tú ya tienes "Responde en JSON con estos campos" así que cumple, pero tenlo presente: si lo olvidas, la API te devuelve un error.
- `max_tokens=200` te puede quedar corto si pides una `description` larga o varias películas a la vez. Si alguna respuesta sale truncada, sube a 500 o quítalo.
- Para el siguiente paso, mira **Pydantic + `response_format` con schema**. Te permite definir la estructura exacta como una clase Python y te la valida automáticamente — es el siguiente nivel de esto mismo.

### XP: +0 XP (ya recibido al entregar)
