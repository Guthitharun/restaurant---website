/* ==========================================================================
   APP.JS — Core Application Logic
   ADHIRATHA Family Restaurant
   Navigation, Dark Mode, Floating Buttons, Toast, Cart State, Utilities
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. DOM Ready
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initFloatingButtons();
  initOfferBar();
  initHeroParticles();
  initAOS();
  updateCartBadge();
});

/* --------------------------------------------------------------------------
   2. Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on link click (mobile)
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggle.classList.remove('active');
          links.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Set active nav link based on current page
  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Effects
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.float-btn-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar scroll effect
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll to top button
    if (scrollTopBtn) {
      if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  // Scroll to top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Floating Buttons
   -------------------------------------------------------------------------- */
function initFloatingButtons() {
  // WhatsApp button already has href, no JS needed
  // Call button already has href, no JS needed
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'fadeOut 0.4s ease forwards';
      setTimeout(() => toast.remove(), 400);
    }
  }, duration);
}

/* --------------------------------------------------------------------------
   6. Cart State Management (localStorage)
   -------------------------------------------------------------------------- */
const CartStore = {
  KEY: 'adhiratha_cart',

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    updateCartBadge();
  },

  addItem(itemId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: itemId, qty });
    }
    this.saveCart(cart);
    const item = getItemById(itemId);
    if (item) {
      showToast(`${item.name} added to cart!`, 'success');
    }
  },

  removeItem(itemId) {
    let cart = this.getCart();
    cart = cart.filter(c => c.id !== itemId);
    this.saveCart(cart);
    showToast('Item removed from cart', 'info');
  },

  updateQty(itemId, qty) {
    const cart = this.getCart();
    const item = cart.find(c => c.id === itemId);
    if (item) {
      if (qty <= 0) {
        this.removeItem(itemId);
        return;
      }
      item.qty = qty;
      this.saveCart(cart);
    }
  },

  getItemQty(itemId) {
    const cart = this.getCart();
    const item = cart.find(c => c.id === itemId);
    return item ? item.qty : 0;
  },

  getTotalItems() {
    return this.getCart().reduce((sum, item) => sum + item.qty, 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((sum, cartItem) => {
      const menuItem = getItemById(cartItem.id);
      return sum + (menuItem ? menuItem.price * cartItem.qty : 0);
    }, 0);
  },

  clearCart() {
    localStorage.removeItem(this.KEY);
    updateCartBadge();
  }
};

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = CartStore.getTotalItems();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.setAttribute('data-count', count);
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* --------------------------------------------------------------------------
   7. Order Management (localStorage)
   -------------------------------------------------------------------------- */
const OrderStore = {
  KEY: 'adhiratha_orders',

  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  saveOrders(orders) {
    localStorage.setItem(this.KEY, JSON.stringify(orders));
  },

  addOrder(order) {
    const orders = this.getOrders();
    order.id = 'ADH' + Date.now().toString(36).toUpperCase();
    order.date = new Date().toISOString();
    order.status = 'pending';
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  updateStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveOrders(orders);
    }
  },

  getOrdersByStatus(status) {
    if (status === 'all') return this.getOrders();
    return this.getOrders().filter(o => o.status === status);
  },

  getTodaysOrders() {
    const today = new Date().toDateString();
    return this.getOrders().filter(o => new Date(o.date).toDateString() === today);
  },

  getTodaysRevenue() {
    return this.getTodaysOrders()
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }
};

/* --------------------------------------------------------------------------
   8. Reservation Management (localStorage)
   -------------------------------------------------------------------------- */
const ReservationStore = {
  KEY: 'adhiratha_reservations',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  save(reservations) {
    localStorage.setItem(this.KEY, JSON.stringify(reservations));
  },

  add(reservation) {
    const all = this.getAll();
    reservation.id = 'RES' + Date.now().toString(36).toUpperCase();
    reservation.date_created = new Date().toISOString();
    reservation.status = 'confirmed';
    all.unshift(reservation);
    this.save(all);
    return reservation;
  }
};

/* --------------------------------------------------------------------------
   9. User Auth (localStorage - Phase 1)
   -------------------------------------------------------------------------- */
const AuthStore = {
  USER_KEY: 'adhiratha_user',
  ADMIN_KEY: 'adhiratha_admin',

  // Customer auth
  registerUser(user) {
    const users = this.getAllUsers();
    if (users.find(u => u.phone === user.phone)) {
      return { success: false, message: 'Phone number already registered' };
    }
    user.id = 'USR' + Date.now().toString(36).toUpperCase();
    user.created = new Date().toISOString();
    users.push(user);
    localStorage.setItem('adhiratha_users', JSON.stringify(users));
    this.setCurrentUser(user);
    return { success: true, user };
  },

  loginUser(phone, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid phone or password' };
  },

  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('adhiratha_users')) || [];
    } catch {
      return [];
    }
  },

  setCurrentUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY));
    } catch {
      return null;
    }
  },

  logoutUser() {
    localStorage.removeItem(this.USER_KEY);
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  // Admin auth
  loginAdmin(username, password) {
    // Default admin credentials (Phase 1)
    if (username === 'admin' && password === 'adhiratha2024') {
      const admin = { username: 'admin', role: 'owner', name: 'Admin' };
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
      return { success: true, admin };
    }
    return { success: false, message: 'Invalid admin credentials' };
  },

  getCurrentAdmin() {
    try {
      return JSON.parse(localStorage.getItem(this.ADMIN_KEY));
    } catch {
      return null;
    }
  },

  isAdminLoggedIn() {
    return !!this.getCurrentAdmin();
  },

  logoutAdmin() {
    localStorage.removeItem(this.ADMIN_KEY);
  }
};

/* --------------------------------------------------------------------------
   10. Review Management (localStorage)
   -------------------------------------------------------------------------- */
const ReviewStore = {
  KEY: 'adhiratha_reviews',

  getAll() {
    try {
      const custom = JSON.parse(localStorage.getItem(this.KEY)) || [];
      return [...SAMPLE_REVIEWS, ...custom];
    } catch {
      return [...SAMPLE_REVIEWS];
    }
  },

  add(review) {
    const custom = JSON.parse(localStorage.getItem(this.KEY)) || [];
    review.id = 'REV' + Date.now();
    review.date = new Date().toISOString().split('T')[0];
    custom.push(review);
    localStorage.setItem(this.KEY, JSON.stringify(custom));
    return review;
  },

  getAverage() {
    const all = this.getAll();
    if (all.length === 0) return 0;
    return (all.reduce((sum, r) => sum + r.rating, 0) / all.length).toFixed(1);
  }
};

/* --------------------------------------------------------------------------
   11. Offer Bar Marquee
   -------------------------------------------------------------------------- */
function initOfferBar() {
  const bar = document.querySelector('.offer-bar-content');
  if (!bar) return;
  // Clone for seamless loop
  bar.innerHTML += bar.innerHTML;
}

/* --------------------------------------------------------------------------
   12. Hero Particles
   -------------------------------------------------------------------------- */
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

/* --------------------------------------------------------------------------
   13. AOS (Animate on Scroll) - Lightweight Implementation
   -------------------------------------------------------------------------- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const animation = el.getAttribute('data-aos');
        const delay = el.getAttribute('data-aos-delay') || 0;

        setTimeout(() => {
          el.classList.add('aos-animate');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, parseInt(delay));

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    // Set initial state based on animation type
    el.style.opacity = '0';
    el.style.transition = `all 0.6s ease ${(parseInt(el.getAttribute('data-aos-delay')) || 0)}ms`;

    const animation = el.getAttribute('data-aos');
    switch (animation) {
      case 'fade-up':
        el.style.transform = 'translateY(30px)';
        break;
      case 'fade-down':
        el.style.transform = 'translateY(-30px)';
        break;
      case 'fade-left':
        el.style.transform = 'translateX(30px)';
        break;
      case 'fade-right':
        el.style.transform = 'translateX(-30px)';
        break;
      case 'zoom-in':
        el.style.transform = 'scale(0.9)';
        break;
      default:
        break;
    }

    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   14. Utility Functions
   -------------------------------------------------------------------------- */
function formatPrice(amount) {
  return RESTAURANT.currency + amount.toLocaleString('en-IN');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateOrderId() {
  return 'ADH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function generateWhatsAppLink(message) {
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;
}

function generateCallLink(phone) {
  return `tel:+91${phone}`;
}

/* Debounce utility */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* Render star rating HTML */
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fa-solid fa-star ${i > rating ? 'empty' : ''}"></i>`;
  }
  return html;
}

/* Get image source with fallback */
function getItemImage(item) {
  // Always use placeholder image without external URLs
  const cat = CATEGORIES.find(c => c.id === item.category);
  return getFoodPlaceholder(item.name, cat ? cat.emoji : '🍽️');
}

/* Copy text to clipboard */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Copied to clipboard!', 'success');
  });
}

/* Smooth scroll to element */
function scrollToElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
