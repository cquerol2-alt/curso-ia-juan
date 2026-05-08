---
status: pendiente
classId: m3-c02
exerciseNum: 3
type: A
typeName: "Práctica Guiada"
title: "JSON mode"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-08T15:46:29.351Z
lastUpdated: 2026-05-08T15:46:29.351Z
xpAwarded: 5
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

_(pendiente de revisión automática)_
