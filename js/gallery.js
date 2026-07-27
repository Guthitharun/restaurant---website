/* ==========================================================================
   GALLERY.JS — Lightbox & Gallery Interactions
   ADHIRATHA Family Restaurant
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

function initGallery() {
  buildLightbox();
  bindGalleryItems();
}

/* --------------------------------------------------------------------------
   Build Lightbox DOM
   -------------------------------------------------------------------------- */
function buildLightbox() {
  if (document.getElementById('gallery-lightbox')) return;

  const lb = document.createElement('div');
  lb.id = 'gallery-lightbox';
  lb.className = 'gallery-lightbox';
  lb.innerHTML = `
    <div class="lightbox-overlay" id="lb-overlay"></div>
    <div class="lightbox-box" id="lb-box">
      <button class="lightbox-close" id="lb-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button class="lightbox-nav lb-prev" id="lb-prev" aria-label="Previous">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <img src="" alt="" class="lightbox-img" id="lb-img">
      <div class="lightbox-caption" id="lb-caption"></div>
      <button class="lightbox-nav lb-next" id="lb-next" aria-label="Next">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
  document.body.appendChild(lb);

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-overlay').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lb-next').addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('gallery-lightbox');
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

let galleryItems = [];
let currentIndex = 0;

function bindGalleryItems() {
  const items = document.querySelectorAll('[data-gallery-src]');
  galleryItems = Array.from(items);

  galleryItems.forEach((el, idx) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openLightbox(idx));
  });
}

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('gallery-lightbox');
  if (!lb) return;

  updateLightboxImage();
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('gallery-lightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const item = galleryItems[currentIndex];
  if (!item) return;
  const src = item.getAttribute('data-gallery-src') || item.src || item.style.backgroundImage;
  const caption = item.getAttribute('data-gallery-caption') || item.alt || '';

  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');

  if (img) {
    img.style.opacity = 0;
    img.src = src;
    img.onload = () => {
      img.style.opacity = 1;
    };
  }
  if (cap) cap.textContent = caption;
}
