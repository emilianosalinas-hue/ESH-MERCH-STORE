# ESH MERCH STORE

**Tienda oficial del proyecto musical ESH**

Sitio web desarrollado como parte del proyecto académico *El futuro de la industria musical*. Integra una tienda de merchandising, conexión con Spotify y un asistente de inteligencia artificial.

## 1. Enlaces del proyecto

- **Tienda publicada:** https://emilianosalinas-hue.github.io/ESH-MERCH-STORE/
- **Repositorio de GitHub:** https://github.com/emilianosalinas-hue/ESH-MERCH-STORE

## 2. Descripción general

ESH MERCH STORE es una plataforma digital creada para complementar la identidad artística y comercial del proyecto musical independiente ESH.

La propuesta combina una experiencia de compra de merchandising con herramientas interactivas que permiten al visitante conocer la música, explorar la identidad del artista y consultar información mediante inteligencia artificial.

## 3. Tecnologías utilizadas

- HTML5: estructura del sitio.
- CSS3: diseño visual y adaptación a dispositivos.
- JavaScript: interactividad y funcionamiento de los componentes.
- Git y GitHub: control de versiones y almacenamiento del proyecto.
- GitHub Pages: publicación del sitio web.

## 4. Funcionalidades principales

### Tienda de merchandising

- Catálogo de productos.
- Visualización de productos.
- Carrito de compras.
- Cálculo de subtotal.
- Preparación de pedidos mediante WhatsApp.

### ESH RADIO — Spotify

Integración con la API de Spotify para conectar la cuenta del usuario y consultar información musical del proyecto ESH.

Incluye:
- Autenticación mediante Spotify.
- Consulta del perfil artístico.
- Consulta de lanzamientos y discografía.
- Reproducción mediante Spotify Embed.

La autenticación utiliza OAuth con PKCE.

### ESH AI — Groq

Asistente de inteligencia artificial integrado mediante la API de Groq.

Sus funciones incluyen:
- Responder preguntas sobre el proyecto ESH.
- Explicar su propuesta musical.
- Comunicar aspectos de su identidad visual.
- Orientar a los visitantes dentro de la tienda.

La integración utiliza un campo de entrada de API Key de tipo contraseña, un indicador de carga y un área de respuesta.

**Modelo utilizado:** `openai/gpt-oss-20b`

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

La clave se mantiene en memoria durante la sesión del navegador y no se almacena en localStorage ni sessionStorage.

> Nota de seguridad: esta integración está pensada como demostración académica. Al realizar solicitudes directamente desde el navegador, la clave puede quedar expuesta a través de las herramientas de inspección de red. Para una implementación comercial se recomienda utilizar un backend intermediario.

## 5. Estructura del proyecto

```text
ESH-MERCH-STORE/
│
├── index.html
│
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── spotify.css
│   └── ai.css
│
├── js/
│   ├── data.js
│   ├── cart.js
│   ├── app.js
│   ├── spotify-auth.js
│   ├── spotify-api.js
│   ├── spotify-ui.js
│   └── ai.js
│
├── assets/
├── logo/
├── skills/
│   └── SKILL.md
│
├── .gitignore
└── README.md
```

## 6. Skill personalizada

El proyecto incluye una Skill personalizada en:

`skills/SKILL.md`

Su propósito es proporcionar instrucciones y contexto especializado relacionados con el proyecto musical ESH, su identidad artística y las funcionalidades de la tienda.

## 7. Integración con herramientas MCP

Durante el desarrollo se exploró la configuración de GitHub MCP en Antigravity para facilitar la interacción con el repositorio.

La configuración se mantuvo en archivos locales excluidos del repositorio mediante `.gitignore`, con el objetivo de evitar publicar credenciales.

**Estado final de la integración MCP:**

Se exploró la configuración de GitHub MCP en Antigravity para facilitar la interacción con el repositorio. Sin embargo, el administrador de MCP permaneció en estado de carga («Loading MCP servers...») y no fue posible confirmar una conexión funcional. Por este motivo, MCP no se considera una funcionalidad completada del proyecto.

## 8. Instalación y ejecución local

1. Descargar o clonar el repositorio.
2. Abrir la carpeta `ESH-MERCH-STORE` en un editor de código.
3. Ejecutar el archivo `index.html` mediante una extensión como Live Server.
4. Para utilizar ESH RADIO, configurar las credenciales y la URI de redirección de Spotify.
5. Para utilizar ESH AI, introducir una API Key válida de Groq en la interfaz.

No es necesario instalar dependencias de Node.js para ejecutar la tienda.

## 9. Publicación

El sitio está publicado mediante GitHub Pages y utiliza la rama `main` del repositorio.

Cada actualización publicada en esa rama puede desplegarse mediante el sistema de publicación de GitHub Pages.

## 10. Objetivo del proyecto

Demostrar cómo una plataforma web puede integrar herramientas de comercio electrónico, servicios musicales e inteligencia artificial para ampliar la presencia digital de un artista independiente.

El proyecto busca conectar la identidad musical de ESH con nuevas posibilidades de interacción, comunicación y comercialización.