---
status: pendiente
classId: m3-c04
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Chatbot Dual GPT vs Claude"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-06-17T15:49:38.651Z
lastUpdated: 2026-06-17T15:49:38.651Z
xpAwarded: 5
---

# Práctica Guiada: Chatbot Dual GPT vs Claude

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 04 · **Ejercicio:** 2

## Código

```python
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

def ask_claude(question):
    client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system="Eres un experto en tecnología y IA.",
        messages=[{"role": "user", "content": question}]
    )
    return response.content[0].text

# Hacer pregunta
question = "¿Qué es prompt engineering?"
print(f"Pregunta: {question}\n")

print("=" * 60)
print("RESPUESTA DE CLAUDE:")
print("=" * 60)
print(ask_claude(question))
print("\n" + "=" * 60)

# Otro ejemplo
question2 = "Dame 3 diferencias entre machine learning y deep learning."
print(f"\nPregunta 2: {question2}\n")
print("=" * 60)
print("RESPUESTA DE CLAUDE:")
print("=" * 60)
print(ask_claude(question2))
```

## Feedback

_(pendiente de revisión automática)_
