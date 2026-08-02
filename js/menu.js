/* ==========================================================================
   MENU.JS — ADHIRATHA Family Restaurant
   Direct-to-Restaurant Ordering via WhatsApp / Phone
   No login required. Customer selects items → Order sent directly to restaurant.
   ========================================================================== */

/* -------------------------------------------------------------------------
   State
   ------------------------------------------------------------------------- */
let currentCategory  = 'all';
let searchQuery      = '';
let foodTypeFilter   = 'all';
let activeSort       = 'default';
let currentView      = 'grid';

// Live order basket (in-memory, no localStorage required)
// Live order basket is now managed by CartStore (localStorage) via app.js

/* -------------------------------------------------------------------------
   1. Boot
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('menu-page-container')) return;
  buildSidebar();
  buildCategoryTabs();
  renderMenuItems();
  setupSearch();
  setupFilters();
  setupSortSelect();
  setupViewToggle();
  renderBasketPanel();
});

/* -------------------------------------------------------------------------
   2. Sidebar (desktop)
   ------------------------------------------------------------------------- */
function buildSidebar() {
  const list = document.getElementById('menu-sidebar-list');
  if (!list) return;

  let html = `<button class="sidebar-cat active" data-cat="all">
                <i class="fa-solid fa-border-all"></i> All Items
              </button>`;

  CATEGORIES.forEach(cat => {
    html += `<button class="sidebar-cat" data-cat="${cat.id}">
               <span class="cat-emoji">${cat.emoji}</span> ${cat.name}
             </button>`;
  });

  list.innerHTML = html;

  list.querySelectorAll('.sidebar-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      list.querySelectorAll('.sidebar-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat');
      syncCategoryTabs();
      renderMenuItems();
    });
  });
}

/* -------------------------------------------------------------------------
   3. Category Tabs (mobile)
   ------------------------------------------------------------------------- */
function buildCategoryTabs() {
  const tabs = document.getElementById('menu-category-tabs');
  if (!tabs) return;

  let html = `<button class="cat-tab active" data-cat="all">All</button>`;
  CATEGORIES.forEach(cat => {
    html += `<button class="cat-tab" data-cat="${cat.id}">${cat.emoji} ${cat.name}</button>`;
  });

  tabs.innerHTML = html;

  tabs.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat');
      syncSidebar();
      renderMenuItems();
    });
  });
}

function syncCategoryTabs() {
  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === currentCategory);
  });
}

function syncSidebar() {
  document.querySelectorAll('.sidebar-cat').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === currentCategory);
  });
}

/* -------------------------------------------------------------------------
   4. Search
   ------------------------------------------------------------------------- */
function setupSearch() {
  const input = document.getElementById('menu-search-input');
  if (!input) return;
  input.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderMenuItems();
  });
}

/* -------------------------------------------------------------------------
   5. Veg / Non-veg filters
   ------------------------------------------------------------------------- */
function setupFilters() {
  document.querySelectorAll('.filter-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      foodTypeFilter = btn.getAttribute('data-filter');
      renderMenuItems();
    });
  });
}

/* -------------------------------------------------------------------------
   6. Sort
   ------------------------------------------------------------------------- */
function setupSortSelect() {
  const select = document.getElementById('menu-sort-select');
  if (!select) return;
  select.addEventListener('change', e => {
    activeSort = e.target.value;
    renderMenuItems();
  });
}

/* -------------------------------------------------------------------------
   7. View toggle (grid/list)
   ------------------------------------------------------------------------- */
function setupViewToggle() {
  const btns = document.querySelectorAll('.view-toggle-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.getAttribute('data-view');
      renderMenuItems();
    });
  });
}

/* -------------------------------------------------------------------------
   8. Render menu items
   ------------------------------------------------------------------------- */
function renderMenuItems() {
  const container = document.getElementById('menu-items-container');
  if (!container) return;

  let items = [...MENU_ITEMS];

  if (currentCategory !== 'all') {
    items = items.filter(item => item.category === currentCategory);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }

  if (foodTypeFilter === 'veg') {
    items = items.filter(item => item.isVeg);
  } else if (foodTypeFilter === 'nonveg') {
    items = items.filter(item => !item.isVeg);
  }

  if (activeSort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  }

  const resultsCount = document.getElementById('menu-results-count-value');
  if (resultsCount) {
    resultsCount.textContent = `${items.length} dishes found`;
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="no-results animate-fade-in" style="grid-column:1/-1;">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>No items match your criteria</h3>
        <p>Try adjusting your search or filters</p>
      </div>`;
    return;
  }

  let html = '';
  if (currentView === 'grid') {
    container.className = 'food-grid animate-fade-in';
    items.forEach(item => { html += renderGridItem(item); });
  } else {
    container.className = 'menu-list-container animate-fade-in';
    items.forEach(item => { html += renderListItem(item); });
  }

  container.innerHTML = html;
  bindCardActions(container);
}

/* -------------------------------------------------------------------------
   9. Item template — Grid view
   ------------------------------------------------------------------------- */
function renderGridItem(item) {
  const qty        = CartStore.getItemQty(item.id);
  const isVegClass = item.isVeg ? 'veg' : 'nonveg';
  
  // Premium badging
  let badge = '';
  if (item.isBestseller) {
    badge = '<span class="badge-bestseller-pill" style="position:absolute; top:12px; right:12px; z-index:10;"><i class="fa-solid fa-crown"></i> Bestseller</span>';
  } else if (item.isPopular) {
    badge = '<span class="badge-chefs-pick" style="position:absolute; top:12px; right:12px; z-index:10;"><i class="fa-solid fa-fire"></i> Popular</span>';
  }

  const actionBtn = qty > 0
    ? `<div class="qty-control" data-item-id="${item.id}" style="border:1px solid rgba(212,168,67,0.4); background:rgba(212,168,67,0.1); border-radius:8px;">
         <button class="qty-btn minus-btn" style="color:var(--gold);"><i class="fa-solid fa-minus"></i></button>
         <span class="qty-value" style="color:#fff;">${qty}</span>
         <button class="qty-btn plus-btn" style="color:var(--gold);"><i class="fa-solid fa-plus"></i></button>
       </div>`
    : `<button class="add-to-cart-btn btn-add" data-item-id="${item.id}" style="background:linear-gradient(135deg, #d4a843 0%, #f5c518 100%); color:#000; border:none; border-radius:20px; padding:8px 18px; font-weight:700; font-family:var(--font-accent); box-shadow:0 4px 15px rgba(212,168,67,0.4); cursor:pointer; transition:all 0.3s ease;">
         <i class="fa-solid fa-plus"></i> Add
       </button>`;

  /* Image or Emoji for the card */
  const cat   = CATEGORIES.find(c => c.id === item.category);
  const emoji = cat ? cat.emoji : '🍽️';

  const safeName = item.name.replace(/'/g, "\\'");
  const imageHTML = item.image 
    ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" loading="lazy" onerror="this.onerror=null; this.src=getFoodPlaceholder('${safeName}', '${emoji}');">`
    : `<div class="card-emoji-display" style="font-size:4rem; filter:drop-shadow(0 10px 15px rgba(0,0,0,0.4));">${emoji}</div>`;

  // Generate fake rating (4.5 to 4.9)
  const fakeRating = (4.5 + Math.random() * 0.4).toFixed(1);
  const fakeReviewsCount = Math.floor(Math.random() * 200) + 50;

  return `
    <div class="food-card animate-scale" data-item-id="${item.id}" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(10px); overflow:hidden; position:relative; border-radius:20px;">
      ${badge}
      <div class="food-card-img ${item.image ? '' : 'menu-card-no-img'}" style="background:linear-gradient(135deg, rgba(212,168,67,0.1), rgba(255,255,255,0.02)); border-bottom:1px solid rgba(255,255,255,0.05); padding:0;">
        ${imageHTML}
        <div class="food-card-overlay">
          <div class="veg-indicator">
            <span class="veg-dot ${isVegClass}"></span>
            <span style="color:white;font-weight:600;">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>
        </div>
      </div>
      <div class="food-card-body" style="padding:20px;">
        <div class="food-card-header" style="margin-bottom:8px;">
          <h3 class="food-card-name" style="font-family:var(--font-heading); font-size:1.15rem; color:#fff;">${item.name}</h3>
          <span class="veg-dot ${isVegClass}"></span>
        </div>
        
        <div class="food-card-rating" style="margin-bottom:12px;">
          <div class="stars-row">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <span class="rating-count" style="color:var(--gold); font-weight:600;">${fakeRating}</span>
          <span class="rating-count">(${fakeReviewsCount})</span>
        </div>

        <p class="food-card-desc" style="color:var(--text-secondary); font-size:0.85rem; line-height:1.4; margin-bottom:16px;">${item.description}</p>
        
        <div class="food-card-bottom" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:16px;">
          <span class="food-card-price" style="font-size:1.25rem; font-weight:700; color:var(--gold);">₹${item.price}</span>
          <div class="action-wrapper">${actionBtn}</div>
        </div>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------
   10. Item template — List view
   ------------------------------------------------------------------------- */
function renderListItem(item) {
  const qty        = CartStore.getItemQty(item.id);
  const isVegClass = item.isVeg ? 'veg' : 'nonveg';
  const badge      = item.isBestseller
    ? '<span class="card-badge badge-bestseller btn-sm" style="position:static;margin-right:8px;">Bestseller</span>'
    : (item.isPopular ? '<span class="card-badge badge-popular btn-sm" style="position:static;margin-right:8px;">Popular</span>' : '');

  const actionBtn = qty > 0
    ? `<div class="qty-control" data-item-id="${item.id}" style="border:1px solid rgba(212,168,67,0.4); background:rgba(212,168,67,0.1); border-radius:8px;">
         <button class="qty-btn minus-btn" style="color:var(--gold);"><i class="fa-solid fa-minus"></i></button>
         <span class="qty-value" style="color:#fff;">${qty}</span>
         <button class="qty-btn plus-btn" style="color:var(--gold);"><i class="fa-solid fa-plus"></i></button>
       </div>`
    : `<button class="add-to-cart-btn btn-add" data-item-id="${item.id}" style="background:linear-gradient(135deg, #d4a843 0%, #f5c518 100%); color:#000; border:none; border-radius:20px; padding:8px 18px; font-weight:700; font-family:var(--font-accent); box-shadow:0 4px 15px rgba(212,168,67,0.4); cursor:pointer; transition:all 0.3s ease;">
         <i class="fa-solid fa-plus"></i> Add
       </button>`;

  const cat   = CATEGORIES.find(c => c.id === item.category);
  const emoji = cat ? cat.emoji : '🍽️';
  const safeName = item.name.replace(/'/g, "\\'");

  const imageBox = item.image 
    ? `<div class="menu-list-img-box" style="width:100px; height:100px; border-radius:12px; overflow:hidden; flex-shrink:0;"><img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src=getFoodPlaceholder('${safeName}', '${emoji}');"></div>`
    : `<div class="menu-list-emoji-box">${emoji}</div>`;

  return `
    <div class="menu-list-item animate-fade-up" data-item-id="${item.id}">
      ${imageBox}
      <div class="menu-list-details">
        <h3 class="menu-list-name">
          ${item.name}
          <span class="veg-dot ${isVegClass}" style="margin-left:5px;"></span>
          ${badge}
        </h3>
        <p class="menu-list-desc">${item.description}</p>
        <div class="menu-list-bottom">
          <span class="menu-list-price">₹${item.price}</span>
          <div class="action-wrapper">${actionBtn}</div>
        </div>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------
   11. Bind card actions
   ------------------------------------------------------------------------- */
function bindCardActions(container) {
  container.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-item-id'));
      CartStore.addItem(id, 1);
      renderMenuItems();
      updateBasketPanel();
      // showAddedToast(id); // handled by CartStore
    });
  });

  container.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.parentElement.getAttribute('data-item-id'));
      CartStore.addItem(id, 1);
      renderMenuItems();
      updateBasketPanel();
    });
  });

  container.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.parentElement.getAttribute('data-item-id'));
      CartStore.updateQty(id, CartStore.getItemQty(id) - 1);
      renderMenuItems();
      updateBasketPanel();
    });
  });
}

/* -------------------------------------------------------------------------
   12. Toast notification
   ------------------------------------------------------------------------- */
function showAddedToast(itemId) {
  const item = getItemById(itemId);
  if (!item) return;

  const existing = document.getElementById('menu-add-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'menu-add-toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <b>${item.name}</b> added to order!`;
  toast.style.cssText = `
    position:fixed; bottom:110px; left:50%; transform:translateX(-50%);
    background:linear-gradient(135deg,#d4a843,#f5c518);
    color:#000; padding:12px 24px; border-radius:30px;
    font-weight:600; font-size:0.9rem; z-index:9999;
    box-shadow:0 8px 30px rgba(212,168,67,0.5);
    animation:slideUp .3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

/* -------------------------------------------------------------------------
   13. Floating Basket Panel (sticky order summary)
   ------------------------------------------------------------------------- */
function renderBasketPanel() {
  // Remove old if exists
  const old = document.getElementById('basket-panel');
  if (old) old.remove();

  const panel = document.createElement('div');
  panel.id = 'basket-panel';
  panel.innerHTML = `
    <div id="basket-toggle" onclick="toggleBasket()">
      <i class="fa-solid fa-bag-shopping"></i>
      <span id="basket-count-badge">0</span>
      <span id="basket-toggle-label">Your Order</span>
      <span id="basket-toggle-total">₹0</span>
      <i class="fa-solid fa-chevron-up" id="basket-chevron"></i>
    </div>
    <div id="basket-body" class="basket-body-hidden">
      <div id="basket-items-list"></div>
      <div id="basket-summary"></div>
      <div id="basket-actions"></div>
    </div>`;

  document.body.appendChild(panel);
  updateBasketPanel();
}

function toggleBasket() {
  const body    = document.getElementById('basket-body');
  const chevron = document.getElementById('basket-chevron');
  body.classList.toggle('basket-body-hidden');
  chevron.style.transform = body.classList.contains('basket-body-hidden') ? '' : 'rotate(180deg)';
}

function updateBasketPanel() {
  const cart   = CartStore.getCart();
  const ids    = cart.map(c => c.id);
  const total  = CartStore.getSubtotal();
  const count  = CartStore.getTotalItems();

  // Update toggle bar
  const badge = document.getElementById('basket-count-badge');
  if (badge) badge.textContent = count;

  const toggleTotal = document.getElementById('basket-toggle-total');
  if (toggleTotal) toggleTotal.textContent = `₹${total}`;

  // Toggle bar visibility
  const panel = document.getElementById('basket-panel');
  if (panel) {
    panel.style.display = count > 0 ? 'block' : 'none';
  }

  // Basket body items
  const list = document.getElementById('basket-items-list');
  if (list) {
    if (ids.length === 0) {
      list.innerHTML = '<p class="basket-empty">No items selected yet</p>';
    } else {
      list.innerHTML = ids.map(id => {
        const item = getItemById(id);
        if (!item) return '';
        return `
          <div class="basket-row">
            <div class="basket-row-name">${item.name}</div>
            <div class="basket-row-qty">
              <button onclick="basketMinus(${id})"><i class="fa-solid fa-minus"></i></button>
              <span>${CartStore.getItemQty(id)}</span>
              <button onclick="basketPlus(${id})"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="basket-row-price">₹${item.price * CartStore.getItemQty(id)}</div>
          </div>`;
      }).join('');
    }
  }

  // Summary
  const summary = document.getElementById('basket-summary');
  if (summary && ids.length > 0) {
    summary.innerHTML = `
      <div class="basket-total-row">
        <span>Total (${count} items):</span>
        <span class="basket-grand-total">₹${total}</span>
      </div>`;
  } else if (summary) {
    summary.innerHTML = '';
  }

  // Action buttons
  const actions = document.getElementById('basket-actions');
  if (actions) {
    if (ids.length === 0) {
      actions.innerHTML = '';
    } else {
      actions.innerHTML = `
        <a href="checkout.html" class="btn-order-whatsapp" id="btn-checkout">
          <i class="fa-solid fa-arrow-right"></i> Proceed to Checkout
        </a>
        <button onclick="clearBasket()" class="btn-clear-order">
          <i class="fa-solid fa-trash"></i> Clear Order
        </button>`;
    }
  }
}

/* -------------------------------------------------------------------------
   14. Basket controls accessible from HTML onclick
   ------------------------------------------------------------------------- */
function basketPlus(id) {
  CartStore.addItem(id, 1);
  renderMenuItems();
  updateBasketPanel();
}

function basketMinus(id) {
  CartStore.updateQty(id, CartStore.getItemQty(id) - 1);
  renderMenuItems();
  updateBasketPanel();
}

function clearBasket() {
  CartStore.clearCart();
  renderMenuItems();
  updateBasketPanel();
  const body = document.getElementById('basket-body');
  if (body) body.classList.add('basket-body-hidden');
}

/* -------------------------------------------------------------------------
   15. Build WhatsApp order message
   ------------------------------------------------------------------------- */
function buildWhatsAppMessage() {
  const ids = Object.keys(basket).map(Number).filter(id => basket[id] > 0);
  let itemsText = '';
  let total = 0;

  ids.forEach(id => {
    const item = getItemById(id);
    if (!item) return;
    const subtotal = item.price * basket[id];
    total += subtotal;
    itemsText += `• ${item.name} x${basket[id]} = ₹${subtotal}\n`;
  });

  const count = ids.reduce((sum, id) => sum + basket[id], 0);

  const message =
    `🍽️ *NEW ORDER — ADHIRATHA FAMILY RESTAURANT*\n\n` +
    `*Items Ordered (${count} items):*\n${itemsText}\n` +
    `*TOTAL: ₹${total}*\n\n` +
    `Please confirm the order and estimated ready/delivery time. Thank you! 🙏`;

  return `https://wa.me/916301042993?text=${encodeURIComponent(message)}`;
}
