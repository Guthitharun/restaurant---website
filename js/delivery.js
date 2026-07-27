/* ==========================================================================
   DELIVERY.JS — Geolocation-Based Delivery Distance Validation
   ADHIRATHA Family Restaurant, Pamuru
   Uses Haversine formula for straight-line distance (~35km ≈ 45min drive)
   ========================================================================== */

const DELIVERY_CONFIG = {
  // Restaurant coordinates — Pamuru, Andhra Pradesh
  restaurantLat: 15.1145,
  restaurantLng: 79.9126,
  // ~35km straight-line ≈ 45 minutes driving distance threshold
  maxDistanceKm: 35,
  maxDriveMinutes: 45
};

/* --------------------------------------------------------------------------
   Haversine Formula — Calculate distance between two lat/lng points in km
   -------------------------------------------------------------------------- */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/* --------------------------------------------------------------------------
   Estimate Drive Time from straight-line distance
   Uses 40 km/h average speed for local Indian roads
   -------------------------------------------------------------------------- */
function estimateDriveMinutes(distanceKm) {
  const avgSpeedKmH = 40;
  return Math.round((distanceKm / avgSpeedKmH) * 60);
}

/* --------------------------------------------------------------------------
   Main Delivery Check — Returns Promise<{available, distance, driveMinutes}>
   -------------------------------------------------------------------------- */
function checkDeliveryAvailability() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        available: null,
        error: 'Geolocation not supported by your browser.',
        distance: null,
        driveMinutes: null
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = haversineDistance(
          DELIVERY_CONFIG.restaurantLat,
          DELIVERY_CONFIG.restaurantLng,
          latitude,
          longitude
        );
        const driveMinutes = estimateDriveMinutes(distance);
        const available = distance <= DELIVERY_CONFIG.maxDistanceKm;

        resolve({
          available,
          distance: Math.round(distance * 10) / 10,
          driveMinutes,
          userLat: latitude,
          userLng: longitude
        });
      },
      (error) => {
        let msg = 'Unable to detect your location.';
        if (error.code === 1) msg = 'Location access denied. Please enable location to check delivery availability.';
        if (error.code === 2) msg = 'Location unavailable. Please try again.';
        if (error.code === 3) msg = 'Location request timed out. Please try again.';
        resolve({
          available: null,
          error: msg,
          distance: null,
          driveMinutes: null
        });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

/* --------------------------------------------------------------------------
   UI Helper — Show delivery status in a container element
   -------------------------------------------------------------------------- */
function renderDeliveryStatus(containerId, result) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (result.error) {
    container.innerHTML = `
      <div class="delivery-status delivery-unknown">
        <i class="fa-solid fa-location-crosshairs"></i>
        <div>
          <strong>Location Access Needed</strong>
          <p>${result.error}</p>
          <p style="font-size:0.8rem; margin-top:4px; color:var(--text-muted);">
            You can still choose <strong>Takeaway</strong> or <strong>Dine-In</strong>.
          </p>
        </div>
      </div>`;
    return;
  }

  if (result.available) {
    container.innerHTML = `
      <div class="delivery-status delivery-available">
        <i class="fa-solid fa-circle-check"></i>
        <div>
          <strong>🎉 Delivery Available!</strong>
          <p>You are <strong>${result.distance} km</strong> away (~${result.driveMinutes} min drive). We deliver to your location!</p>
        </div>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="delivery-status delivery-unavailable">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>
          <strong>Sorry, Delivery Not Available</strong>
          <p>You are <strong>${result.distance} km</strong> away (~${result.driveMinutes} min drive). 
          Delivery is only available within a <strong>45-minute driving distance</strong>.</p>
          <p style="margin-top:6px; color:var(--gold);">Please choose <strong>Takeaway</strong> or <strong>Dine-In</strong> instead.</p>
        </div>
      </div>`;
  }
}
