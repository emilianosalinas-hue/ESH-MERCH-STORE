/**
 * ESH OFFICIAL MERCH STORE - UI APPLICATION CONTROLLER
 * Pure Vanilla JavaScript | Zero Frameworks
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  const productGrid = document.getElementById("product-grid");
  const accessoriesGrid = document.getElementById("accessories-grid");
  const cartBadge = document.getElementById("cart-badge");
  const cartToggleBtn = document.getElementById("cart-toggle");
  const cartCloseBtn = document.getElementById("cart-close");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalAmount = document.getElementById("cart-total");
  const checkoutWhatsappBtn = document.getElementById("checkout-whatsapp");

  // Plantilla de tarjeta de producto
  function createProductCard(product) {
    const isAvailable = product.inStock;
    const isPlayera = product.category === "playeras";

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-media ${isPlayera ? 'product-gallery-sequence' : 'product-media-static'}" ${isPlayera ? 'data-view="back"' : ''}>
          <span class="product-badge">${product.badge}</span>
          ${isPlayera ? `
            <img class="product-img img-seq img-seq-back" src="${product.images.back}" alt="${product.name} - Vista posterior" loading="lazy">
            <img class="product-img img-seq img-seq-angle" src="${product.images.angle}" alt="${product.name} - Vista lateral" loading="lazy">
            <img class="product-img img-seq img-seq-front" src="${product.images.front}" alt="${product.name} - Vista frontal" loading="lazy">
          ` : `
            <img class="product-img img-static" src="${product.images.front}" alt="${product.name}" loading="lazy">
          `}
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price-box">
            <span class="product-price">${product.priceFormatted}</span>
            ${product.isProvisionalPrice ? '<span class="product-price-note">[PROVISIONAL]</span>' : ''}
          </div>
          
          ${isAvailable ? `
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button class="btn btn-solid-light btn-add-quick" style="flex: 1; padding: 10px;" data-id="${product.id}" data-size="${product.sizes[0]}" data-color="${product.colors[0].name}">
                AÑADIR TALLA ${product.sizes[0]}
              </button>
            </div>
          ` : `
            <div style="margin-top: 12px;">
              <button class="btn btn-outline" style="width: 100%; padding: 10px; opacity: 0.6; cursor: not-allowed;" disabled>
                PRÓXIMAMENTE
              </button>
            </div>
          `}
        </div>
      </article>
    `;
  }

  // --- Secuencia animada de imágenes para playeras (BACK -> ANGLE -> FRONT) ---
  function setupProductHoverSequences() {
    // Solo activar en dispositivos con puntero fino y soporte de hover real
    const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const cards = document.querySelectorAll(".product-card");
    cards.forEach(card => {
      const media = card.querySelector(".product-gallery-sequence");
      if (!media) return;

      let timer1 = null;
      let timer2 = null;

      card.addEventListener("mouseenter", () => {
        if (timer1) clearTimeout(timer1);
        if (timer2) clearTimeout(timer2);

        // Secuencia: inicia en BACK, transiciona a ANGLE a los 450ms, y a FRONT a los 1000ms
        timer1 = setTimeout(() => {
          media.setAttribute("data-view", "angle");
        }, 450);

        timer2 = setTimeout(() => {
          media.setAttribute("data-view", "front");
        }, 1000);
      });

      card.addEventListener("mouseleave", () => {
        if (timer1) clearTimeout(timer1);
        if (timer2) clearTimeout(timer2);
        // Regreso suave a vista inicial BACK
        media.setAttribute("data-view", "back");
      });
    });
  }

  // --- 1. Renderizado del Catálogo ---
  function renderProducts() {
    if (productGrid) {
      const playeras = PRODUCTS.filter(p => p.category === "playeras");
      productGrid.innerHTML = playeras.map(createProductCard).join("");
    }

    if (accessoriesGrid) {
      const accessories = PRODUCTS.filter(p => p.category !== "playeras");
      accessoriesGrid.innerHTML = accessories.map(createProductCard).join("");
    }

    // Inicializar secuencia interactiva de vistas en playeras
    setupProductHoverSequences();

    // Eventos para añadir al carrito
    document.querySelectorAll(".btn-add-quick").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const size = e.currentTarget.getAttribute("data-size");
        const color = e.currentTarget.getAttribute("data-color");
        Cart.addItem(id, size, color, 1);
        openCart();
      });
    });
  }

  // --- 2. Drawer del Carrito & UI ---
  function openCart() {
    cartDrawer?.classList.add("is-active");
    cartOverlay?.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawer?.classList.remove("is-active");
    cartOverlay?.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  cartToggleBtn?.addEventListener("click", openCart);
  cartCloseBtn?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  // Escuchar tecla ESC para cerrar modales/carrito
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  // --- 3. Actualización de Vista del Carrito ---
  function updateCartUI() {
    const items = Cart.getItems();
    const count = Cart.getCount();
    const subtotal = Cart.getSubtotal();

    // Actualizar badge
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? "flex" : "none";
    }

    // Actualizar total
    if (cartTotalAmount) {
      cartTotalAmount.textContent = `$${subtotal} ${STORE_CONFIG.currency}`;
    }

    // Renderizar lista de artículos
    if (cartItemsList) {
      if (items.length === 0) {
        cartItemsList.innerHTML = `
          <div style="text-align: center; padding: 48px 16px; color: var(--text-dark-muted);">
            <p style="font-size: 0.9rem; margin-bottom: 8px;">TU CARRITO ESTÁ VACÍO</p>
            <p style="font-size: 0.75rem;">Explora la colección y añade tus prendas oficiales.</p>
          </div>
        `;
        if (checkoutWhatsappBtn) {
          checkoutWhatsappBtn.style.opacity = "0.5";
          checkoutWhatsappBtn.style.pointerEvents = "none";
        }
      } else {
        cartItemsList.innerHTML = items.map((item, index) => `
          <div style="display: flex; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--border-dark);">
            <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 80px; object-fit: cover; background: #0a0a0a;">
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h4 style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">${item.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-dark-muted);">Talla: ${item.size} | Color: ${item.color}</p>
                <p style="font-size: 0.85rem; font-weight: 600; margin-top: 4px;">$${item.price} ${STORE_CONFIG.currency}</p>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                <div style="display: flex; align-items: center; border: 1px solid var(--border-dark);">
                  <button class="cart-qty-btn" data-action="decrease" data-index="${index}" style="padding: 2px 8px; font-weight: 700;">-</button>
                  <span style="padding: 2px 10px; font-size: 0.8rem;">${item.quantity}</span>
                  <button class="cart-qty-btn" data-action="increase" data-index="${index}" style="padding: 2px 8px; font-weight: 700;">+</button>
                </div>
                <button class="cart-remove-btn" data-index="${index}" style="font-size: 0.75rem; color: var(--color-crimson); text-transform: uppercase;">Eliminar</button>
              </div>
            </div>
          </div>
        `).join("");

        if (checkoutWhatsappBtn) {
          checkoutWhatsappBtn.style.opacity = "1";
          checkoutWhatsappBtn.style.pointerEvents = "auto";
        }
      }
    }

    // Eventos de botones de cantidad y eliminación
    cartItemsList?.querySelectorAll(".cart-qty-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
        const action = e.currentTarget.getAttribute("data-action");
        const currentItem = items[index];
        if (currentItem) {
          const newQty = action === "increase" ? currentItem.quantity + 1 : currentItem.quantity - 1;
          Cart.updateQuantity(index, newQty);
        }
      });
    });

    cartItemsList?.querySelectorAll(".cart-remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
        Cart.removeItem(index);
      });
    });
  }

  // --- 4. Conexión de Checkout a WhatsApp ---
  checkoutWhatsappBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const url = Cart.generateWhatsAppUrl();
    if (url) {
      window.open(url, "_blank");
    }
  });

  // Escuchar eventos globales del carrito
  window.addEventListener("esh:cart-updated", updateCartUI);

  // Inicialización
  renderProducts();
  updateCartUI();

});
