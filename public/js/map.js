// public/js/map.js

if (document.getElementById("map")) {
  maptilersdk.config.apiKey = mapTilerKey;

  const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 10,
  });

  // 👇 Wait for map to fully load before adding marker
  map.on("load", () => {
    new maptilersdk.Marker({ color: "#e74c3c" })
      .setLngLat(coordinates)
      .setPopup(
        new maptilersdk.Popup({ offset: 25 }).setHTML(
          `<h6>You will live here</h6>`,
        ),
      )
      .addTo(map);
  });
}
