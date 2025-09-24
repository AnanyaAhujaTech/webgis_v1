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

map.addControl(new maplibregl.NavigationControl(), 'top-right');

const layers = [
  { id: 'states',    file: 'states.geojson',    color: '#3333cc', width: 1.5, visible: true, popupProperty: 'STATE_NAME' },
  { id: 'districts', file: 'districts.geojson', color: '#999999', width: 0.8, visible: false, popupProperty: 'DISTRICT_NAME' },
  { id: 'rivers',    file: 'rivers.geojson',    color: '#0066ff', width: 1.2, visible: true,  popupProperty: 'NAME' },
  { id: 'roads',     file: 'roads.geojson',     color: '#cc0000', width: 1.2, visible: true,  popupProperty: 'ROAD_NAME' }
];

// Load sources and add layers after fetching GeoJSON data
map.on('load', () => {
  layers.forEach(layer => {
    fetch(layer.file)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // Add GeoJSON source
        map.addSource(layer.id, {
          type: 'geojson',
          data: data
        });

        // Add layer above 'osm-tiles' raster layer to ensure visibility
        map.addLayer({
          id: layer.id,
          type: 'line',
          source: layer.id,
          layout: { visibility: layer.visible ? 'visible' : 'none' },
          paint: {
            'line-color': layer.color,
            'line-width': layer.width
          }
        }, 'osm-tiles');

        // Add click popup for feature info
        map.on('click', layer.id, (e) => {
          if (e.features && e.features.length > 0) {
            // Use specified popupProperty or fallback to first feature property
            const propertyKey = layer.popupProperty || Object.keys(e.features[0].properties)[0];
            const propertyValue = e.features[0].properties[propertyKey] || "N/A";

            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`<strong>${propertyKey}:</strong> ${propertyValue}`)
              .addTo(map);
          }
        });

        // Change mouse cursor on hover for layers
        map.on('mouseenter', layer.id, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layer.id, () => {
          map.getCanvas().style.cursor = '';
        });
      })
      .catch(error => {
        console.error(`Failed to load ${layer.file}:`, error);
      });
  });

  // Layer toggle event listeners
  document.getElementById('toggle-states').addEventListener('change', (e) => {
    map.setLayoutProperty('states', 'visibility', e.target.checked ? 'visible' : 'none');
  });
  document.getElementById('toggle-districts').addEventListener('change', (e) => {
    map.setLayoutProperty('districts', 'visibility', e.target.checked ? 'visible' : 'none');
  });
  document.getElementById('toggle-rivers').addEventListener('change', (e) => {
    map.setLayoutProperty('rivers', 'visibility', e.target.checked ? 'visible' : 'none');
  });
  document.getElementById('toggle-roads').addEventListener('change', (e) => {
    map.setLayoutProperty('roads', 'visibility', e.target.checked ? 'visible' : 'none');
  });
});
