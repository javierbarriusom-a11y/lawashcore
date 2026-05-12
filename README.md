# La Wash Core

Presentacion interactiva La Wash Core para posibles franquiciados.

## Estructura

```text
lawash/
├─ index.html          # Estructura base, nav superior y carga de scripts
├─ assets/             # Imagenes, SVGs y recursos visuales
├─ data/slides.js      # Contenido editable de la presentacion
├─ scripts/deck.js     # Motor de render, navegacion y layouts
└─ styles/theme.css    # Sistema visual, tipografia, colores y componentes
```

## Probar en local

Desde la raiz del repo:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre:

```text
http://localhost:8000/
```

## Como editar slides

Cada objeto en `data/slides.js` representa una slide:

```js
{
  eyebrow: "01 · Contexto",
  title: "Titulo principal",
  subtitle: "Texto de apoyo despues del titulo.",
  layout: "cards",
  cols: 3,
  items: [
    ["Titulo caja", "Texto de la caja."],
    ["Otro titulo", "Otro texto."]
  ]
}
```

Layouts disponibles en la plantilla:

- `cover`
- `agenda`
- `chapter`
- `cards`
- `channel-groups`
- `journey`
- `phone`
- `ideas`
- `poster`
- `timeline`
- `matrix`
- `dashboard`
- `bars`
- `roadmap`
- `closing`

## Temas por slide

Puedes anadir `theme` a una slide:

```js
{
  theme: "dark",
  title: "Titulo",
  layout: "chapter"
}
```

Temas base disponibles:

- `dark`
- `red`
- `blue`
- `ice`
- `lemon`

## Publicar en GitHub Pages

Configura GitHub Pages para publicar desde la rama `main`, carpeta `/`.

URL esperada:

```text
https://javierbarriusom-a11y.github.io/lawashcore/
https://javierbarriusom-a11y.github.io/lawashcore/go/
https://javierbarriusom-a11y.github.io/lawashcore/go_final/
```
