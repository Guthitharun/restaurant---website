/* ==========================================================================
   CHECKOUT.JS — Checkout & Place Order Logic
   ADHIRATHA Family Restaurant
   ========================================================================== */

let selectedOrderType = 'delivery';
let selectedPaymentMethod = 'cod';
let orderGrandTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('checkout-form')) return;

  // Ensure cart is not empty
  if (CartStore.getCart().length === 0) {
    window.location.href = 'menu.html';
    return;
  }

  renderOrderSummary();
  setupCheckoutForm();
});

/* --------------------------------------------------------------------------
   1. Order Type Selection
   -------------------------------------------------------------------------- */
function selectOrderType(type) {
  selectedOrderType = type;
  document.getElementById('order-type-input').value = type;

  // Update UI classes
  const btns = document.querySelectorAll('.order-type-btn');
  btns.forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`.order-type-btn[data-type="${type}"]`).classList.add('selected');

  // Toggle fields
  const deliveryFields = document.getElementById('delivery-fields');
  const dineinFields = document.getElementById('dinein-fields');
  const addressInput = document.getElementById('checkout-address');
  const personsInput = document.getElementById('checkout-persons');
  const dateInput = document.getElementById('checkout-date');
  const timeInput = document.getElementById('checkout-time');

  if (type === 'delivery') {
    deliveryFields.style.display = 'block';
    dineinFields.style.display = 'none';
    addressInput.setAttribute('required', 'true');
    personsInput.removeAttribute('required');
    dateInput.removeAttribute('required');
    timeInput.removeAttribute('required');
  } else if (type === 'takeaway') {
    deliveryFields.style.display = 'none';
    dineinFields.style.display = 'none';
    addressInput.removeAttribute('required');
    personsInput.removeAttribute('required');
    dateInput.removeAttribute('required');
    timeInput.removeAttribute('required');
  } else if (type === 'dinein') {
    deliveryFields.style.display = 'none';
    dineinFields.style.display = 'block';
    addressInput.removeAttribute('required');
    personsInput.setAttribute('required', 'true');
    dateInput.setAttribute('required', 'true');
    timeInput.setAttribute('required', 'true');
  }
}

/* --------------------------------------------------------------------------
   2. Payment Method Selection
   -------------------------------------------------------------------------- */
function selectPaymentMethod(element, method) {
  selectedPaymentMethod = method;
  document.getElementById('payment-method-input').value = method;

  const methods = document.querySelectorAll('.payment-method');
  methods.forEach(m => m.classList.remove('selected'));
  element.classList.add('selected');
}

/* --------------------------------------------------------------------------
   3. Render Order Summary
   -------------------------------------------------------------------------- */
function renderOrderSummary() {
  const cartItems = CartStore.getCart();
  const listContainer = document.getElementById('checkout-items-list');

  if (!listContainer) return;

  let html = '';
  cartItems.forEach(cartItem => {
    const item = getItemById(cartItem.id);
    if (!item) return;

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:0.88rem;">
        <span>${item.name} <strong>x ${cartItem.qty}</strong></span>
        <span>${formatPrice(item.price * cartItem.qty)}</span>
      </div>
    `;
  });

  listContainer.innerHTML = html;

  // Total amount is simply the subtotal of items (No GST, No Delivery)
  orderGrandTotal = CartStore.getSubtotal();
  document.getElementById('checkout-total').textContent = formatPrice(orderGrandTotal);
}

/* --------------------------------------------------------------------------
   4. Clear Cart and Redirect
   -------------------------------------------------------------------------- */
window.clearCartAndRedirect = function() {
  if(confirm("Are you sure you want to clear your cart?")) {
    CartStore.clearCart();
    window.location.href = 'menu.html';
  }
};

/* --------------------------------------------------------------------------
   5. Checkout Form Submit Handler
   -------------------------------------------------------------------------- */
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // The required attributes on inputs will handle basic validation natively.
    // If we reach here, all required fields are filled.
    placeOrder();
  });
}

/* --------------------------------------------------------------------------
   6. Place Order — Save to Admin + WhatsApp Notify + Show Success Modal
   -------------------------------------------------------------------------- */
function placeOrder() {
  // --- Collect form values ---
  const name         = (document.getElementById('checkout-name')?.value || '').trim();
  const phone        = (document.getElementById('checkout-phone')?.value || '').trim();
  const email        = (document.getElementById('checkout-email')?.value || '').trim();
  const address      = (document.getElementById('checkout-address')?.value || '').trim();
  const instructions = (document.getElementById('checkout-instructions')?.value || '').trim();
  const persons      = (document.getElementById('checkout-persons')?.value || '').trim();
  const bookDate     = (document.getElementById('checkout-date')?.value || '').trim();
  const bookTime     = (document.getElementById('checkout-time')?.value || '').trim();

  // --- Build items snapshot ---
  const cartItems = CartStore.getCart();
  const items = cartItems.map(ci => {
    const item = getItemById(ci.id);
    return item ? { id: ci.id, name: item.name, price: item.price, qty: ci.qty } : null;
  }).filter(Boolean);

  // --- Calculate totals ---
  const subtotal = CartStore.getSubtotal();
  const gst      = Math.round((subtotal * (RESTAURANT.gst || 0)) / 100);
  let delivery   = RESTAURANT.delivery?.charge || 0;
  if (subtotal >= (RESTAURANT.delivery?.freeAbove || 500)) delivery = 0;

  // Apply saved coupon discount if any
  let discount = 0;
  try {
    const saved = localStorage.getItem('adhiratha_active_coupon');
    if (saved) {
      const c = JSON.parse(saved);
      discount = c.discount || 0;
    }
  } catch {}

  const grandTotal = Math.max(0, subtotal + gst + delivery - discount);

  // --- Build order object ---
  const orderData = {
    customer: { name, phone, email },
    orderType: selectedOrderType,
    paymentMethod: selectedPaymentMethod,
    address: selectedOrderType === 'delivery' ? address : '',
    dinein: selectedOrderType === 'dinein' ? { persons, date: bookDate, time: bookTime } : null,
    instructions,
    items,
    subtotal,
    gst,
    delivery,
    discount,
    total: grandTotal,
    coupon: discount > 0 ? localStorage.getItem('adhiratha_active_coupon') : null
  };

  // --- Save order to OrderStore (admin panel) ---
  const savedOrder = OrderStore.addOrder(orderData);

  // --- Build WhatsApp notification message for restaurant ---
  let itemsText = items.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
  let typeInfo  = '';
  if (selectedOrderType === 'delivery') {
    typeInfo = `📍 Delivery Address: ${address}`;
  } else if (selectedOrderType === 'takeaway') {
    typeInfo = `🛍️ Order Type: Take Away`;
  } else if (selectedOrderType === 'dinein') {
    typeInfo = `🍽️ Dine In | Persons: ${persons} | Date: ${bookDate} | Time: ${bookTime}`;
  }

  const waMessage =
    `🍽️ *NEW ORDER — ADHIRATHA RESTAURANT*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Order ID:* ${savedOrder.id}\n` +
    `*Customer:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Email:* ${email}\n\n` +
    `*Items:*\n${itemsText}\n\n` +
    `*Subtotal:* ₹${subtotal}\n` +
    (gst > 0      ? `*GST (${RESTAURANT.gst}%):* ₹${gst}\n` : '') +
    (delivery > 0 ? `*Delivery:* ₹${delivery}\n` : `*Delivery:* FREE\n`) +
    (discount > 0 ? `*Discount:* -₹${discount}\n` : '') +
    `*TOTAL: ₹${grandTotal}*\n\n` +
    `*Payment:* ${selectedPaymentMethod.toUpperCase()}\n` +
    `${typeInfo}\n` +
    (instructions ? `*Notes:* ${instructions}\n` : '') +
    `\nPlease confirm and process this order. Thank you! 🙏`;

  const waURL = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  // --- Generate Date & Time for modal ---
  const now     = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const orderTime = now.toLocaleDateString('en-IN', options);

  // --- Clear cart and coupon ---
  CartStore.clearCart();
  localStorage.removeItem('adhiratha_active_coupon');

  // --- Populate & show success modal ---
  document.getElementById('success-order-id').textContent  = savedOrder.id;
  document.getElementById('success-order-time').textContent = orderTime;
  document.getElementById('success-modal').style.display   = 'flex';

  // --- Open WhatsApp in new tab to notify restaurant ---
  setTimeout(() => {
    window.open(waURL, '_blank');
  }, 800);
}
