# ADHIRATHA Family Restaurant (AC) — Website

A premium, modern responsive restaurant website built for **ADHIRATHA FAMILY RESTAURANT (AC)** located in Pamuru, Andhra Pradesh.

## 🍽️ Features Included
- **Luxury Theme**: High-fidelity dark background (`#0a0a0a`), luxury golds, and transparent card patterns.
- **Online Food Ordering**: Fully functional cart (localStorage-based) allowing addition, quantity changes, removal, and calculation of subtotals, GST (5%), and delivery fees.
- **Vouchers & Coupons**: Applied active voucher validation (`WELCOME20`, `FAMILY50`, etc.).
- **Simulated Payment Gateway**: Toggle COD, simulated UPI QR code scanners, or Sandbox Razorpay checkout interfaces.
- **WhatsApp Integration**: Generates formatted order details, booking tables, or contact copy directly to send on WhatsApp (`+91 6301042993`).
- **Table Booking Reservation**: Prevent lines! Allows picking dates, slots, guests numbers, and requests.
- **Active Admin Dashboard**: Secure console (`admin/index.html`) displaying charts, revenue statistics cards, and live orders status toggles (Accept / Deliver / Cancel).
- **SEO & Responsiveness**: Mobile-first design system with Outfit & Playfair Display typography, smooth transitions, and standard meta headers.

## 📁 Folder Structure
```
ADHIRATHA-RESTAURANT/
├── index.html              # Home page
├── menu.html               # Category tab menu card
├── cart.html               # Shopping cart list
├── checkout.html           # Shipping info & payment toggles
├── reservation.html        # Table booking requests
├── reviews.html            # Customer rating reviews and comments
├── contact.html            # Phone calls & Google maps location
├── about.html              # Story & legacy description
├── login.html              # Customer credentials auth
│
├── admin/
│   ├── index.html          # Admin portal login interface
│   ├── dashboard.html      # Stats dashboard console
│   └── orders.html         # Live orders database lists
│
├── css/
│   ├── style.css           # Core theme variables & design system
│   ├── menu.css            # Menu layout lists and sidebar scrollings
│   ├── admin.css           # Control panel styling tables
│   └── responsive.css      # Tablet & mobile media queries
│
├── js/
│   ├── data.js             # 100+ menu items, 14 categories database
│   ├── app.js              # Core navigation, toast alert queues, local storage stores
│   ├── menu.js             # Menu page grids, filters, searches
│   ├── cart.js             # Shopping bag logic handlers
│   ├── checkout.js         # Order triggers, payment simulators, WhatsApp creators
│   ├── reservation.js      # Date range limits, booking submissions
│   ├── reviews.js          # Rating breakdown calculations
│   └── admin.js            # Operations accept status triggers
│
└── database/
    └── restaurant.sql      # Phase 2 MySQL database tables schema
```

## ⚙️ How to Run
1. Open the project folder in any web browser.
2. Launch `index.html` to experience the public site.
3. Access `admin/index.html` to enter the administrator control panel.
   - **Username**: `admin`
   - **Password**: `adhiratha2024`

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, ES6 JavaScript, Bootstrap (Icons), Font Awesome 6.
- **External CDN Modules**: Swiper Slider (carousels), Chart.js (graphs).
- **Database (Phase 2)**: MySQL Server schema prepared in `database/restaurant.sql`.
