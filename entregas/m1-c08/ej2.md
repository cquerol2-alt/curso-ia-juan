---
status: aprobado
classId: m1-c08
exerciseNum: 2
type: B
typeName: "Mini-Reto"
title: "Top 10 Repos de GitHub scraper"
module: 1
moduleName: "Python para Devs Web"
submittedAt: 2026-05-20T12:19:59.390Z
lastUpdated: 2026-05-20T12:19:59.390Z
xpAwarded: 5
reviewedAt: "2026-05-21T18:00:00.000Z"
---

# Mini-Reto: Top 10 Repos de GitHub scraper

**Módulo:** 1 — Python para Devs Web · **Clase:** 08 · **Ejercicio:** 2

## Código

```python
import argparse
import json
import requests
from bs4 import BeautifulSoup


BASE_URL = "https://github.com/trending"


def limpiar_numero(texto):
    """
    Convierte textos como '7,505' o '1,850 stars today' en enteros.
    """
    if not texto:
        return 0

    texto = texto.strip()
    texto = texto.replace(",", "")
    numero = ""

    for char in texto:
        if char.isdigit():
            numero += char
        elif numero:
            break

    return int(numero) if numero else 0


def obtener_repos(lang=None, limit=10):
    """
    Extrae repositorios de GitHub Trending.

    lang:
        None -> trending general
        'python' -> trending de Python
        'javascript' -> trending de JavaScript
    """

    if lang:
        url = f"{BASE_URL}/{lang}"
    else:
        url = BASE_URL

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    articulos = soup.find_all("article", class_="Box-row")

    repos = []

    for article in articulos[:limit]:
        # Nombre y enlace
        h2 = article.find("h2")
        enlace = h2.find("a") if h2 else None

        if not enlace:
            continue

        repo_path = enlace.get("href", "").strip("/")
        repo_nombre = repo_path.replace("/", " / ")
        repo_url = "https://github.com/" + repo_path

        # Descripción
        descripcion_tag = article.find("p", class_="col-9")
        descripcion = descripcion_tag.get_text(strip=True) if descripcion_tag else ""

        # Lenguaje
        lenguaje_tag = article.find("span", itemprop="programmingLanguage")
        lenguaje = lenguaje_tag.get_text(strip=True) if lenguaje_tag else "No especificado"

        # Estrellas totales
        estrellas_totales = 0
        stargazers_link = article.find("a", href=f"/{repo_path}/stargazers")
        if stargazers_link:
            estrellas_totales = limpiar_numero(stargazers_link.get_text())

        # Estrellas hoy
        estrellas_hoy = 0
        stars_today_tag = article.find("span", class_="d-inline-block")
        if stars_today_tag and "stars today" in stars_today_tag.get_text():
            estrellas_hoy = limpiar_numero(stars_today_tag.get_text())

        repo = {
            "nombre": repo_nombre,
            "url": repo_url,
            "descripcion": descripcion,
            "lenguaje": lenguaje,
            "estrellas_hoy": estrellas_hoy,
            "estrellas_totales": estrellas_totales
        }

        repos.append(repo)

    return repos


def guardar_json(repos, archivo="top_repos.json"):
    with open(archivo, "w", encoding="utf-8") as f:
        json.dump(repos, f, indent=4, ensure_ascii=False)


def guardar_html(repos, archivo="top_repos.html"):
    filas = ""

    for repo in repos:
        filas += f"""
        <tr>
            <td><a href="{repo['url']}" target="_blank">{repo['nombre']}</a></td>
            <td>{repo['descripcion']}</td>
            <td>{repo['lenguaje']}</td>
            <td>{repo['estrellas_hoy']}</td>
            <td>{repo['estrellas_totales']}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Top Repos GitHub Trending</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 40px;
            }}

            table {{
                width: 100%;
                border-collapse: collapse;
            }}

            th, td {{
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }}

            th {{
                background-color: #f4f4f4;
            }}

            tr:nth-child(even) {{
                background-color: #fafafa;
            }}
        </style>
    </head>
    <body>
        <h1>Top repositorios de GitHub Trending</h1>

        <table>
            <thead>
                <tr>
                    <th>Repositorio</th>
                    <th>Descripción</th>
                    <th>Lenguaje</th>
                    <th>Estrellas hoy</th>
                    <th>Estrellas totales</th>
                </tr>
            </thead>
            <tbody>
                {filas}
            </tbody>
        </table>
    </body>
    </html>
    """

    with open(archivo, "w", encoding="utf-8") as f:
        f.write(html)


def main():
    parser = argparse.ArgumentParser(
        description="Scraper de GitHub Trending"
    )

    parser.add_argument(
        "--lang",
        type=str,
        default=None,
        help="Lenguaje de programación, por ejemplo: python, javascript, go"
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=10,
        help="Número de repositorios a extraer"
    )

    parser.add_argument(
        "--html",
        action="store_true",
        help="Genera también una tabla HTML"
    )

    args = parser.parse_args()

    repos = obtener_repos(lang=args.lang, limit=args.limit)

    guardar_json(repos, "top_repos.json")

    if args.html:
        guardar_html(repos, "top_repos.html")

    print(f"Se han guardado {len(repos)} repositorios en top_repos.json")

    if args.html:
        print("También se ha creado top_repos.html")


if __name__ == "__main__":
    main()
```

## Notas de Juan

**Output:**
```
[
    {
        "nombre": "colbymchenry / codegraph",
        "url": "https://github.com/colbymchenry/codegraph",
        "descripcion": "Pre-indexed code knowledge graph for Claude Code, Codex, Cursor, and OpenCode — fewer tokens, fewer tool calls, 100% local",
        "lenguaje": "TypeScript",
        "estrellas_hoy": 0,
        "estrellas_totales": 7648
    },
    {
        "nombre": "Imbad0202 / academic-research-skills",
        "url": "https://github.com/Imbad0202/academic-research-skills",
        "descripcion": "Academic Research Skills for Claude Code: research → write → review → revise → finalize",
        "lenguaje": "Python",
        "estrellas_hoy": 0,
        "estrellas_totales": 15101
    },
    {
        "nombre": "tinyhumansai / openhuman",
        "url": "https://github.com/tinyhumansai/openhuman",
        "descripcion": "Your Personal AI super intelligence. Private, Simple and extremely powerful.",
        "lenguaje": "Rust",
        "estrellas_hoy": 0,
        "estrellas_totales": 23011
    },
    {
        "nombre": "multica-ai / andrej-karpathy-skills",
        "url": "https://github.com/multica-ai/andrej-karpathy-skills",
        "descripcion": "A single CLAUDE.md file to improve Claude Code behavior, derived from Andrej Karpathy's observations on LLM coding pitfalls.",
        "lenguaje": "No especificado",
        "estrellas_hoy": 0,
        "estrellas_totales": 139678
    },
    {
        "nombre": "rohitg00 / ai-engineering-from-scratch",
        "url": "https://github.com/rohitg00/ai-engineering-from-scratch",
        "descripcion": "Learn it. Build it. Ship it for others.",
        "lenguaje": "Python",
        "estrellas_hoy": 0,
        "estrellas_totales": 8966
    },
    {
        "nombre": "HKUDS / CLI-Anything",
        "url": "https://github.com/HKUDS/CLI-Anything",
        "descripcion": "\"CLI-Anything: Making ALL Software Agent-Native\" -- CLI-Hub:https://clianything.cc/",
        "lenguaje": "Python",
        "estrellas_hoy": 0,
        "estrellas_totales": 38216
    },
    {
        "nombre": "can1357 / oh-my-pi",
        "url": "https://github.com/can1357/oh-my-pi",
        "descripcion": "⌥ AI Coding agent for the terminal — hash-anchored edits, optimized tool harness, LSP, Python, browser, subagents, and more",
        "lenguaje": "TypeScript",
        "estrellas_hoy": 0,
        "estrellas_totales": 5187
    },
    {
        "nombre": "obra / superpowers",
        "url": "https://github.com/obra/superpowers",
        "descripcion": "An agentic skills framework & software development methodology that works.",
        "lenguaje": "Shell",
        "estrellas_hoy": 0,
        "estrellas_totales": 199448
    },
    {
        "nombre": "anthropics / claude-plugins-official",
        "url": "https://github.com/anthropics/claude-plugins-official",
        "descripcion": "Official, Anthropic-managed directory of high quality Claude Code Plugins.",
        "lenguaje": "Python",
        "estrellas_hoy": 0,
        "estrellas_totales": 20514
    },
    {
        "nombre": "msitarzewski / agency-agents",
        "url": "https://github.com/msitarzewski/agency-agents",
        "descripcion": "A complete AI agency at your fingertips - From frontend wizards to Reddit community ninjas, from whimsy injectors to reality checkers. Each agent is a specialized expert with personality, processes, and proven deliverables.",
        "lenguaje": "Shell",
        "estrellas_hoy": 0,
        "estrellas_totales": 102340
    }
]
```

## Feedback

**Resultado: ✅ APROBADO** — *revisado el 21/05/2026 18:00 (revisión automática)*

### Lo que está bien
- Has separado el scraping en funciones pequeñas (`obtener_repos`, `guardar_json`, `guardar_html`, `limpiar_numero`) en vez de meterlo todo en un solo bloque. Eso es exactamente lo que un mini-reto de scraping pide.
- `limpiar_numero` está bien pensada: lee dígitos uno a uno y se detiene en el primer separador. Maneja casos como "1,850 stars today" sin romperse.
- Usas `argparse` con `--lang`, `--limit` y `--html`. La interfaz CLI es limpia y la salida JSON está bien indentada y con `ensure_ascii=False` para que respete acentos.
- `response.raise_for_status()` y `timeout=10` están bien puestos: no te quedas colgado y notas si GitHub devuelve 4xx/5xx.

### Sugerencias para mejorar
- `estrellas_hoy` te ha salido 0 en los 10 resultados. El selector `span.d-inline-block` con texto "stars today" se rompe si GitHub cambia mínimamente el HTML (ahora hay días que no marca "stars today" si el repo no tiene tendencia diaria). Para la próxima, prueba a localizar el `<span>` por la clase `float-sm-right` o filtra cualquier `<span>` cuyo texto contenga "stars today" — más tolerante.
- El `User-Agent: Mozilla/5.0` es muy genérico. Mejor algo como `"top10-scraper/1.0 (juan querol — curso ia)"`. Es buena costumbre identificarte cuando scrapeas.

### XP: +5 XP (aprobado)
