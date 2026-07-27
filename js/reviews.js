/* ==========================================================================
   REVIEWS.JS — Customer Reviews & Ratings Form Script
   ADHIRATHA Family Restaurant
   List ratings rendering, new submissions processing, averages calculations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('reviews-page-container')) return;

  initReviewsPage();
});

/* --------------------------------------------------------------------------
   1. Initialize Reviews Page
   -------------------------------------------------------------------------- */
function initReviewsPage() {
  renderReviewsSummary();
  renderReviewsList();
  setupReviewsForm();
}

/* --------------------------------------------------------------------------
   2. Render Aggregate Reviews Statistics
   -------------------------------------------------------------------------- */
function renderReviewsSummary() {
  const allReviews = ReviewStore.getAll();
  const average = ReviewStore.getAverage();

  const scoreEl = document.getElementById('reviews-avg-score');
  const starsEl = document.getElementById('reviews-avg-stars');
  const countEl = document.getElementById('reviews-total-count');

  if (scoreEl) scoreEl.textContent = average;
  if (starsEl) starsEl.innerHTML = renderStars(Math.round(average));
  if (countEl) countEl.textContent = `Based on ${allReviews.length} reviews`;

  // Draw progress bars breakdown
  const barsContainer = document.getElementById('reviews-star-breakdown');
  if (barsContainer) {
    let breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => {
      if (breakdown[r.rating] !== undefined) breakdown[r.rating]++;
    });

    let barsHTML = '';
    for (let stars = 5; stars >= 1; stars--) {
      const count = breakdown[stars];
      const percent = allReviews.length > 0 ? Math.round((count / allReviews.length) * 100) : 0;
      barsHTML += `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px; font-size:0.85rem;">
          <span style="width:50px; text-align:right;">${stars} Stars</span>
          <div style="flex:1; height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden;">
            <div style="width:${percent}%; height:100%; background:var(--gold-gradient); border-radius:4px;"></div>
          </div>
          <span style="width:40px; color:var(--text-muted);">${percent}%</span>
        </div>
      `;
    }
    barsContainer.innerHTML = barsHTML;
  }
}

/* --------------------------------------------------------------------------
   3. Render List of Customer Reviews
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   4. Setup Review Form Submit & Interactive Elements
   -------------------------------------------------------------------------- */
function setupReviewsForm() {
  const form = document.getElementById('reviews-form');
  if (!form) return;

  // Auto-fill user name if logged in
  const currentUser = AuthStore.getCurrentUser();
  if (currentUser) {
    const nameInput = document.getElementById('review-name');
    if (nameInput) nameInput.value = currentUser.name;
  }

  // Populate Dish Selector
  const itemSelect = document.getElementById('review-item');
  if (itemSelect && typeof window.MENU_DATA !== 'undefined') {
    // Flatten menu items
    const allItems = [];
    window.MENU_DATA.forEach(cat => {
      cat.items.forEach(item => allItems.push(item));
    });
    // Sort alphabetically
    allItems.sort((a,b) => a.name.localeCompare(b.name));
    
    allItems.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.name;
      opt.textContent = item.name;
      itemSelect.appendChild(opt);
    });
  }

  // Interactive Stars Logic
  const starIcons = document.querySelectorAll('.interactive-stars i');
  const ratingInput = document.getElementById('review-rating-val');

  starIcons.forEach(star => {
    star.addEventListener('mouseenter', function() {
      const val = parseInt(this.getAttribute('data-val'));
      starIcons.forEach(s => {
        if (parseInt(s.getAttribute('data-val')) <= val) {
          s.classList.add('hovered');
        } else {
          s.classList.remove('hovered');
        }
      });
    });

    star.addEventListener('mouseleave', function() {
      starIcons.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', function() {
      const val = parseInt(this.getAttribute('data-val'));
      ratingInput.value = val;
      starIcons.forEach(s => {
        if (parseInt(s.getAttribute('data-val')) <= val) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('review-name').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    const ratingVal = ratingInput.value;
    const dishName = itemSelect ? itemSelect.value : 'Overall Experience';

    if (name === '') {
      showToast('Please enter your name', 'error');
      return;
    }

    if (!ratingVal) {
      showToast('Please select a star rating', 'error');
      return;
    }

    if (comment === '') {
      showToast('Please leave a comment', 'error');
      return;
    }

    const rating = parseInt(ratingVal);

    // Save to local storage reviews store
    ReviewStore.add({
      name,
      rating,
      comment,
      dish: dishName,
      avatar: name.substring(0, 2).toUpperCase()
    });

    // Reset Form
    form.reset();
    ratingInput.value = '';
    starIcons.forEach(s => s.classList.remove('selected', 'hovered'));
    if (currentUser) {
      document.getElementById('review-name').value = currentUser.name;
    }

    // Refresh display
    renderReviewsSummary();
    renderReviewsList();

    showToast('Thank you for your valuable feedback!', 'success');
  });
}

// Override renderReviewsList to show dish name
function renderReviewsList() {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;

  const reviews = ReviewStore.getAll();
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reviews.length === 0) {
    container.innerHTML = `<p class="text-muted text-center py-4">No reviews yet. Be the first to share your experience!</p>`;
    return;
  }

  let html = '';
  reviews.forEach(r => {
    const dishTag = r.dish && r.dish !== 'Overall Experience' 
      ? `<span style="display:inline-block; background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.3); color:var(--gold); padding:2px 8px; border-radius:100px; font-size:0.75rem; margin-top:4px;"><i class="fa-solid fa-utensils"></i> ${r.dish}</span>` 
      : '';

    html += `
      <div class="review-card animate-fade-up" style="margin-bottom:15px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(10px);">
        <div class="review-header">
          <div class="review-avatar" style="background:var(--gold-gradient); color:#000;">${r.avatar || r.name.substring(0, 2).toUpperCase()}</div>
          <div style="flex:1;">
            <h4 class="review-name" style="color:#fff;">${r.name}</h4>
            <span class="review-date">${formatDate(r.date)}</span>
            <div style="margin-top:2px;">${dishTag}</div>
          </div>
          <div class="review-stars">${renderStars(r.rating)}</div>
        </div>
        <p class="review-text" style="color:var(--text-secondary); margin-top:12px;">${r.comment}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}
