/**
 * ESH OFFICIAL MERCH STORE - PRODUCT CATALOG & STORE CONFIG
 * All prices and prototype items are marked as provisional.
 */

const STORE_CONFIG = {
  brandName: "ESH OFFICIAL MERCH",
  artistName: "ESH",
  currency: "MXN",
  // Número de WhatsApp receptor de pedidos (Modificar con el número oficial)
  whatsappNumber: "5215500000000",
  orderMessagePrefix: "Hola ESH Store, quiero confirmar mi pedido desde la tienda web:",
};

const PRODUCTS = [
  {
    id: "esh-tshirt-black",
    name: "Playera Oversize Fallen Cherub (Black)",
    category: "playeras",
    badge: "DROP 01 // EXCLUSIVO",
    // Precio provisional identificado explícitamente
    price: 650,
    priceFormatted: "$650 MXN",
    isProvisionalPrice: true,
    description: "Playera corte boxy oversize en algodón pesado 240g. Serigrafía de alta densidad en pecho y espalda con la iconografía del querubín enmascarado y murciélagos.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Negro", hex: "#0a0a0a" }
    ],
    // Fotos reales actualizadas
    images: {
      front: "assets/img/products/NUEVOS/PLAYERAS/playera-black-front.png",
      back: "assets/img/products/NUEVOS/PLAYERAS/playera-black-back.png",
      angle: "assets/img/products/NUEVOS/PLAYERAS/playera-black-angle.png"
    },
    inStock: true,
    isPrototype: false
  },
  {
    id: "esh-tshirt-white",
    name: "Playera Oversize Fallen Cherub (White)",
    category: "playeras",
    badge: "DROP 01 // INOCENCIA",
    price: 650,
    priceFormatted: "$650 MXN",
    isProvisionalPrice: true,
    description: "Playera corte boxy oversize en algodón pesado 240g blanco tiza. Serigrafía en tinta negra profunda y acentos carmesí.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Blanco", hex: "#f8f8f8" }
    ],
    // Fotos reales actualizadas
    images: {
      front: "assets/img/products/NUEVOS/PLAYERAS/playera-white-front.png",
      back: "assets/img/products/NUEVOS/PLAYERAS/playera-white-back.png",
      angle: "assets/img/products/NUEVOS/PLAYERAS/playera-white-angle.png"
    },
    inStock: true,
    isPrototype: false
  },
  {
    id: "esh-cap-duality",
    name: "Gorra ESH Duality Dad Cap",
    category: "gorras",
    badge: "EN PRODUCCIÓN",
    price: 450,
    priceFormatted: "$450 MXN",
    isProvisionalPrice: true,
    description: "Gorra clásica desestructurada en gabardina de algodón. Bordado frontal de la máscara de querubín y cicatriz trasera.",
    sizes: ["UNITALLA"],
    colors: [
      { name: "Negro Obsidiana", hex: "#141414" }
    ],
    // Fotografía real actualizada
    images: {
      front: "assets/img/products/NUEVOS/GORRA/GORRA.png",
      back: "assets/img/products/NUEVOS/GORRA/GORRA.png",
      angle: "assets/img/products/NUEVOS/GORRA/GORRA.png"
    },
    inStock: false,
    isPrototype: true
  },
  {
    id: "esh-accessory-tag",
    name: "Llavero / Tag Metálico Mask Cherub",
    category: "accesorios",
    badge: "EN PRODUCCIÓN",
    price: 250,
    priceFormatted: "$250 MXN",
    isProvisionalPrice: true,
    description: "Placa metálica grabada en relieve con esmaltado carmesí y cadena reforzada.",
    sizes: ["ÚNICO"],
    colors: [
      { name: "Plata / Negro", hex: "#888888" }
    ],
    // Recurso provisional identificado
    images: {
      front: "assets/img/placeholders/placeholder-accessory.svg",
      back: "assets/img/placeholders/placeholder-accessory.svg",
      angle: "assets/img/placeholders/placeholder-accessory.svg"
    },
    inStock: false,
    isPrototype: true
  }
];
