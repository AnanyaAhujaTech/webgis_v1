// Initialize map (no raster layer)
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: []
  },
  center: [78.9629, 22.5937], // Center of India
  zoom: 4
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.on('load', () => {
  // Define layers
  const layers = [
    { id: 'india', file: 'india.geojson', type: 'line', color: '#000000', width: 2 },
    { id: 'states', file: 'states.geojson', type: 'line', color: '#3333cc', width: 1.5 },
    { id: 'districts', file: 'districts.geojson', type: 'line', color: '#999999', width: 0.8 },
    { id: 'rivers', file: 'rivers.geojson', type: 'line', color: '#0000ff', width: 1 },
    { id: 'roads', file: 'roads.geojson', type: 'line', color: '#ff6600', width: 1 }
  ];

  // Add sources and layers
  layers.forEach(layer => {
    map.addSource(layer.id, { type: 'geojson', data: layer.file });
    map.addLayer({
      id: layer.id,
      type: layer.type,
      source: layer.id,
      layout: { visibility: 'visible' },
      paint: {
        'line-color': layer.color,
        'line-width': layer.width
      }
    });
  });

  // Layer toggle logic
  layers.forEach(layer => {
    const checkbox = document.getElementById('toggle-' + layer.id);
    if (checkbox) {
      checkbox.addEventListener('change', e => {
        map.setLayoutProperty(layer.id, 'visibility', e.target.checked ? 'visible' : 'none');
      });
    }
  });

  // Example popups for states
  const insights = {
    "Madhya Pradesh": "High deforestation risk detected in central regions.",
    "Tripura": "Flood-prone zones identified near major rivers.",
    "Odisha": "Cyclone impact zones show infrastructure vulnerability.",
    "Telangana": "Urban heat island effect rising in Hyderabad."
  };

  // Popups on click for states
  map.on('click', 'states', e => {
    const stateName = e.features[0].properties.NAME_1;
    if (insights[stateName]) {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<h3>${stateName}</h3><p>${insights[stateName]}</p>`)
        .addTo(map);
    }
  });

  // Change cursor on hover
  map.on('mouseenter', 'states', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'states', () => map.getCanvas().style.cursor = '');
});
