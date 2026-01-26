/* DUMMY DATABASE: 30 MAJOR MUMBAI ARTERIAL ROADS */
const WELL_LIT_ZONES = [
  // --- NORTH-SOUTH ARTERIES (WESTERN) ---
  { name: "Western Express Highway", lat: 19.15, lng: 72.85, radius: 0.005 },
  { name: "SV Road", lat: 19.11, lng: 72.84, radius: 0.005 },
  { name: "Juhu Tara Road", lat: 19.09, lng: 72.82, radius: 0.005 },
  { name: "JP Road (Andheri)", lat: 19.12, lng: 72.83, radius: 0.005 },

  // --- NORTH-SOUTH ARTERIES (EASTERN) ---
  { name: "Eastern Express Highway", lat: 19.08, lng: 72.91, radius: 0.005 },
  { name: "LBS Marg", lat: 19.128729445979722, lng: 72.92498364166912, radius: 0.005 },
  { name: "Eastern Freeway", lat: 19.02, lng: 72.88, radius: 0.005 },

  // --- EAST-WEST CONNECTORS ---
  { name: "JVLR", lat: 19.12, lng: 72.88, radius: 0.005 },
  { name: "Goregaon-Mulund Link Road", lat: 19.17, lng: 72.89, radius: 0.005 },
  { name: "Santacruz-Chembur Link Road (SCLR)", lat: 19.07, lng: 72.89, radius: 0.005 },
  { name: "Andheri-Kurla Road", lat: 19.11, lng: 72.87, radius: 0.005 },
  { name: "Jogeshwari-Vikhroli Link Road", lat: 19.13, lng: 72.91, radius: 0.005 },

  // --- SOUTHERN MUMBAI & TOWN ---
  { name: "Bandra Worli Sea Link", lat: 19.03, lng: 72.81, radius: 0.005 },
  { name: "Marine Drive (NS Road)", lat: 18.94, lng: 72.82, radius: 0.005 },
  { name: "Annie Besant Road (Worli)", lat: 19.00, lng: 72.81, radius: 0.005 },
  { name: "Pedder Road", lat: 18.97, lng: 72.80, radius: 0.005 },
  { name: "CST Road", lat: 19.07, lng: 72.86, radius: 0.005 },
  { name: "Madame Cama Road", lat: 18.92, lng: 72.82, radius: 0.005 },
  { name: "P D'Mello Road", lat: 18.95, lng: 72.84, radius: 0.005 },

];

let map;
let directionsService;
let renderers = [];

/* LOAD GOOGLE MAPS */
function loadGoogleMaps() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_KEY}&callback=initMap&libraries=places,geometry,directions`;
  script.id='google-maps-script';
  script.async = true;
  script.defer = true;

  script.onload = initMap;
  document.head.appendChild(script);
}

/* INIT MAP */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 19.076, lng: 72.8777 },
    zoom: 13,
  });

  directionsService = new google.maps.DirectionsService();
}

function getSafetyScore(index, routeData) {
  // Check the simulation dropdown
  const simMode = document.getElementById('timeSimulation').value;
  let hour;

  if (simMode === "day") {
    hour = 12; // Force Noon
  } else if (simMode === "night") {
    hour = 2;  // Force 2 AM
  } else {
    hour = new Date().getHours(); // Use Real Time
  }

  let score = 0;
  let isKnownMainRoad = false;

  // 1. Database matching using Google Maps point objects
  if (routeData && routeData.overview_path) {
    routeData.overview_path.forEach(point => {
      WELL_LIT_ZONES.forEach(zone => {
        const latDiff = Math.abs(point.lat() - zone.lat);
        const lngDiff = Math.abs(point.lng() - zone.lng);
        // Using the radius check to identify known safe corridors
        if (latDiff < zone.radius && lngDiff < zone.radius) {
          isKnownMainRoad = true;
        }
      });
    });
  }

  // 2. High bonus for main roads to force Green (SAFE) status
  if (isKnownMainRoad) {
    score += 10;
  } else {
    // Normal time-based logic for secondary roads
    if (hour >= 6 && hour <= 22) score += 2;
    else score -= 2;
  }

  // Priority adjustments for route alternatives
  if (index === 0) score += 3;
  if (index === 1) score += 1;
  if (index === 2) score -= 2;

  // Calculate percentage based on the final score
  let percent = score >= 8 ? 98 : (score >= 3 ? 88 : (score >= 1 ? 62 : 35));

  // Update the UI box only for the primary route (index 0)
  const box = document.getElementById('safetyScoreBox');
  const bar = document.getElementById('safetyBarFill');
  const text = document.getElementById('safetyPercent');

  if (box && bar && text) {
    box.classList.remove('hidden');
    box.classList.add('slide-up-enter'); 
    text.innerText = percent + "%";
    bar.style.width = percent + "%";
  }

  return score >= 3 ? "SAFE" : (score >= 1 ? "MODERATE" : "RISKY");
}

/* CLEAR OLD ROUTES */
function clearRoutes() {
  renderers.forEach(r => r.setMap(null));
  renderers = [];

  // --- ADDED: CLEAR OLD CIRCLES ---
  const container = document.getElementById('circleContainer');
  if (container) container.innerHTML = '';
  document.getElementById('routeFeedbackSection').classList.add('hidden');
}

/* CALCULATE ROUTE */
function calculateRoute() {
  if (!directionsService) {
    alert("Map is still loading... please wait.");
    return;
  }

  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const btn = document.getElementById("findRouteBtn");
  const btnText = document.getElementById("btnText");

  if (!start || !end) {
    // Shake animation for error
    const controls = document.querySelector('.controls');
    controls.style.animation = "shake 0.5s";
    setTimeout(() => controls.style.animation = "", 500);
    return;
  }

  function useMyLocation() {
  if (navigator.geolocation) {
    const input = document.getElementById("start");
    input.placeholder = "Locating...";

    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        // Use Google Geocoder to get the address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]) {
                input.value = results[0].formatted_address;
            } else {
                input.value = `${pos.lat}, ${pos.lng}`; // Fallback
            }
        });
    }, () => {
        alert("Location access denied.");
        input.placeholder = "Starting Location";
    });
  }
}
// Make it global
window.useMyLocation = useMyLocation;

  // UX: Loading State
  const originalText = btnText.innerText;
  btnText.innerText = "Calculating...";
  btn.classList.add("loading-btn");

  clearRoutes();

  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    },
    (result, status) => {
      // UX: Reset Button
      btnText.innerText = originalText;
      btn.classList.remove("loading-btn");

      if (status === "OK") {
        drawRoutes(result);
      } else {
        alert("Route not found. Try specific landmarks.");
      }
    }
  );
}

/* DRAW ROUTES */
function drawRoutes(result) {
  // --- ADDED: SHOW FEEDBACK SECTION ---
  const section = document.getElementById('routeFeedbackSection');
  const container = document.getElementById('circleContainer');
  if (section) section.classList.remove('hidden');

  result.routes.forEach((route, index) => {
    const safety = getSafetyScore(index);

    const color =
      safety === "SAFE" ? "green" :
        safety === "MODERATE" ? "orange" : "red";

    const renderer = new google.maps.DirectionsRenderer({
      map,
      directions: result,
      routeIndex: index,
      polylineOptions: {
        strokeColor: color,
        strokeWeight: 6,
      },
    });

    renderers.push(renderer);

    // --- ADDED: CREATE CLICKABLE CIRCLE FOR EACH ROUTE ---
    const circle = document.createElement('div');
    circle.className = `route-circle circle-${color}`;
    circle.innerText = index + 1; // Shows 1, 2, or 3 inside the circle
    circle.onclick = () => openFeedback(index + 1);
    if (container) container.appendChild(circle);
  });
}

// --- ADDED: MODAL CONTROL FUNCTIONS ---
function openFeedback(routeNum) {
  const modal = document.getElementById('feedbackModal');
  const title = document.getElementById('feedbackTitle');

  if (modal) {
    // This updates the title so you know which circle was clicked
    if (title) title.innerText = `ROUTE ${routeNum} FEEDBACK!`;
    modal.classList.remove('hidden');
  }
}

function closeFeedback() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.classList.add('hidden');
}

function submitFeedback() {
  const text = document.getElementById('feedbackText').value;
  if (text.trim() !== "") {
    alert("POW! Feedback Received!");
    document.getElementById('feedbackText').value = "";
    closeFeedback();
  }
}

/* MAKE FUNCTIONS GLOBAL */
window.calculateRoute = calculateRoute;
window.closeFeedback = closeFeedback;
window.submitFeedback = submitFeedback;

/* START */
loadGoogleMaps();