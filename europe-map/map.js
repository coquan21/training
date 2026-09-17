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
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: "center",
            className: "country-label"
          });
          layer.on("click", onCountryClick(feature, layer));
        }
      }
    ).addTo(map);

    map.fitBounds(geoLayer.getBounds());
    map.setZoom(map.getZoom() + 1); // one extra zoom level roughly doubles the visible scale
  })
  .catch((err) => {
    console.error("Failed to load map data", err);
    document.getElementById("map").innerHTML =
      '<p style="padding:20px">Could not load map data. Check your internet connection.</p>';
  });

window.addEventListener("resize", () => map.invalidateSize());
