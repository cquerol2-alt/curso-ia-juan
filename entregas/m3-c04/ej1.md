---
status: pendiente
classId: m3-c04
exerciseNum: 1
type: A
typeName: "Práctica Guiada"
title: "Primera llamada con Claude API"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-06-17T15:49:20.698Z
lastUpdated: 2026-06-17T15:49:20.698Z
xpAwarded: 5
---

# Práctica Guiada: Primera llamada con Claude API

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 04 · **Ejercicio:** 1

## Código

```python
import anthropic
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Inicializar cliente
client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# Primera llamada a Claude
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="Eres un asistente muy útil y educado.",
    messages=[
        {
            "role": "user",
            "content": "¿Cuál es la capital de España y por qué es importante?"
        }
    ]
)

# Imprimir respuesta
print("Respuesta de Claude:")
print(response.content[0].text)
print(f"\nTokens usados: {response.usage.input_tokens} entrada, {response.usage.output_tokens} salida")
```

## Feedback

_(pendiente de revisión automática)_
