/* ==========================================================================
   CHECKOUT.JS — Checkout & Place Order Logic
   ADHIRATHA Family Restaurant
   Order summaries rendering, user profiles pre-filling, payment triggers,
   WhatsApp confirmation links, Razorpay integration points.
   ========================================================================== */

let selectedPaymentMethod = 'cod';
let orderSubtotal = 0;
let orderGst = 0;
let orderDelivery = 0;
let orderDiscount = 0;
let orderGrandTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('checkout-page-container')) return;

  initCheckoutPage();
});

/* --------------------------------------------------------------------------
   1. Initialize Checkout Page
   -------------------------------------------------------------------------- */
function initCheckoutPage() {
  // Ensure user is logged in
  if (!AuthStore.isLoggedIn()) {
    showToast('Please login to view checkout', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return;
  }

  // Ensure cart is not empty
  if (CartStore.getCart().length === 0) {
    showToast('Your cart is empty', 'warning');
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 1000);
    return;
  }

  prefillCustomerInfo();
  renderOrderSummary();
  setupPaymentMethods();
  setupCheckoutForm();
}

/* --------------------------------------------------------------------------
   2. Prefill Customer Profile Info
   -------------------------------------------------------------------------- */
function prefillCustomerInfo() {
  const user = AuthStore.getCurrentUser();
  if (!user) return;

  document.getElementById('checkout-name').value = user.name || '';
  document.getElementById('checkout-phone').value = user.phone || '';
  document.getElementById('checkout-address').value = user.address || '';
  document.getElementById('checkout-landmark').value = user.landmark || '';
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

  // Calculate Totals
  orderSubtotal = CartStore.getSubtotal();
  orderGst = Math.round((orderSubtotal * RESTAURANT.gst) / 100);

  orderDelivery = RESTAURANT.delivery.charge;
  if (orderSubtotal >= RESTAURANT.delivery.freeAbove) {
    orderDelivery = 0;
  }

  // Read saved coupon and recalculate discount dynamically based on current checkout subtotal
  const savedCoupon = localStorage.getItem('adhiratha_active_coupon');
  if (savedCoupon) {
    try {
      const data = JSON.parse(savedCoupon);
      if (data && data.code) {
        const res = validateCoupon(data.code, orderSubtotal);
        if (res.valid) {
          orderDiscount = res.discount;
          // Sync back the updated discount to localStorage
          localStorage.setItem('adhiratha_active_coupon', JSON.stringify({
            code: data.code,
            discount: orderDiscount
          }));
        } else {
          // Coupon no longer valid for this subtotal
          orderDiscount = 0;
          localStorage.removeItem('adhiratha_active_coupon');
        }
      }
    } catch {
      orderDiscount = 0;
    }
  } else {
    orderDiscount = 0;
  }

  orderGrandTotal = Math.round(orderSubtotal + orderGst + orderDelivery - orderDiscount);

  // Render Totals in Sidebar
  document.getElementById('checkout-subtotal').textContent = formatPrice(orderSubtotal);
  
  // Display GST dynamically or hide if 0
  const gstEl = document.getElementById('checkout-gst');
  if (gstEl) {
    const gstRow = gstEl.parentElement;
    if (RESTAURANT.gst > 0) {
      gstRow.classList.remove('hidden');
      const gstLabel = gstEl.previousElementSibling;
      if (gstLabel) {
        gstLabel.textContent = `GST (${RESTAURANT.gst}%):`;
      }
      gstEl.textContent = formatPrice(orderGst);
    } else {
      gstRow.classList.add('hidden');
    }
  }
  
  const deliveryEl = document.getElementById('checkout-delivery');
  if (orderDelivery === 0) {
    deliveryEl.innerHTML = `<span class="text-success" style="font-weight:600;">FREE</span>`;
  } else {
    deliveryEl.textContent = formatPrice(orderDelivery);
  }

  const discountRow = document.getElementById('checkout-discount-row');
  const discountEl = document.getElementById('checkout-discount');
  if (orderDiscount > 0) {
    discountRow.classList.remove('hidden');
    discountEl.textContent = `-${formatPrice(orderDiscount)}`;
  } else {
    discountRow.classList.add('hidden');
  }

  document.getElementById('checkout-total').textContent = formatPrice(orderGrandTotal);
}

/* --------------------------------------------------------------------------
   4. Payment Methods Toggle
   -------------------------------------------------------------------------- */
function setupPaymentMethods() {
  const methods = document.querySelectorAll('.payment-method');
  methods.forEach(method => {
    method.addEventListener('click', () => {
      methods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      selectedPaymentMethod = method.getAttribute('data-method');

      // Hide or show specific instructions based on selected payment
      const upiSection = document.getElementById('upi-instruction-section');
      if (upiSection) {
        if (selectedPaymentMethod === 'upi') {
          upiSection.classList.remove('hidden');
        } else {
          upiSection.classList.add('hidden');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Checkout Form Submit Handler
   -------------------------------------------------------------------------- */
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Form inputs validation
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const landmark = document.getElementById('checkout-landmark').value.trim();

    if (name === '' || phone === '' || address === '') {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // Capture location check coordinates if maps picker was used (Simulated for Phase 1)
    const coordinates = 'Pamuru Near NH-565';

    // Execute Payment flow
    if (selectedPaymentMethod === 'online') {
      triggerRazorpay(name, phone, address, landmark, coordinates);
    } else if (selectedPaymentMethod === 'upi') {
      showUPIMicroModal(name, phone, address, landmark, coordinates);
    } else {
      placeOrder(name, phone, address, landmark, 'cod', 'Pending', coordinates);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Simulated Razorpay Integration Point
   -------------------------------------------------------------------------- */
function triggerRazorpay(name, phone, address, landmark, coords) {
  showToast('Initiating Online Payment Gateway...', 'info', 2000);

  // In a real environment, you would load Razorpay checkout SDK
  // Here we simulate a successful payment gateway overlay
  setTimeout(() => {
    const confirmPayment = confirm(`[Razorpay Sandbox] Payment of ${formatPrice(orderGrandTotal)} triggered.\n\nPress OK to simulate SUCCESSFUL payment.\nPress Cancel to simulate FAILED payment.`);
    
    if (confirmPayment) {
      const transactionId = 'PAYID-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      placeOrder(name, phone, address, landmark, 'online', 'Paid', coords, transactionId);
    } else {
      showToast('Online Payment cancelled or failed. Please try again.', 'error');
    }
  }, 1800);
}

/* --------------------------------------------------------------------------
   7. Simulated UPI QR Code Modal
   -------------------------------------------------------------------------- */
function showUPIMicroModal(name, phone, address, landmark, coords) {
  // Create simulated QR Code Modal
  const modalHTML = `
    <div id="upi-modal" class="modal-overlay active">
      <div class="modal" style="max-width:380px; text-align:center;">
        <div class="modal-header">
          <h3 class="modal-title">UPI QR Code Payment</h3>
          <button class="modal-close" onclick="document.getElementById('upi-modal').remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p class="mb-3">Scan this QR Code using any UPI App (GPay/PhonePe/Paytm)</p>
          <div style="background:white; padding:15px; display:inline-block; border-radius:10px; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
            <!-- Simple QR Code Image Generator API -->
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=6301042993@ybl&pn=AdhirathaRestaurant&am=${orderGrandTotal}&cu=INR`)}" alt="UPI QR Code" style="width:180px; height:180px; display:block;">
          </div>
          <p class="text-gold" style="font-weight:700; font-size:1.15rem;" class="mb-3">${formatPrice(orderGrandTotal)}</p>
          <p class="text-sm mb-4">Payee: ADHIRATHA RESTAURANT<br>UPI ID: 6301042993@ybl</p>
          <button id="confirm-upi-btn" class="btn btn-gold btn-block">I Have Paid — Confirm Order</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('confirm-upi-btn').addEventListener('click', () => {
    document.getElementById('upi-modal').remove();
    const transactionId = 'UPI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    placeOrder(name, phone, address, landmark, 'upi', 'Paid', coords, transactionId);
  });
}

/* --------------------------------------------------------------------------
   8. Process & Place Order (Save to store and redirect)
   -------------------------------------------------------------------------- */
function placeOrder(name, phone, address, landmark, method, paymentStatus, coords, txId = null) {
  // Construct Order Object
  const items = CartStore.getCart().map(cartItem => {
    const mItem = getItemById(cartItem.id);
    return {
      id: cartItem.id,
      name: mItem ? mItem.name : 'Unknown Item',
      price: mItem ? mItem.price : 0,
      qty: cartItem.qty
    };
  });

  const activeCoupon = localStorage.getItem('adhiratha_active_coupon');
  const couponDetails = activeCoupon ? JSON.parse(activeCoupon) : null;

  const order = {
    customer: { name, phone, address, landmark, coords },
    items: items,
    subtotal: orderSubtotal,
    gst: orderGst,
    deliveryCharge: orderDelivery,
    discount: orderDiscount,
    couponCode: couponDetails ? couponDetails.code : null,
    total: orderGrandTotal,
    payment: {
      method: method,
      status: paymentStatus,
      transactionId: txId
    }
  };

  // Save order to Local Storage
  const savedOrder = OrderStore.addOrder(order);

  // Clear Cart items and Coupons
  CartStore.clearCart();
  localStorage.removeItem('adhiratha_active_coupon');

  // Trigger Confirmation layout
  renderOrderConfirmation(savedOrder);
}

/* --------------------------------------------------------------------------
   9. Order Confirmation Screen & WhatsApp Trigger
   -------------------------------------------------------------------------- */
function renderOrderConfirmation(order) {
  const container = document.getElementById('checkout-page-container');
  if (!container) return;

  // Format cart items description for WhatsApp link
  let itemsText = '';
  order.items.forEach(item => {
    itemsText += `• ${item.name} x ${item.qty} (₹${item.price * item.qty})\n`;
  });

  const whatsappMessage = `*ADHIRATHA FAMILY RESTAURANT (AC)*\n` +
                          `*NEW ORDER RECEIVED!* \n\n` +
                          `*Order ID:* ${order.id}\n` +
                          `*Customer:* ${order.customer.name}\n` +
                          `*Phone:* ${order.customer.phone}\n` +
                          `*Address:* ${order.customer.address}, Near ${order.customer.landmark}\n\n` +
                          `*Items Ordered:*\n${itemsText}\n` +
                          `*Subtotal:* ₹${order.subtotal}\n` +
                          (order.gst > 0 ? `*GST (${RESTAURANT.gst}%):* ₹${order.gst}\n` : '') +
                          (order.deliveryCharge > 0 ? `*Delivery Charge:* ₹${order.deliveryCharge}\n` : '') +
                          (order.discount > 0 ? `*Discount Applied:* -₹${order.discount} (${order.couponCode || 'None'})\n` : '') +
                          `*GRAND TOTAL:* ₹${order.total}\n\n` +
                          `*Payment Method:* ${order.payment.method.toUpperCase()}\n` +
                          `*Payment Status:* ${order.payment.status}\n` +
                          `*Tx ID:* ${order.payment.transactionId || 'N/A'}\n\n` +
                          `Please confirm cooking and estimated delivery time. Thank you!`;

  const waLink = generateWhatsAppLink(whatsappMessage);

  container.innerHTML = `
    <div class="order-success animate-scale">
      <div class="order-success-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2>Order Placed Successfully!</h2>
      <p class="text-secondary">Your order has been recorded. The chef is ready to start cooking!</p>
      <div class="order-id">Order ID: ${order.id}</div>

      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px; max-width:500px; margin:25px auto; text-align:left;">
        <h4 class="text-gold mb-3" style="font-family:var(--font-accent);">Order Details</h4>
        <p class="text-sm text-secondary"><strong>Total Items:</strong> ${order.items.reduce((s, i) => s + i.qty, 0)}</p>
        <p class="text-sm text-secondary mb-3"><strong>Amount Paid:</strong> ${formatPrice(order.total)} (${order.payment.method.toUpperCase()})</p>
        <p class="text-sm text-muted">Please click the button below to send your order copy to the restaurant on WhatsApp to speed up delivery confirmation.</p>
      </div>

      <div style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap;">
        <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-lg">
          <i class="fa-brands fa-whatsapp"></i> Send Order via WhatsApp
        </a>
        <a href="menu.html" class="btn btn-outline btn-lg">
          <i class="fa-solid fa-burger"></i> Order More Food
        </a>
      </div>
    </div>
  `;
}
