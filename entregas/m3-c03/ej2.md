---
status: aprobado
classId: m3-c03
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Añadir streaming"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-06-17T12:31:27.547Z
lastUpdated: 2026-06-18T18:08:44.000Z
xpAwarded: 5
---

# Práctica Guiada: Añadir streaming

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 03 · **Ejercicio:** 2

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

def chat_streaming(user_message):
    """Chat con streaming de respuesta."""
    conversation.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation,
        stream=True  # ← Activa streaming
    )

    assistant_message = ""
    print("\n🤖 Bot: ", end="", flush=True)

    # Iterar sobre chunks y imprimir conforme llegan
    for chunk in response:
        if chunk.choices[0].delta.content:
            text = chunk.choices[0].delta.content
            print(text, end="", flush=True)
            assistant_message += text

    print("\n")
    conversation.append({"role": "assistant", "content": assistant_message})
    return assistant_message
# Loop principal
print("🤖 Chatbot listo. Escribe 'salir' para terminar.\n")
while True:
    user_input = input("Tú: ")
    if user_input.lower() == 'salir':
        break
    response = chat_streaming(user_input)
    print(f"\n🤖 Bot: {response}\n")
```

## Feedback

✅ **Aprobado.** El streaming está bien: `stream=True`, iteras los chunks, acumulas la respuesta y la guardas en el historial (mantienes memoria). Correcto.

Un detalle a corregir: en el bucle principal imprimes la respuesta **dos veces**. `chat_streaming()` ya hace el print en streaming y luego repites el print de la respuesta. Déjalo así:

```python
while True:
    user_input = input("Tú: ")
    if user_input.lower() == 'salir':
        break
    chat_streaming(user_input)   # ya imprime; no repitas el print
```

(La función `chat()` sin streaming ya no la usas aquí, puedes borrarla.)

— Revisado por Cristina · 18-jun-2026
