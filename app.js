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
    layers: [{
      id: 'osm-tiles',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }]
  },
  center: [78.9629, 22.5937],
  zoom: 4
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// Helper function to fetch GeoJSON and add source+layer
function addLineLayer(map, layerDef) {
  fetch(layerDef.file)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (!map.getSource(layerDef.id)) {
        map.addSource(layerDef.id, {
          type: 'geojson',
          data: data
        });
      } else {
        map.getSource(layerDef.id).setData(data);
      }

      map.addLayer({
        id: layerDef.id,
        type: 'line',
        source: layerDef.id,
        layout: {
          visibility: layerDef.visible ? 'visible' : 'none'
        },
        paint: {
          'line-color': layerDef.color,
          'line-width': layerDef.width
        }
      });
    })
    .catch(error => {
      console.error('Failed to load GeoJSON', layerDef.file, error);
    });
}

map.on('load', () => {
  const layers = [
    { id: 'states',    file: 'states.geojson',    color: '#3333cc', width: 1.5, visible: true },
    { id: 'districts', file: 'districts.geojson', color: '#999999', width: 0.8, visible: false },
    { id: 'rivers',    file: 'rivers.geojson',    color: '#0066ff', width: 1.2, visible: true },
    { id: 'roads',     file: 'roads.geojson',     color: '#cc0000', width: 1.2, visible: true }
  ];

  layers.forEach(layer => addLineLayer(map, layer));

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
