// Initialize map
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-tiles',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  center: [78.9629, 22.5937], // Center of India
  zoom: 4
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.on('load', () => {
  // Define layers
  const layers = [
    { id: 'india', file: 'india.geojson', type: 'line', color: '#000', width: 2, visible: true },
    { id: 'states', file: 'states.geojson', type: 'line', color: '#3333cc', width: 1.5, visible: true },
    { id: 'districts', file: 'districts.geojson', type: 'line', color: '#999999', width: 0.8, visible: false }
  ];

  // Add sources and layers
  layers.forEach(layer => {
    map.addSource(layer.id, {
      type: 'geojson',
      data: layer.file
    });

    map.addLayer({
      id: layer.id,
      type: layer.type,
      source: layer.id,
      layout: {
        visibility: layer.visible ? 'visible' : 'none'
      },
      paint: {
        'line-color': layer.color,
        'line-width': layer.width
      }
    });
  });

  // Layer toggle logic
  document.getElementById('toggle-states').addEventListener('change', e => {
    map.setLayoutProperty('states', 'visibility', e.target.checked ? 'visible' : 'none');
  });
  document.getElementById('toggle-districts').addEventListener('change', e => {
    map.setLayoutProperty('districts', 'visibility', e.target.checked ? 'visible' : 'none');
  });

  // --- Hardcoded ML insights ---
  const insights = {
    "Madhya Pradesh": "High deforestation risk detected in central regions.",
    "Tripura": "Flood-prone zones identified near major rivers.",
    "Odisha": "Cyclone impact zones show infrastructure vulnerability.",
    "Telangana": "Urban heat island effect rising in Hyderabad."
  };

  // Click event on states layer
  map.on('click', 'states', e => {
    const stateName = e.features[0].properties.MadhyaPradesh; // assumes NAME_1 in GeoJSON
    if (insights[stateName]) {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<h3>${stateName}</h3><p>${insights[stateName]}</p>`)
        .addTo(map);
    }
  });

  // Change cursor on hover
  map.on('mouseenter', 'states', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'states', () => {
    map.getCanvas().style.cursor = '';
  });
});
