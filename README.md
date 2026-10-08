# Escuela Superior de Inteligencia Artificial del Paraguay

Plataforma de cursos en vídeo (sitio estático: HTML, CSS y JavaScript, sin dependencias).

## Ejecutar en local

Doble clic en `iniciar.command`, o:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# abrir http://127.0.0.1:8765
```

Los vídeos de YouTube no se reproducen abriendo los archivos directamente (`file://`); hace falta servirlos por HTTP.

## Contenido

Los cursos, módulos y vídeos se editan en `js/data.js`.

## Acceso

La portada pide una contraseña (`js/auth.js`). Es una barrera de acceso básica del lado del cliente, no seguridad real.
