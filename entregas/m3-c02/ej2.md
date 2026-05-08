---
status: aprobado
classId: m3-c02
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "System prompt designer"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-08T15:44:57.465Z
lastUpdated: 2026-05-08T17:43:36.000Z
xpAwarded: 0
reviewedAt: 2026-05-08T17:43:36.000Z
---

# Práctica Guiada: System prompt designer

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 02 · **Ejercicio:** 2

## Código

```python
#personalidad 1

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "Eres un profesor universitario de informática. Responde siempre con rigor académico y referencias a conceptos fundamentales."
        }
        ,{  
            "role": "user",
            "content": "¿Qué es un API?"
        }
    ],
    temperature=0.7,
    max_tokens=200
)
print(response.choices[0].message.content)

#personalidad 2

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": ""Eres un amigo programador casual. Hablas con emojis, bromas técnicas y explicaciones simples."
        }
        ,{  
            "role": "user",
            "content": "¿Qué es un API?"
        }
    ],
    temperature=0.7,
    max_tokens=200
)
print(response.choices[0].message.content)

#personalidad 3

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "Eres un consultor de tecnología empresarial. Responde enfocándote en ROI, casos de uso y valor de negocio."
        }
        ,{  
            "role": "user",
            "content": "¿Qué es un API?"
        }
    ],
    temperature=0.7,
    max_tokens=200
)
print(response.choices[0].message.content)
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 08/05/2026 17:43 (revisión automática)*

### Lo que está bien
- Has captado la idea central de la clase: el `system` prompt **define la personalidad** del modelo, y cambiándolo cambias completamente el tono de la respuesta sin tocar nada más.
- Las tres personalidades (profesor, amigo casual, consultor de negocio) están bien diferenciadas y son ejemplos realistas de lo que harías en un producto real.
- Buen uso de `temperature=0.7` y `max_tokens=200` — coherente entre los tres casos para que la comparación sea justa.

### Sugerencias para mejorar
- **Atento a esto:** en la "personalidad 2" tienes un bug que rompe el código → `"content": ""Eres un amigo programador casual..."`. Hay un par de comillas extra al principio (`""`) que hacen que Python no pueda parsear el string. Tal cual está, ese bloque te dará `SyntaxError` y no llegará a ejecutarse. Quita una de las dos comillas iniciales.
- Estás repitiendo `from openai import OpenAI`, `load_dotenv()` y `client = OpenAI()` tres veces. Con hacerlo una sola vez al principio del fichero es suficiente — el `client` ya queda creado y lo reutilizas. Es un detalle, pero te ahorra 9 líneas de ruido.
- Como siguiente paso, prueba a meter las tres personalidades en un diccionario (`personalidades = {"profesor": "...", "casual": "...", "consultor": "..."}`) y un `for` que itere y llame al modelo. Verás mucho más claro el patrón "cambio de system prompt = cambio de personalidad".

### XP: +0 XP (ya recibido al entregar)
