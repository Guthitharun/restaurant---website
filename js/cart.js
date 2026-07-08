/* ==========================================================================
   CART.JS — Cart Page Interactive Features
   ADHIRATHA Family Restaurant
   Cart table list rendering, coupon codes, summary totals recalculation
   ========================================================================== */

let activeCoupon = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('cart-page-container')) return;

  initCartPage();
});

/* --------------------------------------------------------------------------
   1. Initialize Cart Page
   -------------------------------------------------------------------------- */
function initCartPage() {
  renderCart();
  setupCouponForm();
  setupCheckoutButton();
}

/* --------------------------------------------------------------------------
   2. Render Cart Items and Summary
   -------------------------------------------------------------------------- */
function renderCart() {
  const cartItems = CartStore.getCart();
  const container = document.getElementById('cart-items-wrapper');
  const summaryContainer = document.getElementById('cart-summary-wrapper');

  if (!container) return;

  if (cartItems.length === 0) {
    // Show empty state
    container.innerHTML = `
      <div class="empty-state animate-fade-in">
        <div class="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>You haven't added any items to your cart yet.</p>
        <a href="menu.html" class="btn btn-gold"><i class="fa-solid fa-arrow-left"></i> Browse Menu</a>
      </div>
    `;
    if (summaryContainer) {
      summaryContainer.style.display = 'none';
    }
    return;
  }

  // Show cart layout
  if (summaryContainer) {
    summaryContainer.style.display = 'block';
  }

  let html = '';
  cartItems.forEach(cartItem => {
    const item = getItemById(cartItem.id);
    if (!item) return;

    html += `
      <div class="cart-item animate-fade-up" data-item-id="${item.id}">
        <img src="${getItemImage(item)}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <span class="veg-dot ${item.isVeg ? 'veg' : 'nonveg'}"></span>
          <span class="cart-item-price">${formatPrice(item.price)} each</span>
        </div>
        <div class="qty-control" data-item-id="${item.id}">
          <button class="qty-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-value">${cartItem.qty}</span>
          <button class="qty-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="cart-item-total">${formatPrice(item.price * cartItem.qty)}</div>
        <button class="cart-item-remove remove-btn" data-item-id="${item.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  // Bind events
  bindCartEvents(container);

  // Recalculate and update summary totals
  calculateSummary();
}

/* --------------------------------------------------------------------------
   3. Bind Cart Events
   -------------------------------------------------------------------------- */
function bindCartEvents(container) {
  // Plus Buttons
  container.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.parentElement.getAttribute('data-item-id'));
      const newQty = CartStore.getItemQty(id) + 1;
      CartStore.updateQty(id, newQty);
      renderCart();
    });
  });

  // Minus Buttons
  container.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.parentElement.getAttribute('data-item-id'));
      const newQty = CartStore.getItemQty(id) - 1;
      CartStore.updateQty(id, newQty);
      renderCart();
    });
  });

  // Remove Buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-item-id'));
      CartStore.removeItem(id);
      renderCart();
    });
  });
}

/* --------------------------------------------------------------------------
   4. Recalculate Subtotal, GST, Delivery and Discounts
   -------------------------------------------------------------------------- */
function calculateSummary() {
  const subtotal = CartStore.getSubtotal();
  const gst = Math.round((subtotal * RESTAURANT.gst) / 100);
  
  // Free delivery above threshold
  let delivery = RESTAURANT.delivery.charge;
  if (subtotal >= RESTAURANT.delivery.freeAbove) {
    delivery = 0;
  }

  // Calculate discount if coupon is active
  let discount = 0;
  if (activeCoupon) {
    const res = validateCoupon(activeCoupon.code, subtotal);
    if (res.valid) {
      discount = res.discount;
      // Sync the recalculated discount to localStorage so checkout.html gets the updated discount
      localStorage.setItem('adhiratha_active_coupon', JSON.stringify({
        code: activeCoupon.code,
        discount: discount
      }));
    } else {
      activeCoupon = null; // Invalidate coupon
      localStorage.removeItem('adhiratha_active_coupon');
      const couponInput = document.getElementById('cart-coupon-input');
      if (couponInput) couponInput.value = '';
      showToast(res.message, 'error');
    }
  }

  const grandTotal = Math.round(subtotal + gst + delivery - discount);

  // Update DOM elements
  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
  
  // Display GST dynamically or hide if 0
  const gstEl = document.getElementById('cart-gst');
  if (gstEl) {
    const gstRow = gstEl.parentElement;
    if (RESTAURANT.gst > 0) {
      gstRow.classList.remove('hidden');
      const gstLabel = gstEl.previousElementSibling;
      if (gstLabel) {
        gstLabel.textContent = `GST (${RESTAURANT.gst}%):`;
      }
      gstEl.textContent = formatPrice(gst);
    } else {
      gstRow.classList.add('hidden');
    }
  }
  
  const deliveryEl = document.getElementById('cart-delivery');
  if (delivery === 0) {
    deliveryEl.innerHTML = `<span class="text-success" style="font-weight:600;">FREE</span>`;
  } else {
    deliveryEl.textContent = formatPrice(delivery);
  }

  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  if (discount > 0) {
    discountRow.classList.remove('hidden');
    discountEl.textContent = `-${formatPrice(discount)}`;
  } else {
    discountRow.classList.add('hidden');
  }

  document.getElementById('cart-total').textContent = formatPrice(grandTotal);
}

/* --------------------------------------------------------------------------
   5. Coupon Codes Form
   -------------------------------------------------------------------------- */
function setupCouponForm() {
  const form = document.getElementById('cart-coupon-form');
  const input = document.getElementById('cart-coupon-input');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();
    
    if (code === '') {
      showToast('Please enter a coupon code', 'warning');
      return;
    }

    const subtotal = CartStore.getSubtotal();
    const res = validateCoupon(code, subtotal);

    if (res.valid) {
      activeCoupon = res.coupon;
      // Save active coupon details in local storage so checkout can read it
      localStorage.setItem('adhiratha_active_coupon', JSON.stringify({
        code: activeCoupon.code,
        discount: res.discount
      }));
      calculateSummary();
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  });

  // If a coupon was previously applied, pre-fill and validate it
  const savedCoupon = localStorage.getItem('adhiratha_active_coupon');
  if (savedCoupon) {
    try {
      const data = JSON.parse(savedCoupon);
      input.value = data.code;
      activeCoupon = COUPONS.find(c => c.code === data.code);
      calculateSummary();
    } catch {
      localStorage.removeItem('adhiratha_active_coupon');
    }
  }
}

/* --------------------------------------------------------------------------
   6. Proceed to Checkout
   -------------------------------------------------------------------------- */
function setupCheckoutButton() {
  const btn = document.getElementById('cart-checkout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Check if user is logged in
    if (!AuthStore.isLoggedIn()) {
      showToast('Please login to place your order', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html?redirect=cart.html';
      }, 1500);
      return;
    }
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
  });
}
