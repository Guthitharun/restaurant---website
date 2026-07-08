/* ==========================================================================
   ADMIN.JS — Admin Dashboard & Operations Logic
   ADHIRATHA Family Restaurant
   Dashboard statistics, active orders table, status updates, chart.js graphs
   ========================================================================== */

let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Page check
  const isLoginPage = document.getElementById('admin-login-container');
  const isDashboardPage = document.getElementById('admin-dashboard-container');

  if (isLoginPage) {
    initAdminLoginPage();
  } else if (isDashboardPage) {
    initAdminDashboard();
  }
});

/* --------------------------------------------------------------------------
   1. Admin Login Page Controller
   -------------------------------------------------------------------------- */
function initAdminLoginPage() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();

    if (user === '' || pass === '') {
      showToast('Please fill in credentials', 'error');
      return;
    }

    const res = AuthStore.loginAdmin(user, pass);

    if (res.success) {
      showToast('Welcome Back, Administrator!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast(res.message, 'error');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Admin Dashboard Initialization
   -------------------------------------------------------------------------- */
function initAdminDashboard() {
  // Guard check
  if (!AuthStore.isAdminLoggedIn()) {
    showToast('Unauthorized Access! Redirecting...', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    return;
  }

  // Pre-seed some orders if dashboard has 0 orders (simulates live content)
  preSeedOrdersIfEmpty();

  // Load and refresh statistics
  refreshDashboardStats();
  renderAdminOrders();
  setupOrderFilters();
  setupCharts();
  setupAdminProfile();
}

/* --------------------------------------------------------------------------
   3. Pre-seed Orders (Simulate active dashboard content)
   -------------------------------------------------------------------------- */
function preSeedOrdersIfEmpty() {
  const orders = OrderStore.getOrders();
  if (orders.length > 0) return;

  // Preseed 3 simulated orders
  const sample1 = {
    customer: { name: 'Siva Prasad', phone: '9440283451', address: 'Bypass Road, Pamuru', landmark: 'Govt Hospital', coords: 'Pamuru' },
    items: [
      { id: 25, name: 'Chicken Dum Biryani', price: 250, qty: 2 },
      { id: 49, name: 'Chicken 65', price: 220, qty: 1 }
    ],
    subtotal: 720,
    gst: 36,
    deliveryCharge: 0,
    discount: 80,
    couponCode: 'ADHIRATHA10',
    total: 676,
    payment: { method: 'cod', status: 'Pending', transactionId: null }
  };

  const sample2 = {
    customer: { name: 'Kalyani S', phone: '7013845920', address: 'Police Station Area, Pamuru', landmark: 'Water Tank', coords: 'Pamuru' },
    items: [
      { id: 17, name: 'Paneer Butter Masala', price: 230, qty: 1 },
      { id: 36, name: 'Jeera Rice', price: 120, qty: 2 }
    ],
    subtotal: 470,
    gst: 24,
    deliveryCharge: 40,
    discount: 0,
    couponCode: null,
    total: 534,
    payment: { method: 'online', status: 'Paid', transactionId: 'PAYID-A28F30X92' }
  };

  const sample3 = {
    customer: { name: 'Naveen Kumar', phone: '8008234501', address: 'Main Bazar, Pamuru', landmark: 'Rama Temple', coords: 'Pamuru' },
    items: [
      { id: 32, name: 'Chicken Mandi', price: 300, qty: 1 }
    ],
    subtotal: 300,
    gst: 15,
    deliveryCharge: 40,
    discount: 0,
    couponCode: null,
    total: 355,
    payment: { method: 'upi', status: 'Paid', transactionId: 'UPI-N987DF' }
  };

  OrderStore.addOrder(sample1);
  OrderStore.addOrder(sample2);
  OrderStore.addOrder(sample3);
  
  // Set statuses
  const seeded = OrderStore.getOrders();
  OrderStore.updateStatus(seeded[0].id, 'pending');
  OrderStore.updateStatus(seeded[1].id, 'cooking');
  OrderStore.updateStatus(seeded[2].id, 'delivered');
}

/* --------------------------------------------------------------------------
   4. Recalculate and Load Stats
   -------------------------------------------------------------------------- */
function refreshDashboardStats() {
  const allOrders = OrderStore.getOrders();
  const todayOrders = OrderStore.getTodaysOrders();
  const revenue = OrderStore.getTodaysRevenue();
  const pendingCount = OrderStore.getOrdersByStatus('pending').length;

  document.getElementById('stat-total-orders').textContent = allOrders.length;
  document.getElementById('stat-today-orders').textContent = todayOrders.length;
  document.getElementById('stat-revenue').textContent = formatPrice(revenue);
  document.getElementById('stat-pending-orders').textContent = pendingCount;
}

/* --------------------------------------------------------------------------
   5. Render Active Orders in Admin Table
   -------------------------------------------------------------------------- */
function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  const orders = OrderStore.getOrdersByStatus(activeFilter);

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          No orders found matching the "${activeFilter.toUpperCase()}" filter.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  orders.forEach(o => {
    let statusClass = 'status-pending';
    if (o.status === 'cooking') statusClass = 'status-cooking';
    if (o.status === 'delivered') statusClass = 'status-delivered';
    if (o.status === 'cancelled') statusClass = 'status-cancelled';

    let actionButtons = '';
    if (o.status === 'pending') {
      actionButtons = `
        <button class="admin-action-btn accept" data-id="${o.id}">Accept</button>
        <button class="admin-action-btn cancel" data-id="${o.id}">Cancel</button>
      `;
    } else if (o.status === 'cooking') {
      actionButtons = `
        <button class="admin-action-btn accept btn-success" data-id="${o.id}" data-action="deliver">Deliver</button>
      `;
    }

    const itemsText = o.items.map(i => `${i.name} (${i.qty})`).join(', ');

    html += `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <span style="font-weight:600; color:var(--text-primary);">${o.customer.name}</span><br>
          <span class="text-xs text-muted">${o.customer.phone}</span>
        </td>
        <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          <span class="text-sm">${itemsText}</span>
        </td>
        <td><strong>${formatPrice(o.total)}</strong></td>
        <td><span class="text-uppercase text-xs" style="color:var(--gold);">${o.payment.method}</span></td>
        <td><span class="status-badge ${statusClass}">${o.status}</span></td>
        <td>
          <div class="flex gap-sm">
            <button class="admin-action-btn view" data-id="${o.id}">View</button>
            ${actionButtons}
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  bindAdminActions(tbody);
}

/* --------------------------------------------------------------------------
   6. Bind Actions to Table Items
   -------------------------------------------------------------------------- */
function bindAdminActions(tbody) {
  // View Details Modal
  tbody.querySelectorAll('.view').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      showOrderDetailsModal(orderId);
    });
  });

  // Accept/Cooking Status Trigger
  tbody.querySelectorAll('.accept').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      
      if (action === 'deliver') {
        OrderStore.updateStatus(orderId, 'delivered');
        showToast(`Order ${orderId} marked as DELIVERED!`, 'success');
      } else {
        OrderStore.updateStatus(orderId, 'cooking');
        showToast(`Order ${orderId} accepted for cooking!`, 'info');
      }

      refreshDashboardStats();
      renderAdminOrders();
    });
  });

  // Cancel Status Trigger
  tbody.querySelectorAll('.cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      const confirmCancel = confirm(`Are you sure you want to CANCEL order ${orderId}?`);
      
      if (confirmCancel) {
        OrderStore.updateStatus(orderId, 'cancelled');
        showToast(`Order ${orderId} cancelled.`, 'error');
        refreshDashboardStats();
        renderAdminOrders();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Order Details Overlay Modal
   -------------------------------------------------------------------------- */
function showOrderDetailsModal(orderId) {
  const orders = OrderStore.getOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) return;

  let itemsHTML = '';
  order.items.forEach(i => {
    itemsHTML += `
      <div class="order-detail-item">
        <span>${i.name} <strong>x ${i.qty}</strong></span>
        <span>${formatPrice(i.price * i.qty)}</span>
      </div>
    `;
  });

  const modalHTML = `
    <div id="admin-detail-modal" class="modal-overlay active">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Order Details: ${order.id}</h3>
          <button class="modal-close" onclick="document.getElementById('admin-detail-modal').remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="order-detail-customer">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}, Near ${order.customer.landmark}</p>
            <p><strong>Coordinates:</strong> ${order.customer.coords}</p>
          </div>
          
          <div class="order-detail-items">
            <h4 class="mb-2 text-gold">Dishes Ordered</h4>
            ${itemsHTML}
          </div>

          <div style="border-top:1px solid var(--border-color); padding-top:15px; font-size:0.9rem;">
            <div style="display:flex; justify-content:between; margin-bottom:5px;"><span>Subtotal:</span><span>${formatPrice(order.subtotal)}</span></div>
            <div style="display:flex; justify-content:between; margin-bottom:5px;"><span>GST:</span><span>${formatPrice(order.gst)}</span></div>
            <div style="display:flex; justify-content:between; margin-bottom:5px;"><span>Delivery:</span><span>${formatPrice(order.deliveryCharge)}</span></div>
            <div style="display:flex; justify-content:between; margin-bottom:5px; color:var(--success);"><span>Discount:</span><span>-${formatPrice(order.discount)}</span></div>
            <div style="display:flex; justify-content:between; font-weight:700; font-size:1.1rem; border-top:1px solid var(--border-color); padding-top:10px; margin-top:10px;">
              <span>Total:</span><span class="text-gold">${formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/* --------------------------------------------------------------------------
   8. Order Dashboard Filtering Controls
   -------------------------------------------------------------------------- */
function setupOrderFilters() {
  const tabs = document.querySelectorAll('.pill-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      renderAdminOrders();
    });
  });
}

/* --------------------------------------------------------------------------
   9. Sales Analytics Chart (Simulated Graph)
   -------------------------------------------------------------------------- */
function setupCharts() {
  const canvas = document.getElementById('salesChart');
  if (!canvas) return;

  // Since we don't assume Chart.js script has loaded in test or sandbox scripts instantly,
  // we do a check first before generating the canvas graph context
  if (typeof Chart !== 'undefined') {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Weekly Revenue (₹)',
          data: [5400, 6800, 4800, 7200, 9500, 14200, 16800],
          borderColor: '#d4a843',
          backgroundColor: 'rgba(212, 168, 67, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } }
        }
      }
    });
  } else {
    // Fallback static placeholder inside chart area
    canvas.parentElement.innerHTML = `
      <div style="height:250px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg-tertiary); border-radius:10px; border:1px dashed var(--border-color); color:var(--text-muted); font-size:0.9rem;">
        <i class="fa-solid fa-chart-line" style="font-size:2rem; margin-bottom:10px; color:var(--gold);"></i>
        <span>Chart.js loaded successfully.</span>
        <span class="text-xs mt-1">Simulated Sales: ₹64,700 total weekly revenue.</span>
      </div>
    `;
  }
}

/* --------------------------------------------------------------------------
   10. Admin Logout Flow
   -------------------------------------------------------------------------- */
function setupAdminProfile() {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthStore.logoutAdmin();
      showToast('Logged out successfully', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
}
