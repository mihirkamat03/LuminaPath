let map;
let directionsService;
let renderers = [];

/* LOAD GOOGLE MAPS */
function loadGoogleMaps() {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQb4IPsDjIboyoWiQ50og4atYwlN1vkdo";
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

/*  SAFETY LOGIC */
function getSafetyScore(index) {
  const hour = new Date().getHours();
  let score = 0;

  if (hour >= 6 && hour <= 22) score += 2;
  else score -= 2;

  if (index === 0) score += 3;
  if (index === 1) score += 1;
  if (index === 2) score -= 2;

  let percent = 0;
  if (score >= 3) percent = 88;      // SAFE
  else if (score >= 1) percent = 62; // MODERATE
  else percent = 35;                 // RISKY

  const box = document.getElementById('safetyScoreBox');
  const bar = document.getElementById('safetyBarFill');
  const text = document.getElementById('safetyPercent');

  if (box && bar && text) {
      box.classList.remove('hidden');
      text.innerText = percent + "%";
      bar.style.width = percent + "%";
  }

  if (score >= 3) return "SAFE";
  if (score >= 1) return "MODERATE";
  return "RISKY";
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
    alert("Map still loading, thoda wait kar 🤦‍♂️");
    return;
  }

  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Dono locations daal bhai");
    return;
  }

  clearRoutes();

  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    },
    (result, status) => {
      if (status === "OK") {
        drawRoutes(result);
      } else {
        alert("Entered Route not found!! Please try again.");
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
    circle.onclick = () => openFeedback();
    if (container) container.appendChild(circle);
  });
}

// --- ADDED: MODAL CONTROL FUNCTIONS ---
function openFeedback() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.classList.remove('hidden');
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