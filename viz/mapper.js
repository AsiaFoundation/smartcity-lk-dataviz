var map;

$(function() {
  map = L.map('map', {
    attributionControl: false
  })
  .setView([9.67, 80.15], 13);
  L.tileLayer('//tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);

  $.get('viz/data/center.geojson', function (gj) {
    if (typeof gj === 'string') {
      gj = JSON.parse(gj);
    }
    for (var f = 0; f < gj.features.length; f++) {
      var myIcon = L.divIcon({className: 'divlabel label-' + f});

      L.marker({
        lat: gj.features[f].geometry.coordinates[1],
        lng: gj.features[f].geometry.coordinates[0]
      }, { icon: myIcon }).addTo(map);
      $(".label-" + f).text(gj.features[f].properties.GND_N);
    }
  });

  $.get('viz/data/chavakachcheriya.geojson', function (gj) {
    if (typeof gj === 'string') {
      gj = JSON.parse(gj);
    }
    for (var f = 0; f < gj.features.length; f++) {
      gj.features[f].properties.bounds = makeBounds(gj.features[f].geometry.coordinates);
    }

    L.geoJson(gj, {
      style: function(feature) {
        return {
          color: '#000',
          weight: 0.9,
          opacity: 1,
          fillColor: '#aaccff',
          fillOpacity: 0.5
        }
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function (e) {
          var bounds = feature.properties.bounds;
          map.fitBounds(L.latLngBounds(
            L.latLng(bounds[1], bounds[0]),
            L.latLng(bounds[3], bounds[2])
          ));

          $("#gn-name").text(feature.properties.GND_N);
          $("#gn-detail").text(feature.properties.GND_C);
        });
      }
    }).addTo(map);

    map.on('click', function (e) {
      $("#gn-name, #gn-detail").text("");
    });
  });
});

function makeBounds(coordinates, existing) {
  if (!existing) {
    existing = [180, 90, -180, -90];
  }
  if (typeof coordinates[0] === 'number') {
    existing[0] = Math.min(existing[0], coordinates[0]);
    existing[1] = Math.min(existing[1], coordinates[1]);
    existing[2] = Math.max(existing[2], coordinates[0]);
    existing[3] = Math.max(existing[3], coordinates[1]);
  } else {
    for (var c = 0; c < coordinates.length; c++) {
      existing = makeBounds(coordinates[c], existing);
    }
  }
  return existing;
}
