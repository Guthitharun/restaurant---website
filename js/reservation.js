/* ==========================================================================
   RESERVATION.JS — Table Reservation Page Script
   ADHIRATHA Family Restaurant
   Date picker limits, slot allocations, bookings submission, WhatsApp booking tags
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('reservation-page-container')) return;

  initReservationPage();
});

/* --------------------------------------------------------------------------
   1. Initialize Reservation Page
   -------------------------------------------------------------------------- */
function initReservationPage() {
  setDateLimits();
  setupReservationForm();
  renderPastReservations();
}

/* --------------------------------------------------------------------------
   2. Set Min/Max limits on Date Input (cannot book past dates)
   -------------------------------------------------------------------------- */
function setDateLimits() {
  const dateInput = document.getElementById('res-date');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  
  let mm = today.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;

  // Format today's date (YYYY-MM-DD)
  const minDate = `${yyyy}-${mm}-${dd}`;
  dateInput.min = minDate;

  // Set maximum booking date to 3 months from now
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxYear = maxDateObj.getFullYear();
  let maxMonth = maxDateObj.getMonth() + 1;
  if (maxMonth < 10) maxMonth = '0' + maxMonth;
  let maxDay = maxDateObj.getDate();
  if (maxDay < 10) maxDay = '0' + maxDay;
  const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;
  dateInput.max = maxDate;
}

/* --------------------------------------------------------------------------
   3. Table Booking Submission Handler
   -------------------------------------------------------------------------- */
function setupReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('res-name').value.trim();
    const email = document.getElementById('res-email').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const members = document.getElementById('res-members').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const requests = document.getElementById('res-requests').value.trim();

    if (name === '' || phone === '' || date === '' || time === '') {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // Save reservation to local storage store
    const booking = {
      name,
      email,
      phone,
      members: parseInt(members),
      date,
      time,
      requests: requests || 'None'
    };

    const savedBooking = ReservationStore.add(booking);

    // Format WhatsApp confirmation text
    const whatsappMessage = `*ADHIRATHA FAMILY RESTAURANT (AC)*\n` +
                            `*TABLE RESERVATION REQUEST*\n\n` +
                            `*Booking ID:* ${savedBooking.id}\n` +
                            `*Name:* ${name}\n` +
                            (email ? `*Email:* ${email}\n` : '') +
                            `*Phone:* ${phone}\n` +
                            `*Guests Count:* ${members} Members\n` +
                            `*Booking Date:* ${formatDate(date)}\n` +
                            `*Booking Time:* ${time}\n` +
                            `*Special Request:* ${booking.requests}\n\n` +
                            `Please confirm table availability. Thank you!`;

    const waLink = generateWhatsAppLink(whatsappMessage);

    // Render Success Modal or Layout
    showSuccessState(savedBooking, waLink);
  });
}

/* --------------------------------------------------------------------------
   4. Reservation Success State
   -------------------------------------------------------------------------- */
function showSuccessState(booking, waLink) {
  const container = document.getElementById('reservation-form-wrapper');
  if (!container) return;

  container.innerHTML = `
    <div class="order-success animate-scale" style="background:var(--bg-card); border:1px solid var(--border-gold); padding:40px; border-radius:var(--radius-xl);">
      <div class="order-success-icon" style="margin-bottom:15px;">
        <i class="fa-solid fa-calendar-check"></i>
      </div>
      <h3 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:10px;">Booking Submitted!</h3>
      <p class="text-secondary" style="font-size:0.9rem; margin-bottom:15px;">Your table request has been logged successfully.</p>
      <div class="order-id" style="margin-bottom:20px;">ID: ${booking.id}</div>

      <div style="text-align:left; background:var(--bg-tertiary); padding:15px; border-radius:var(--radius-md); margin-bottom:20px; font-size:0.85rem;">
        <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Guests:</strong> ${booking.members} People</p>
      </div>

      <p class="text-xs text-muted mb-4">Click below to send booking details to ADHIRATHA RESTAURANT on WhatsApp to secure confirmation instantly.</p>
      
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a href="${waLink}" target="_blank" class="btn btn-whatsapp">
          <i class="fa-brands fa-whatsapp"></i> Confirm Booking on WhatsApp
        </a>
        <button onclick="window.location.reload()" class="btn btn-outline">
          Book Another Table
        </button>
      </div>
    </div>
  `;

  // Update past reservations list on the page
  renderPastReservations();
}

/* --------------------------------------------------------------------------
   5. Render Past Bookings Check (localStorage)
   -------------------------------------------------------------------------- */
function renderPastReservations() {
  const container = document.getElementById('past-bookings-list');
  if (!container) return;

  const bookings = ReservationStore.getAll();
  
  if (bookings.length === 0) {
    container.innerHTML = `<p class="text-muted text-sm text-center">No past table bookings found.</p>`;
    return;
  }

  let html = '';
  bookings.slice(0, 3).forEach(b => {
    html += `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:10px; font-size:0.82rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
          <span style="font-weight:600; color:var(--gold);">${b.id}</span>
          <span class="status-badge status-delivered" style="font-size:0.6rem;">Confirmed</span>
        </div>
        <p style="margin:0; color:var(--text-primary); font-weight:500;">${b.members} Persons — ${formatDate(b.date)} at ${b.time}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}
