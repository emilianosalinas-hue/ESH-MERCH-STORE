---
name: ESH-MERCH-STORE
description: Tienda oficial y catálogo editorial de merchandising del proyecto musical ESH
colors:
  dark-canvas: "#0a0a0a"
  dark-surface: "#141414"
  dark-border: "#242424"
  light-canvas: "#f8f8f6"
  light-surface: "#ffffff"
  light-border: "#e5e5e0"
  accent-crimson: "#d6001c"
  accent-crimson-hover: "#b80018"
  text-light: "#f5f5f5"
  text-muted-light: "#8e8e93"
  text-dark: "#0d0d0d"
  text-muted-dark: "#666666"
typography:
  display:
    fontFamily: "'Syne', sans-serif"
    weights: [700, 800]
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Space Grotesk', sans-serif"
    weights: [400, 500, 600]
    letterSpacing: "0.01em"
  mono-labels:
    fontFamily: "'Space Grotesk', sans-serif"
    weights: [600]
    letterSpacing: "0.12em"
    textTransform: "uppercase"
rounded:
  none: "0px"
  sharp: "2px"
  subtle: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  xxl: "96px"
components:
  button-primary-dark:
    backgroundColor: "{colors.text-light}"
    textColor: "{colors.dark-canvas}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-primary-crimson:
    backgroundColor: "{colors.accent-crimson}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "16px 32px"
---

# Design System: ESH OFFICIAL MERCH STORE

## Overview
ESH Official Merch Store es una plataforma de e-commerce editorial y streetwear de alta costura musical para el proyecto independiente **ESH**. 
El diseño está cimentado en la **dualidad intrínseca entre la inocencia y la oscuridad**, expresada tanto en los elementos iconográficos (el querubín con máscara, palomas blancas y murciélagos) como en la estructura arquitectónica de la página, la cual alterna drásticamente entre lienzos negros y blancos a lo largo del scroll.

La experiencia prioriza la fotografía de prendas a gran escala, la precisión tipográfica, el espacio negativo generoso y un flujo de compra fluido y tangible con confirmación de pedido directa vía WhatsApp.

---

## 1. Ritmo de Dualidad (Secciones Alternadas)
Para que la dualidad no sea un simple detalle decorativo, la página se estructura en un ritmo deliberado de contraste entre luz y oscuridad:

1. **Header & Announcement Ticker (Oscuro):** Negro `#0a0a0a`, tipografía en blanco tiza `#f5f5f5` y acentos carmesí.
2. **Hero Section (Oscuro - El Abismo / Caída):** Fondo negro absoluto. El personaje del querubín enmascarado toma protagonismo junto a la prenda insignia del Drop 01. Tipografía monumental `Syne`.
3. **Colección Principal: Playeras Oversize (Luz - Inocencia / Galería):** Transición limpia a fondo blanco crudo `#f8f8f6`. Tarjetas en blanco `#ffffff` con bordes sutiles. La serigrafía y silueta de las prendas oscuras y blancas resaltan con máxima fidelidad cromática.
4. **Manifiesto Editorial & Simbología (Oscuro - Dualidad / Máscara):** Bloque inmersivo negro con iconografía de murciélagos, palomas blancas y cicatrices en acento carmesí `#d6001c`.
5. **Accesorios & Gorras (Luz - Exposición Técnica):** Retorno a fondo claro para exhibir gorras y accesorios en un grid estructurado y minimalista.
6. **Footer & Drawer del Carrito (Oscuro):** Fondo negro `#0a0a0a` con líneas de separación sutiles.

---

## 2. Paleta Cromática y Tokens Semánticos

### Entorno Oscuro (The Dark Canvas)
- **Fondo Primario:** `#0a0a0a` (Negro noche profundo).
- **Superficie / Tarjetas / Modales:** `#141414` (Obsidiana).
- **Líneas y Bordes:** `#242424` (Cicatriz sutil).
- **Texto Principal:** `#f5f5f5` (Blanco puro).
- **Texto Secundario:** `#8e8e93` (Gris medio).

### Entorno Claro (The Light Canvas)
- **Fondo Primario:** `#f8f8f6` (Blanco editorial / off-white cálido).
- **Superficie / Tarjetas:** `#ffffff` (Blanco puro).
- **Líneas y Bordes:** `#e5e5e0` (Gris tenue).
- **Texto Principal:** `#0d0d0d` (Negro carbón de alto contraste).
- **Texto Secundario:** `#666666` (Gris neutro de lectura).

### Acento de Ruptura (The Crimson Scar)
- **Rojo Carmesí Primario:** `#d6001c` (Sangre arterial para llamadas a la acción, badges de Drop y estado activo del carrito).
- **Rojo Hover:** `#b80018`.
- **Glow / Resplandor Sutil:** `rgba(214, 0, 28, 0.15)`.

---

## 3. Jerarquía Tipográfica

- **Títulos y Logomarca (Display):** `Syne`, 700 / 800.
  - Carácter geométrico, futurista, crudo y con fuerza editorial.
  - Tracking ajustado (`-0.02em`).
- **Cuerpo, UI y Fichas Técnicas (Body):** `Space Grotesk`, 400 (regular) y 600 (semibold).
  - Excelente legibilidad en precios, tallas y composiciones técnicas.
  - Mayúsculas espaciadas en etiquetas técnicas (`letter-spacing: 0.12em`).

---

## 4. Recursos Gráficos e Identidad Simbólica

- **El Personaje (Querubín con Máscara / Ángel Caído):**
  - Aparece como arte central en el Hero y en el bloque del Manifiesto.
  - Encarna la tensión entre pureza celestial y rebelión terrenal.
- **Iconografía Simbólica en SVG:**
  - **Paloma blanca:** Símbolo de pureza y paz efímera.
  - **Murciélago:** Símbolo de penumbra, vuelo nocturno e instinto.
  - **Estrellas de 4 puntas y Cicatrices:** Divisores gráficos afilados entre secciones y en el ticker de anuncios.
- **Tratamiento Fotográfico:**
  - Fotografías reales de prendas en alta resolución con fondo neutro y recorte impecable (frente, espalda y detalle de serigrafía).
  - Para productos en desarrollo sin foto final (gorras, accesorios), se utilizan bloques de exhibición con silueta vectorial editorial y etiqueta `[PROTOTIPO // EN PRODUCCIÓN]`.

---

## 5. Componentes Clave

### A. Tarjetas de Producto (Product Cards)
- Silueta sin bordes redondeados (corte recto contemporáneo `0px` o `2px`).
- Efecto hover con transición al reverso de la prenda (`tshirt-black-back.jpg`).
- Etiqueta de estado superior (`DROP EXCLUSIVO`, `EDICIÓN LIMITADA`).
- Selector rápido de talla visible al posar el cursor o pulsar en móvil.

### B. Carrito Lateral Deslizante (Cart Drawer)
- Despliegue interactivo en off-canvas derecho.
- Memoria persistente en `localStorage`.
- Lista con miniatura de prenda, variante de color, talla seleccionada, modificador de cantidad y eliminación.
- Resumen con cálculo automático de subtotal.
- Botón principal de checkout: **`PEDIR POR WHATSAPP`** con generación del enlace con texto codificado:
  `Hola ESH Store, quiero confirmar mi pedido: 1x Playera Fallen Cherub (Negra, Talla L) - $X ... Total: $Y`

### C. Modales de Detalle (Quick View)
- Galería con miniaturas intercambiables.
- Guía de tallas con medidas reales en centímetros (ancho de pecho, largo, manga).
- Selector de cantidad interactivo.

---

## 6. Reglas de Diseño (Do's and Don'ts)

### Do's:
- **Respetar la dualidad rítmica:** Mantener el contraste entre fondos oscuros y claros entre secciones.
- **Cortes rectos y afilados:** Usar bordes de `0px` o `2px` máximo para sostener la estética industrial/streetwear.
- **Espacio negativo generoso:** Dejar respirar los mockups y los textos; la exclusividad se transmite con espacio.
- **Microinteracciones precisas:** Transiciones de 200ms a 300ms con curvas suaves `ease-out`.

### Don'ts:
- **No usar sombras difusas pesadas ni degradados genéricos:** Evitar el estilo SaaS / Bootstrap / plantilla de dropshipping genérica.
- **No inventar marcas o productos falsos:** Sólo productos oficiales del universo ESH.
- **No usar fuentes estándar genéricas (como Arial o Times):** Mantener la combinación `Syne` + `Space Grotesk`.
- **No obstaculizar la compra:** El proceso para añadir al carrito y enviar a WhatsApp debe tomar menos de 3 clics.
