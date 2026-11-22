/**
 * ESH OFFICIAL MERCH STORE - CART LOGIC & WHATSAPP CHECKOUT
 * Pure Vanilla JavaScript | LocalStorage persistence
 */

const Cart = (() => {
  const STORAGE_KEY = "esh_merch_cart_v1";

  // Carga inicial del carrito
  let items = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    items = saved ? JSON.parse(saved) : [];
  } catch (e) {
    items = [];
  }

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error guardando el carrito en localStorage", e);
    }
    // Notifica a los observadores
    window.dispatchEvent(new CustomEvent("esh:cart-updated", { detail: { items } }));
  };

  return {
    getItems: () => [...items],

    getCount: () => items.reduce((total, item) => total + item.quantity, 0),

    getSubtotal: () => items.reduce((total, item) => total + (item.price * item.quantity), 0),

    addItem: (productId, size, colorName, quantity = 1) => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return false;

      // Buscar si ya existe la misma combinación de producto + talla + variante
      const existingIndex = items.findIndex(
        item => item.id === productId && item.size === size && item.color === colorName
      );

      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          size: size,
          color: colorName,
          quantity: quantity,
          image: product.images.front,
          isProvisionalPrice: product.isProvisionalPrice
        });
      }

      save();
      return true;
    },

    updateQuantity: (index, newQuantity) => {
      if (index >= 0 && index < items.length) {
        if (newQuantity <= 0) {
          items.splice(index, 1);
        } else {
          items[index].quantity = newQuantity;
        }
        save();
      }
    },

    removeItem: (index) => {
      if (index >= 0 && index < items.length) {
        items.splice(index, 1);
        save();
      }
    },

    clear: () => {
      items = [];
      save();
    },

    /**
     * Construye el enlace codificado para enviar el pedido vía WhatsApp
     */
    generateWhatsAppUrl: () => {
      if (items.length === 0) return null;

      const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      let text = `${STORE_CONFIG.orderMessagePrefix}\n\n`;

      items.forEach((item, idx) => {
        text += `${idx + 1}. *${item.name}*\n`;
        text += `   • Talla: ${item.size} | Variante: ${item.color}\n`;
        text += `   • Cantidad: ${item.quantity} x $${item.price} ${STORE_CONFIG.currency}\n`;
        text += `   • Subtotal: $${item.quantity * item.price} ${STORE_CONFIG.currency}\n\n`;
      });

      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*TOTAL ESTIMADO: $${subtotal} ${STORE_CONFIG.currency}*\n`;
      text += `*(Precios y existencias sujetos a confirmación oficial)*\n\n`;
      text += `Favor de indicar método de entrega y datos de envío.`;

      const encodedText = encodeURIComponent(text);
      return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedText}`;
    }
  };
})();
