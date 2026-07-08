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
function renderReviewsList() {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;

  const reviews = ReviewStore.getAll();
  
  // Sort reviews by date descending (Newest first)
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reviews.length === 0) {
    container.innerHTML = `<p class="text-muted text-center py-4">No reviews yet. Be the first to share your experience!</p>`;
    return;
  }

  let html = '';
  reviews.forEach(r => {
    html += `
      <div class="review-card animate-fade-up" style="margin-bottom:15px;">
        <div class="review-header">
          <div class="review-avatar">${r.avatar || r.name.substring(0, 2).toUpperCase()}</div>
          <div style="flex:1;">
            <h4 class="review-name">${r.name}</h4>
            <span class="review-date">${formatDate(r.date)}</span>
          </div>
          <div class="review-stars">${renderStars(r.rating)}</div>
        </div>
        <p class="review-text">${r.comment}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* --------------------------------------------------------------------------
   4. Setup Review Form Submit
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('review-name').value.trim();
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const comment = document.getElementById('review-comment').value.trim();

    if (name === '') {
      showToast('Please enter your name', 'error');
      return;
    }

    if (!ratingInput) {
      showToast('Please select a star rating', 'error');
      return;
    }

    if (comment === '') {
      showToast('Please leave a comment', 'error');
      return;
    }

    const rating = parseInt(ratingInput.value);

    // Save to local storage reviews store
    ReviewStore.add({
      name,
      rating,
      comment,
      avatar: name.substring(0, 2).toUpperCase()
    });

    // Reset Form
    form.reset();
    if (currentUser) {
      document.getElementById('review-name').value = currentUser.name;
    }

    // Refresh display
    renderReviewsSummary();
    renderReviewsList();

    showToast('Thank you for your valuable feedback!', 'success');
  });
}
