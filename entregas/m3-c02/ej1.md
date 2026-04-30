---
status: aprobado
classId: m3-c02
exerciseNum: 1
type: B
typeName: "Mini-Reto"
title: "Laboratorio de temperature"
module: 3
moduleName: "APIs de IA — Tu Primer Chatbot"
submittedAt: 2026-04-30T16:19:52.577Z
lastUpdated: 2026-04-30T18:11:02.000Z
xpAwarded: 5
reviewedAt: 2026-04-30T18:11:02.000Z
---

# Mini-Reto: Laboratorio de temperature

**Módulo:** 3 — APIs de IA — Tu Primer Chatbot · **Clase:** 02 · **Ejercicio:** 1

## Código

```python
#Temperature = 0

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Escribe un párrafo sobre la belleza del atardecer"
        }
    ],
    temperature=0,
    max_tokens=200
)
print(response.choices[0].message.content)

#Temperature = 0.7

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Escribe un párrafo sobre la belleza del atardecer"
        }
    ],
    temperature=0.7,
    max_tokens=200
)
print(response.choices[0].message.content)

#Temperature = 1.5

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Escribe un párrafo sobre la belleza del atardecer"
        }
    ],
    temperature=1.5,
    max_tokens=200
)
print(response.choices[0].message.content)
```

## Notas de Juan

**Output:**
```
# Temperature = 0

El atardecer es un espectáculo natural que transforma el cielo en un lienzo vibrante, donde los tonos cálidos del naranja, rosa y púrpura se entrelazan en una danza de luz y color. A medida que el sol se oculta en el horizonte, la atmósfera se llena de una calma serena, invitando a la reflexión y al asombro. Las sombras se alargan y el mundo parece detenerse por un momento, permitiendo que la belleza efímera de este instante se grabe en la memoria. Cada atardecer es único, un recordatorio de la maravilla de la naturaleza y de la promesa de un nuevo día que se avecina.

Respuesta mas generica sin creatividad es concreta

#Temperature = 0.7

El atardecer es un espectáculo natural que envuelve el cielo en un manto de colores cálidos y vibrantes, donde el naranja, el rosa y el dorado se entrelazan en una danza efímera. A medida que el sol se oculta en el horizonte, la luz se vuelve suave y envolvente, creando una atmósfera de calma y reflexión. Las sombras se alargan y los contornos del paisaje se suavizan, invitando a la contemplación y al asombro. Este mágico momento del día no solo marca el final de la jornada, sino que también nos recuerda la belleza de los ciclos de la vida, instándonos a apreciar cada instante y a encontrar serenidad en la transición.

La respuesta es un poco parecida a la 0 temperatura pero cambia ligeramente las palabra y es un poco mas poetico.

#Temperature = 1.5

El atardecer es un espectáculo natural que transforma el cielo en un lienzo vibrante, donde tonos cálidos de naranjas, rosas y rojos se entrelazan en un baile sublime. A medida que el sol desciende hacia el horizonte, el universo parece respirar profundamente, invitándonos a pausar y contemplar. Las sombras se alargan, y los sonidos del día empiezan a apagarse, ofreciendo una sensación de calma y reflexión. Este momento efímero, en el que la luz dorada se despide, nos recuerda la obra maestra de cada ciclo y la constante belleza que nos rodea, si tan solo nos tomamos el tiempo de apreciarlo.
```



## Feedback

**Resultado: ✅ APROBADO** — *revisado el 30/04/2026 20:11 (revisión automática)*

### Lo que está bien
- Has probado las **tres temperaturas pedidas (0, 0.7, 1.5)** con el mismo prompt — eso es justo lo que pide el reto y permite comparar bien.
- Usas `load_dotenv()` para cargar la API key desde un `.env` en lugar de hardcodearla en el código. Buen hábito de seguridad desde el principio.
- Has fijado `max_tokens=200` para acotar la respuesta. Útil para no quemar tokens innecesariamente cuando solo quieres comparar estilos.
- Has incluido tu observación de cada salida — eso es lo que diferencia un experimento de "ejecutar código y ya está".

### Sugerencias para mejorar
- **DRY (Don't Repeat Yourself):** estás copiando el mismo bloque tres veces cambiando solo `temperature`. Sería más elegante una función:
  ```python
  def generar(prompt, temp):
      return client.chat.completions.create(
          model="gpt-4o-mini",
          messages=[{"role": "user", "content": prompt}],
          temperature=temp,
          max_tokens=200,
      ).choices[0].message.content

  for t in [0, 0.7, 1.5]:
      print(f"--- temp={t} ---")
      print(generar("Escribe un párrafo sobre la belleza del atardecer", t))
  ```
- **Análisis más fino:** entre `temp=0` y `temp=0.7` los textos son muy parecidos porque el prompt es bastante "literario" y el modelo ya tiende a esa salida. La diferencia se nota mucho más con prompts ambiguos o creativos. Prueba el mismo experimento con un prompt como *"Inventa el nombre de un planeta y descríbelo en una frase"* — verás cómo `1.5` se vuelve realmente impredecible.
- Detalle pequeño: `load_dotenv()` y `client = OpenAI()` solo hacen falta una vez por script.

### XP: +5 XP (aprobado)
