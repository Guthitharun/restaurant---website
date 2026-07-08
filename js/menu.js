/* ==========================================================================
   MENU.JS — Menu Page Interactive Features
   ADHIRATHA Family Restaurant
   Search, Category Filtering, Veg/Non-Veg Toggles, List/Grid View, Sort
   ========================================================================== */

let currentCategory = 'all';
let searchQuery = '';
let foodTypeFilter = 'all'; // 'all', 'veg', 'nonveg'
let activeSort = 'default'; // 'default', 'price-low', 'price-high'
let currentView = 'grid'; // 'grid', 'list'

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('menu-page-container')) return;

  initMenuPage();
});

/* --------------------------------------------------------------------------
   1. Initialize Menu Page
   -------------------------------------------------------------------------- */
function initMenuPage() {
  renderSidebarCategories();
  renderHorizontalCategories();
  renderMenuItems();
  setupSearchInput();
  setupFilterToggles();
  setupSortSelect();
  setupViewToggle();
  
  // Check if a category query param exists in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    setActiveCategory(categoryParam);
  }
}

/* --------------------------------------------------------------------------
   2. Render Categories Sidebar
   -------------------------------------------------------------------------- */
function renderSidebarCategories() {
  const sidebar = document.getElementById('menu-sidebar-list');
  if (!sidebar) return;

  let html = `
    <a class="sidebar-link active" data-category="all">
      <i class="fa-solid fa-utensils"></i>
      <span>All Categories</span>
      <span class="sidebar-link-count">${MENU_ITEMS.length}</span>
    </a>
  `;

  CATEGORIES.forEach(cat => {
    const count = getItemsByCategory(cat.id).length;
    html += `
      <a class="sidebar-link" data-category="${cat.id}">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
        <span class="sidebar-link-count">${count}</span>
      </a>
    `;
  });

  sidebar.innerHTML = html;

  // Add click events to links
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catId = link.getAttribute('data-category');
      setActiveCategory(catId);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Render Categories Horizontal (for Mobile view)
   -------------------------------------------------------------------------- */
function renderHorizontalCategories() {
  const tabContainer = document.getElementById('menu-category-tabs');
  if (!tabContainer) return;

  let html = `
    <button class="category-tab active" data-category="all">
      🍽️ All
    </button>
  `;

  CATEGORIES.forEach(cat => {
    html += `
      <button class="category-tab" data-category="${cat.id}">
        ${cat.emoji} ${cat.name}
      </button>
    `;
  });

  tabContainer.innerHTML = html;

  // Add click events to buttons
  tabContainer.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const catId = tab.getAttribute('data-category');
      setActiveCategory(catId);
    });
  });
}

/* --------------------------------------------------------------------------
   4. Set Active Category (Sync Sidebar and Tabs)
   -------------------------------------------------------------------------- */
function setActiveCategory(catId) {
  currentCategory = catId;

  // Sync Sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('data-category') === catId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sync Tabs
  const categoryTabs = document.querySelectorAll('.category-tab');
  categoryTabs.forEach(tab => {
    if (tab.getAttribute('data-category') === catId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Re-render items with active category
  renderMenuItems();

  // Scroll to menu grid container on mobile view
  if (window.innerWidth <= 768) {
    scrollToElement('#menu-results-section');
  }
}

/* --------------------------------------------------------------------------
   5. Search Logic
   -------------------------------------------------------------------------- */
function setupSearchInput() {
  const searchInput = document.getElementById('menu-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', debounce((e) => {
    searchQuery = e.target.value;
    renderMenuItems();
  }, 300));
}

/* --------------------------------------------------------------------------
   6. Veg/Non-Veg Filter Logic
   -------------------------------------------------------------------------- */
function setupFilterToggles() {
  const btns = document.querySelectorAll('.filter-toggle-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      foodTypeFilter = btn.getAttribute('data-filter');
      renderMenuItems();
    });
  });
}

/* --------------------------------------------------------------------------
   7. Sort Logic
   -------------------------------------------------------------------------- */
function setupSortSelect() {
  const select = document.getElementById('menu-sort-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderMenuItems();
  });
}

/* --------------------------------------------------------------------------
   8. View Toggle (Grid vs List)
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   9. Render Filtered, Sorted and Searched Menu Items
   -------------------------------------------------------------------------- */
function renderMenuItems() {
  const container = document.getElementById('menu-items-container');
  if (!container) return;

  // Filter Items
  let items = MENU_ITEMS;

  // Filter by Category
  if (currentCategory !== 'all') {
    items = items.filter(item => item.category === currentCategory);
  }

  // Filter by Search Query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q)
    );
  }

  // Filter by Veg/Non-Veg
  if (foodTypeFilter === 'veg') {
    items = items.filter(item => item.isVeg);
  } else if (foodTypeFilter === 'nonveg') {
    items = items.filter(item => !item.isVeg);
  }

  // Sort Items
  if (activeSort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  }

  // Update Results Info
  const resultsCount = document.getElementById('menu-results-count-value');
  if (resultsCount) {
    resultsCount.textContent = `${items.length} dishes found`;
  }

  // Render No Results if empty
  if (items.length === 0) {
    container.innerHTML = `
      <div class="no-results animate-fade-in" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>No items match your criteria</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    `;
    return;
  }

  // Render HTML based on view
  let html = '';
  if (currentView === 'grid') {
    container.className = 'food-grid animate-fade-in';
    items.forEach(item => {
      html += renderGridItem(item);
    });
  } else {
    container.className = 'menu-list-container animate-fade-in';
    items.forEach(item => {
      html += renderListItem(item);
    });
  }

  container.innerHTML = html;

  // Bind Actions (Add to Cart, Qty Controls)
  bindCardActions(container);
}

/* --------------------------------------------------------------------------
   10. Item Templates (Grid)
   -------------------------------------------------------------------------- */
function renderGridItem(item) {
  const inCartQty = CartStore.getItemQty(item.id);
  const isVegClass = item.isVeg ? 'veg' : 'nonveg';
  const labelBadge = item.isBestseller ? '<span class="card-badge badge-bestseller">Bestseller</span>' : 
                     (item.isPopular ? '<span class="card-badge badge-popular">Popular</span>' : '');

  let cartActionHTML = '';
  if (inCartQty > 0) {
    cartActionHTML = `
      <div class="qty-control" data-item-id="${item.id}">
        <button class="qty-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
        <span class="qty-value">${inCartQty}</span>
        <button class="qty-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
      </div>
    `;
  } else {
    cartActionHTML = `
      <button class="add-to-cart-btn btn-add" data-item-id="${item.id}">
        <i class="fa-solid fa-plus"></i> Add
      </button>
    `;
  }

  return `
    <div class="food-card animate-scale" data-item-id="${item.id}">
      <div class="food-card-img">
        <img src="${getItemImage(item)}" alt="${item.name}">
        ${labelBadge}
        <div class="food-card-overlay">
          <div class="veg-indicator">
            <span class="veg-dot ${isVegClass}"></span>
            <span style="color:white; font-weight:600;">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>
        </div>
      </div>
      <div class="food-card-body">
        <div class="food-card-header">
          <h3 class="food-card-name">${item.name}</h3>
          <span class="veg-dot ${isVegClass}"></span>
        </div>
        <p class="food-card-desc">${item.description}</p>
        <div class="food-card-bottom">
          <span class="food-card-price">${formatPrice(item.price)}</span>
          <div class="action-wrapper">
            ${cartActionHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   11. Item Templates (List)
   -------------------------------------------------------------------------- */
function renderListItem(item) {
  const inCartQty = CartStore.getItemQty(item.id);
  const isVegClass = item.isVeg ? 'veg' : 'nonveg';
  const labelBadge = item.isBestseller ? '<span class="card-badge badge-bestseller btn-sm" style="position:static; margin-right:8px;">Bestseller</span>' : 
                     (item.isPopular ? '<span class="card-badge badge-popular btn-sm" style="position:static; margin-right:8px;">Popular</span>' : '');

  let cartActionHTML = '';
  if (inCartQty > 0) {
    cartActionHTML = `
      <div class="qty-control" data-item-id="${item.id}">
        <button class="qty-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
        <span class="qty-value">${inCartQty}</span>
        <button class="qty-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
      </div>
    `;
  } else {
    cartActionHTML = `
      <button class="add-to-cart-btn btn-add" data-item-id="${item.id}">
        <i class="fa-solid fa-plus"></i> Add to Cart
      </button>
    `;
  }

  return `
    <div class="menu-list-item animate-fade-up" data-item-id="${item.id}">
      <img src="${getItemImage(item)}" alt="${item.name}" class="menu-list-img">
      <div class="menu-list-details">
        <h3 class="menu-list-name">
          ${item.name} 
          <span class="veg-dot ${isVegClass}" style="margin-left:5px;"></span>
          ${labelBadge}
        </h3>
        <p class="menu-list-desc">${item.description}</p>
        <div class="menu-list-bottom">
          <span class="menu-list-price">${formatPrice(item.price)}</span>
          <div class="action-wrapper">
            ${cartActionHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   12. Bind Add to Cart / Quantity Operations
   -------------------------------------------------------------------------- */
function bindCardActions(container) {
  // Bind Add Buttons
  container.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-item-id'));
      CartStore.addItem(id, 1);
      renderMenuItems(); // Update UI
    });
  });

  // Bind Plus Buttons
  container.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const control = btn.parentElement;
      const id = parseInt(control.getAttribute('data-item-id'));
      const newQty = CartStore.getItemQty(id) + 1;
      CartStore.updateQty(id, newQty);
      renderMenuItems();
    });
  });

  // Bind Minus Buttons
  container.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const control = btn.parentElement;
      const id = parseInt(control.getAttribute('data-item-id'));
      const newQty = CartStore.getItemQty(id) - 1;
      CartStore.updateQty(id, newQty);
      renderMenuItems();
    });
  });
}
