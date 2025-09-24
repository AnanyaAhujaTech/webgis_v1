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
    { id: 'india', file: 'data/india.geojson', type: 'line', color: '#000', width: 2, visible: true },
    { id: 'states', file: 'data/states.geojson', type: 'line', color: '#3333cc', width: 1.5, visible: true },
    { id: 'districts', file: 'data/districts.geojson', type: 'line', color: '#999999', width: 0.8, visible: false },
    { id: 'rivers', file: 'data/rivers.geojson', type: 'line', color: '#0066ff', width: 1.2, visible: true },
    { id: 'roads', file: 'data/roads.geojson', type: 'line', color: '#cc0000', width: 1.2, visible: true }
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
  document.getElementById('toggle-rivers').addEventListener('change', e => {
    map.setLayoutProperty('rivers', 'visibility', e.target.checked ? 'visible' : 'none');
  });
  document.getElementById('toggle-roads').addEventListener('change', e => {
    map.setLayoutProperty('roads', 'visibility', e.target.checked ? 'visible' : 'none');
  });
});
