---
status: aprobado
classId: m2-c04
exerciseNum: 1
type: B
typeName: "Mini-Reto"
title: "Mini-reto: Ollama Challenge — Duelo de Modelos"
module: 2
moduleName: "Fundamentos de IA y LLMs"
submittedAt: 2026-06-17T12:20:22.373Z
lastUpdated: 2026-06-18T18:08:44.000Z
xpAwarded: 5
---

# Mini-Reto: Mini-reto: Ollama Challenge — Duelo de Modelos

**Módulo:** 2 — Fundamentos de IA y LLMs · **Clase:** 04 · **Ejercicio:** 1

## Código

```python
MODELO 1: gemma2:2b

Tamaño: 2B parámetros
Tiempo respuesta: 20,98 segundos
RAM usado: 1.9 GB
Procesador usado: 100% GPU
Calidad respuesta (1-5): 3
Errores encontrados: 0

MODELO 2: mistral:7b

Tamaño: 7B parámetros
Tiempo respuesta: 105,61 segundos
RAM usado: 5.1 GB
Procesador usado: 54% CPU / 46% GPU
Calidad respuesta (1-5): 4
Errores encontrados: 0

CONCLUSIÓN:
En esta prueba, gemma2:2b fue mucho más rápido y consumió bastante menos memoria que mistral:7b. Su tiempo de respuesta fue de 20,98 segundos frente a los 105,61 segundos de mistral:7b. Además, gemma2:2b usó 1.9 GB de memoria, mientras que mistral:7b usó 5.1 GB.

Sin embargo, mistral:7b es un modelo más grande, por lo que normalmente debería ofrecer respuestas más completas y con mejor razonamiento en tareas complejas como diseñar una base de datos con tablas, claves primarias, claves foráneas y relaciones.

Para producción, elegiría gemma2:2b si la prioridad es velocidad, bajo consumo de RAM y ejecución eficiente en GPU. En cambio, elegiría mistral:7b si la prioridad es obtener una respuesta de mayor calidad técnica, aunque consuma más recursos y tarde más tiempo.

El trade-off observado es claro: el modelo pequeño es más rápido y ligero, pero puede ser menos detallado; el modelo grande consume más memoria y tarda más, pero probablemente ofrece una respuesta más completa y precisa.
```

## Feedback

✅ **Aprobado.** Muy bien: mediste métricas reales (tiempo, RAM, GPU/CPU) y razonaste el trade-off velocidad/consumo vs calidad, cerrando con qué elegirías en producción. Ese criterio es justo lo que busca el módulo.

Para la próxima:
- La "calidad (1-5)" es subjetiva: usa el **mismo prompt** en ambos modelos y pega un extracto de cada respuesta que justifique el 3 vs el 4.
- Dato a entender: mistral tardó 105 s con 54% CPU / 46% GPU → no cupo entero en la GPU, por eso fue lento. No es que el modelo sea "lento", es que faltó VRAM.

— Revisado por Cristina · 18-jun-2026
