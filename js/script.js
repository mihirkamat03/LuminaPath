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

/* FAKE SAFETY LOGIC */
function getSafetyScore(index) {
  const hour = new Date().getHours();
  let score = 0;

  if (hour >= 6 && hour <= 22) score += 2;
  else score -= 2;

  if (index === 0) score += 3;
  if (index === 1) score += 1;
  if (index === 2) score -= 2;

  if (score >= 3) return "SAFE";
  if (score >= 1) return "MODERATE";
  return "RISKY";
}

/* CLEAR OLD ROUTES */
function clearRoutes() {
  renderers.forEach(r => r.setMap(null));
  renderers = [];
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
        alert("Entered Route not forund!! Please try again with a different location.");
      }
    }
  );
}

/* DRAW ROUTES */
function drawRoutes(result) {
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
  });
}

/* MAKE FUNCTIONS GLOBAL */
window.calculateRoute = calculateRoute;

/* START */
loadGoogleMaps();
