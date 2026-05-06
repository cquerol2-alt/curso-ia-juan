---
status: aprobado
classId: m3-c03
exerciseNum: 1
type: A
typeName: "Práctica Guiada"
title: "Chatbot básico con memoria"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-05T17:58:55.106Z
lastUpdated: 2026-05-06T16:12:11.000Z
xpAwarded: 0
reviewedAt: 2026-05-06T16:12:11.000Z
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

**Resultado: ✅ APROBADO** — *revisado el 06/05/2026 18:12 (revisión automática)*

### Lo que está bien
- Has entendido la idea clave del ejercicio: la "memoria" del chatbot es simplemente **enviar todo el historial en cada llamada**. Tu lista `conversation` lo refleja bien y va creciendo turno a turno.
- Buen uso del **`system` message** para fijar el tono del bot desde el principio. Es el patrón correcto.
- La función `chat()` está bien encapsulada: añade el mensaje, llama al modelo, guarda la respuesta del assistant y la devuelve. Limpio.

### Sugerencias para mejorar
- A medida que la conversación se alarga, vas a empezar a gastar muchos tokens (y dinero) porque mandas todo el historial cada vez. Cuando lleguemos al tema de **ventana de contexto**, verás técnicas como recortar los últimos N turnos o resumir lo viejo.
- Detalle pequeño: `conversation` es una variable global. Para un script de una sola conversación está bien, pero si en el futuro quisieras varias sesiones a la vez, conviene moverla dentro de una clase o pasarla como argumento.

### XP: +0 XP (ya recibido al entregar)
