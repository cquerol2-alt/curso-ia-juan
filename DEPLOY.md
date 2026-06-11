# Cómo subir cambios a GitHub Pages

## Datos del repo

| Campo | Valor |
|-------|-------|
| Cuenta GitHub | `cquerol2-alt` |
| Repo | `cquerol2-alt/curso-ia-juan` |
| URL del repo | https://github.com/cquerol2-alt/curso-ia-juan |
| GitHub Pages | https://cquerol2-alt.github.io/curso-ia-juan/ |
| Token | Guardado en `.claude/secrets/github-pat.txt` |
| Rama | `main` |
| Pages sirve desde | raíz `/` de `main` |

## Pasos para subir cambios (copiar y pegar)

Desde el directorio del curso (`curso-ia-juan/`):

```bash
# 1. Si no hay repo git inicializado (primera vez o sesión nueva):
git init -b main
git config user.email "cquerol2@gmail.com"
git config user.name "Cristina Querol"
git remote add origin https://cquerol2-alt:TOKEN@github.com/cquerol2-alt/curso-ia-juan.git

# 2. Añadir cambios y hacer commit:
git add -A
git commit -m "Descripción del cambio"

# 3. Push:
git push -u origin main
```

Si el repo ya tiene `.git` configurado de una sesión anterior, solo hace falta los pasos 2 y 3.

## Si hay problemas con .git corrupto

A veces el directorio `.git` se corrompe entre sesiones. Solución rápida:

```bash
# Copiar archivos a un directorio limpio temporal
mkdir -p /sessions/SESION/curso-deploy
cp -r curso-ia-juan/* curso-ia-juan/.gitignore /sessions/SESION/curso-deploy/
cd /sessions/SESION/curso-deploy

# Inicializar git limpio, commit y push
git init -b main
git config user.email "cquerol2@gmail.com"
git config user.name "Cristina Querol"
git remote add origin https://cquerol2-alt:TOKEN@github.com/cquerol2-alt/curso-ia-juan.git
git add -A
git commit -m "Descripción"
git push --force origin main
```

## Verificar que GitHub Pages se actualizó

```bash
# Comprobar estado del deploy (tarda 1-2 min):
curl -s -H "Authorization: token TOKEN" \
  https://api.github.com/repos/cquerol2-alt/curso-ia-juan/pages | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('Estado:', d.get('status'), '| URL:', d.get('html_url'))"
```

## Estructura de archivos

```
curso-ia-juan/
├── index.html                  ← Dashboard principal
├── css/style.css               ← Estilos
├── js/progress.js              ← Sistema XP, badges (actualizar al añadir módulos)
├── modulo-01-python/           ← Módulo 1 (completado)
│   ├── index.html
│   ├── clase-01.html ... clase-10-boss-battle.html
├── modulo-02-fundamentos/      ← Pendiente de crear
├── ...
├── modulo-09-empleo/           ← Pendiente de crear
├── DEPLOY.md                   ← Este archivo
└── README.md
```

## Checklist al añadir un módulo nuevo

1. Crear carpeta `modulo-XX-nombre/` con `index.html` y `clase-XX.html`
2. Actualizar `index.html` (dashboard): cambiar el módulo de `module-locked` a `module-available`, añadir `<a href="modulo-XX-nombre/">`
3. Actualizar `js/progress.js` si hay nuevos badges
4. Commit + push
5. Esperar 1-2 min y verificar en https://cquerol2-alt.github.io/curso-ia-juan/
