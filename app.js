// Initialize MapLibre map with OSM base
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

// Layers definition
const layers = [
  { id: 'india', file: './india.geojson', color: '#000000', width: 2 },
  { id: 'states', file: './states.geojson', color: '#3333cc', width: 1.5 },
  { id: 'districts', file: './districts.geojson', color: '#999999', width: 0.8 },
  { id: 'rivers', file: './rivers.geojson', color: '#0000ff', width: 1 },
  { id: 'roads', file: './roads.geojson', color: '#ff6600', width: 1 }
];

// Load layers asynchronously
map.on('load', () => {
  layers.forEach(layer => {
    fetch(layer.file)
      .then(res => res.json())
      .then(data => {
        // Add source
        map.addSource(layer.id, { type: 'geojson', data: data });

        // Add layer above OSM
        map.addLayer({
          id: layer.id,
          type: 'line',
          source: layer.id,
          layout: { visibility: 'visible' },
          paint: { 'line-color': layer.color, 'line-width': layer.width }
        }, 'osm-tiles');

        // Layer toggle checkbox
        const checkbox = document.getElementById('toggle-' + layer.id);
        if (checkbox) {
          checkbox.addEventListener('change', e => {
            map.setLayoutProperty(layer.id, 'visibility', e.target.checked ? 'visible' : 'none');
          });
        }

        // Add popups for specific layers
        if (layer.id === 'states') {
          const insights = {
            "Madhya Pradesh": "High deforestation risk detected in central regions.",
            "Tripura": "Flood-prone zones identified near major rivers.",
            "Odisha": "Cyclone impact zones show infrastructure vulnerability.",
            "Telangana": "Urban heat island effect rising in Hyderabad."
          };
          map.on('click', 'states', e => {
            const stateName = e.features[0].properties.NAME_1;
            if (insights[stateName]) {
              new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<h3>${stateName}</h3><p>${insights[stateName]}</p>`)
                .addTo(map);
            }
          });
          map.on('mouseenter', 'states', () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', 'states', () => map.getCanvas().style.cursor = '');
        }

        if (layer.id === 'rivers') {
          map.on('click', 'rivers', e => {
            const riverName = e.features[0].properties.NAME || e.features[0].properties.name;
            if (riverName) {
              new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<p>${riverName}</p>`)
                .addTo(map);
            }
          });
          map.on('mouseenter', 'rivers', () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', 'rivers', () => map.getCanvas().style.cursor = '');
        }

        if (layer.id === 'roads') {
          map.on('click', 'roads', e => {
            const roadName = e.features[0].properties.NAME || e.features[0].properties.name;
            if (roadName) {
              new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<p>${roadName}</p>`)
                .addTo(map);
            }
          });
          map.on('mouseenter', 'roads', () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', 'roads', () => map.getCanvas().style.cursor = '');
        }

        if (layer.id === 'districts') {
          map.on('click', 'districts', e => {
            const districtName = e.features[0].properties.NAME_2 || e.features[0].properties.name;
            if (districtName) {
              new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<p>${districtName}</p>`)
                .addTo(map);
            }
          });
          map.on('mouseenter', 'districts', () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', 'districts', () => map.getCanvas().style.cursor = '');
        }

      })
      .catch(err => console.error(`Failed to load ${layer.file}:`, err));
  });
});
