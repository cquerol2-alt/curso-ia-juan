---
status: revisado
classId: m3-c04
exerciseNum: 2
type: A
typeName: "Práctica Guiada"
title: "Chatbot Dual GPT vs Claude"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-06-17T15:49:38.651Z
lastUpdated: 2026-06-18T18:08:44.000Z
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

🔧 **A revisar — incompleto.** La parte de Claude está bien, pero el ejercicio es **dual (GPT vs Claude)** y solo llamas a Claude. Falta la función que pregunta a GPT y la comparación lado a lado. Complétalo y vuelve a entregarlo:

```python
from openai import OpenAI
import anthropic, os
from dotenv import load_dotenv
load_dotenv()
openai_client = OpenAI()
claude_client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

def ask_gpt(q):
    r = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"system","content":"Eres experto en IA."},
                  {"role":"user","content":q}])
    return r.choices[0].message.content

def ask_claude(q):
    r = claude_client.messages.create(model="claude-sonnet-4-6", max_tokens=512,
        system="Eres experto en IA.", messages=[{"role":"user","content":q}])
    return r.content[0].text

q = "¿Qué es prompt engineering?"
print("-- GPT --\n", ask_gpt(q))
print("\n-- CLAUDE --\n", ask_claude(q))
```

Detalle: crea cada cliente **una sola vez** fuera de la función, no en cada llamada.

— Revisado por Cristina · 18-jun-2026
