---
status: pendiente
classId: m3-c02
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "System prompt designer"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-08T15:44:57.465Z
lastUpdated: 2026-05-08T15:44:57.465Z
xpAwarded: 5
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

_(pendiente de revisión automática)_
