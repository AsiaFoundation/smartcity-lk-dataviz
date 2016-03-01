var map, selectLayer, selectFeature;
var happinessFor = {};
var boundsFor = {};
var layerFor = {};

$(function() {
  map = L.map('map', {
    attributionControl: false
  })
  .setView([9.67, 80.15], 13);
  L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  function standardStyle(feature) {
    var happy = Math.floor(happinessFor[feature.properties.GND_C] / 100 * 11);
    var fillColor = ['#d73027', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#1a9850'][happy];

    return {
      color: '#000',
      weight: 1,
      opacity: 1,
      fillColor: fillColor,
      fillOpacity: 0.8
    };
  }

  function makeClick (feature, layer) {
    var bounds = boundsFor[feature.properties.GND_C];
    map.fitBounds(L.latLngBounds(
      L.latLng(bounds[1], bounds[0]),
      L.latLng(bounds[3], bounds[2])
    ));

    selectLayer && selectLayer.setStyle(standardStyle(selectFeature));
    layer.setStyle({ fillOpacity: 0.8 });
    selectLayer = layer;
    selectFeature = feature;
  }

  function describe (feature) {
    var title = $("<h4>").text(feature.properties.GND_N);
    var p = $("<p>").text('Overall satisfaction: ' + happinessFor[feature.properties.GND_C] + '%');
    var outer = $("<div>").append(title).append(p);
    return outer.html();
  }

  $.get('viz/data/center.geojson', function (gj) {
    if (typeof gj === 'string') {
      gj = JSON.parse(gj);
    }
    $.each(gj.features, function (f) {
      var myIcon = L.divIcon({className: 'divlabel label-' + f});

      var feature = gj.features[f];
      happinessFor[feature.properties.GND_C] = feature.properties.happiness;

      var label = L.marker({
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }, { icon: myIcon }).addTo(map);
      label.bindPopup(describe(feature));
      label.on('click', function (e) {
        makeClick(feature, layerFor[feature.properties.GND_C]);
      });
      $(".label-" + f).text(feature.properties.happiness + '%');
    });
  });

  $.get('viz/data/chavakachcheriya.geojson', function (gj) {
    if (typeof gj === 'string') {
      gj = JSON.parse(gj);
    }
    for (var f = 0; f < gj.features.length; f++) {
      var feature = gj.features[f];
      boundsFor[feature.properties.GND_C] = makeBounds(feature.geometry.coordinates);
    }

    L.geoJson(gj, {
      style: standardStyle,
      onEachFeature: function(feature, layer) {
        layerFor[feature.properties.GND_C] = layer;
        layer.bindPopup(describe(feature));
        layer.on('click', function (e) {
          makeClick(feature, layer);
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
