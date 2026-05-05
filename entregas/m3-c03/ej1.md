---
status: pendiente
classId: m3-c03
exerciseNum: 1
type: A
typeName: "Práctica Guiada"
title: "Chatbot básico con memoria"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-05T17:58:55.106Z
lastUpdated: 2026-05-05T17:58:55.106Z
xpAwarded: 5
---

# Práctica Guiada: Chatbot básico con memoria

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 03 · **Ejercicio:** 1

## Código

```python
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

# Historial de conversación
conversation = [
    {"role": "system", "content": "Eres un asistente amable y conciso."}
]

def chat(user_message):
    """Envía mensaje y mantiene memoria de conversación."""
    # Agregar mensaje del usuario al historial
    conversation.append({"role": "user", "content": user_message})

    # Enviar TODO el historial
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation
    )

    # Extraer respuesta y guardarla
    assistant_message = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# Loop principal
print("🤖 Chatbot listo. Escribe 'salir' para terminar.\n")
while True:
    user_input = input("Tú: ")
    if user_input.lower() == 'salir':
        break
    response = chat(user_input)
    print(f"\n🤖 Bot: {response}\n")
```

## Feedback

_(pendiente de revisión automática)_
