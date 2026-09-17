// Countries from the public world.geo.json dataset that fall within Europe.
const EUROPEAN_COUNTRIES = new Set([
  "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
  "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland",
  "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo",
  "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova",
  "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
  "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
  "Switzerland", "Ukraine", "United Kingdom", "Vatican"
]);

const EUROPEAN_CAPITALS = {
  Albania: { name: "Tirana", lat: 41.3275, lng: 19.8187 },
  Andorra: { name: "Andorra la Vella", lat: 42.5063, lng: 1.5218 },
  Austria: { name: "Vienna", lat: 48.2082, lng: 16.3738 },
  Belarus: { name: "Minsk", lat: 53.9, lng: 27.5667 },
  Belgium: { name: "Brussels", lat: 50.8503, lng: 4.3517 },
  "Bosnia and Herzegovina": { name: "Sarajevo", lat: 43.8563, lng: 18.4131 },
  Bulgaria: { name: "Sofia", lat: 42.6977, lng: 23.3219 },
  Croatia: { name: "Zagreb", lat: 45.815, lng: 15.9819 },
  Cyprus: { name: "Nicosia", lat: 35.1856, lng: 33.3823 },
  "Czech Republic": { name: "Prague", lat: 50.0755, lng: 14.4378 },
  Denmark: { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  Estonia: { name: "Tallinn", lat: 59.437, lng: 24.7536 },
  Finland: { name: "Helsinki", lat: 60.1699, lng: 24.9384 },
  France: { name: "Paris", lat: 48.8566, lng: 2.3522 },
  Germany: { name: "Berlin", lat: 52.52, lng: 13.405 },
  Greece: { name: "Athens", lat: 37.9838, lng: 23.7275 },
  Hungary: { name: "Budapest", lat: 47.4979, lng: 19.0402 },
  Iceland: { name: "Reykjavik", lat: 64.1466, lng: -21.9426 },
  Ireland: { name: "Dublin", lat: 53.3498, lng: -6.2603 },
  Italy: { name: "Rome", lat: 41.9028, lng: 12.4964 },
  Kosovo: { name: "Pristina", lat: 42.6629, lng: 21.1655 },
  Latvia: { name: "Riga", lat: 56.9496, lng: 24.1052 },
  Liechtenstein: { name: "Vaduz", lat: 47.141, lng: 9.5209 },
  Lithuania: { name: "Vilnius", lat: 54.6872, lng: 25.2797 },
  Luxembourg: { name: "Luxembourg", lat: 49.6116, lng: 6.1319 },
  Macedonia: { name: "Skopje", lat: 41.9981, lng: 21.4254 },
  Malta: { name: "Valletta", lat: 35.8989, lng: 14.5146 },
  Moldova: { name: "Chisinau", lat: 47.0105, lng: 28.8638 },
  Monaco: { name: "Monaco", lat: 43.7384, lng: 7.4246 },
  Montenegro: { name: "Podgorica", lat: 42.4304, lng: 19.2594 },
  Netherlands: { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  Norway: { name: "Oslo", lat: 59.9139, lng: 10.7522 },
  Poland: { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
  Portugal: { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
  Romania: { name: "Bucharest", lat: 44.4268, lng: 26.1025 },
  Russia: { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  "San Marino": { name: "San Marino", lat: 43.9424, lng: 12.4578 },
  Serbia: { name: "Belgrade", lat: 44.7866, lng: 20.4489 },
  Slovakia: { name: "Bratislava", lat: 48.1486, lng: 17.1077 },
  Slovenia: { name: "Ljubljana", lat: 46.0569, lng: 14.5058 },
  Spain: { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  Sweden: { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  Switzerland: { name: "Bern", lat: 46.9481, lng: 7.4474 },
  Ukraine: { name: "Kyiv", lat: 50.4501, lng: 30.5234 },
  "United Kingdom": { name: "London", lat: 51.5072, lng: -0.1276 },
  Vatican: { name: "Vatican City", lat: 41.9029, lng: 12.4534 }
};

const DATA_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const map = L.map("map", { minZoom: 3 }).setView([54, 15], 4);

function addFlag(latlng) {
  const icon = L.divIcon({
    html: "🚩",
    className: "flag-icon",
    iconSize: [22, 22],
    iconAnchor: [4, 22]
  });
  L.marker(latlng, { icon }).addTo(map);
}

function addCapitalMarker(countryName, capital) {
  L.circleMarker([capital.lat, capital.lng], {
    radius: 4,
    color: "#c0392b",
    fillColor: "#e74c3c",
    fillOpacity: 0.95,
    weight: 1
  })
    .bindTooltip(`${capital.name} (${countryName})`, { direction: "top" })
    .addTo(map);
}

function onCountryClick(feature, layer) {
  return (e) => {
    layer.setStyle({ fillColor: "#3b82f6", fillOpacity: 0.75 });
    addFlag(e.latlng);
    L.DomEvent.stopPropagation(e);
  };
}

fetch(DATA_URL)
  .then((r) => r.json())
  .then((data) => {
    const europeFeatures = data.features.filter((f) =>
      EUROPEAN_COUNTRIES.has(f.properties.name)
    );

    const geoLayer = L.geoJSON(
      { type: "FeatureCollection", features: europeFeatures },
      {
        style: () => ({
          color: "#2c3e50",
          weight: 1,
          fillColor: "#e8ecf1",
          fillOpacity: 0.9
        }),
        onEachFeature: (feature, layer) => {
          const countryName = feature.properties.name;
          const capital = EUROPEAN_CAPITALS[countryName];
          const countryLabel = capital
            ? `${countryName}<br>${capital.name}`
            : countryName;

          layer.bindTooltip(countryLabel, {
            permanent: true,
            direction: "center",
            className: "country-label"
          });
          layer.on("click", onCountryClick(feature, layer));
        }
      }
    ).addTo(map);

    europeFeatures.forEach((feature) => {
      const countryName = feature.properties.name;
      const capital = EUROPEAN_CAPITALS[countryName];
      if (capital) {
        addCapitalMarker(countryName, capital);
      }
    });

    map.fitBounds(geoLayer.getBounds());
    map.setZoom(map.getZoom() + 1); // one extra zoom level roughly doubles the visible scale
  })
  .catch((err) => {
    console.error("Failed to load map data", err);
    document.getElementById("map").innerHTML =
      '<p style="padding:20px">Could not load map data. Check your internet connection.</p>';
  });

window.addEventListener("resize", () => map.invalidateSize());
