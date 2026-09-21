# Flores amarillas para Nao 💛

Página estática romántica para GitHub Pages.

## Estructura

- `index.html` — página principal.
- `css/style.css` — diseño responsive.
- `js/bouquet.js` — ramo pixel-art generado con Canvas + JavaScript.
- `js/carousel.js` — carrusel automático y táctil.
- `js/main.js` — navegación suave.
- `assets/flores/` — 10 fotografías.
- `assets/video/recuerdo.mp4` — video.

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube **todo el contenido de esta carpeta**, no la carpeta contenedora.
3. En GitHub entra a `Settings` → `Pages`.
4. En "Build and deployment" selecciona `Deploy from a branch`.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub Pages publique el sitio.

La página no necesita PHP, Node ni base de datos: funciona como sitio estático.

## Agregar más flores

En `js/carousel.js`, agrega nuevas rutas al arreglo `images`:

```js
"assets/flores/flor11.jpg",
"assets/flores/flor12.jpg",
```

y coloca las imágenes correspondientes en `assets/flores/`.

## Nota

El ramo animado no es un GIF ni un video: se dibuja en tiempo real con Canvas y JavaScript, empezando desde abajo y formando el ramo progresivamente.
