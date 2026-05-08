---
status: pendiente
classId: m3-c02
exerciseNum: 4
type: B
typeName: "Mini-Reto"
title: "El generador de historias"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-05-08T15:54:32.351Z
lastUpdated: 2026-05-08T15:54:32.351Z
xpAwarded: 5
---

# Mini-Reto: El generador de historias

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 02 · **Ejercicio:** 4

## Código

```python
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


def generate_story(genre, length, creativity):
    # Mapea los parámetros
    token_map = {
        "corta": 100,
        "media": 250,
        "larga": 500
    }

    temp_map = {
        "baja": 0.3,
        "media": 0.7,
        "alta": 1.5
    }

    max_tokens = token_map[length]
    temperature = temp_map[creativity]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Eres un escritor de historias cortas. Crea narrativas cautivadoras con personajes vividos."
            },
            {
                "role": "user",
                "content": f"Escribe una historia de {genre} en español. Debe ser una historia completa con inicio, desarrollo y desenlace."
            }
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )

    return response.choices[0].message.content


# Uso:
story = generate_story("ciencia ficción", "media", "alta")
print(story)
```

## Notas de Juan

**Output:**
```
En un futuro no tan lejano, el año 2147, la humanidad había alcanzado un avance tecnológico sin precedentes. Tras décadas de conflictos y caos ecológico, las grandes ciudades se habían adaptado a las nuevas normas del medio ambiente regenerando sus afectos gracias a la tecnología quimiosintética. Así fue como Rafael Elias, un ingeniero de sistemas en ZaraTec, una de las corporaciones más influyentes, se encontró frente a un dilema ético que pondría a prueba sus αρχές pequeñas y su propio lugar en el mundo.

Rafael estaba dedicado, casi obsesionado, con la idea de crear estructuras basadas en pastillas plantadas bajo el suelo que ayudarían a que la naturaleza sane sus mayores heridas. Pero en el fondo sabía que su verdadero objetivo era apaciguar los restos de un pasado en el que también había fracasado. Grandahl era una de sus máximas preceptores —una escritora creada como manifestación de la inteligencia artificial testifica por la Académière. La ofrecían tecnología dirigida a optimizar toda especie de tratanudo particular en ella que ulterior decide sobre comunicaciones ambiling Squares.
```



## Feedback

_(pendiente de revisión automática)_
