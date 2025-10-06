document.addEventListener('DOMContentLoaded', () => {
    // --- Global Setup ---

    const map = L.map('map').setView([22.5937, 78.9629], 5);

    // --- Base Layers ---
    // Administrative Base Layer (OpenStreetMap)
    const administrativeBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Satellite Layer (ESRI World Imagery for rugged look)
    const satelliteBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    });

    // --- Overlay Groups ---
    const overlayGroup = L.featureGroup().addTo(map);

    let currentLayer = null; 
    let thematicLayer = null; 

    // --- Configuration & Data ---
    const stateData = {
        'madhya-pradesh': {
            name: 'Madhya Pradesh', color: '#1f78b4', fillColor: '#a6cee3',
            districts: ['Burhanpur', 'Seoni', 'Alirajpur', 'Chhindwara', 'Harda', 'Khargone', 'Khandwa', 'Balaghat', 'Barwani', 'Betul', 'Morena', 'Bhind', 'Gwalior', 'Sheopur', 'Shivpuri', 'Tikamgarh', 'Neemuch', 'Rewa', 'Satna', 'Guna', 'Ashoknagar', 'Mandsaur', 'Singrauli', 'Sidhi', 'Sagar', 'Damoh', 'Shajapur', 'Vidisha', 'Rajgarh', 'Shahdol', 'Katni', 'Umaria', 'Ratlam', 'Bhopal', 'Ujjain', 'Raisen', 'Sehore', 'Jabalpur', 'Dewas', 'Anuppur', 'Jhabua', 'Dindori', 'Narsinghpur', 'Dhar', 'Indore', 'Mandla', 'Hoshangabad', 'Agar Malwa', 'Datia', 'Chhatarpur', 'Panna', 'Niwari'],
            stats: {
                claims_received: { Individual: '585,326', Community: '42,187', Total: '627,513' },
                titles_distributed: { Individual: '266,901', Community: '27,976', Total: '294,877' },
                land_distributed: { Individual: '903,533.06', Community: '1,463,614.46', Total: '2,367,147.52' },
                claims_rejected: '322,407',
                claims_disposed: '617,284',
                percent_disposed: '98.37%',
                percent_titles: '46.99%'
            }
        },
        'telangana': {
            name: 'Telangana', color: '#33a02c', fillColor: '#b2df8a',
            districts: ['Adilabad', 'Hyderabad', 'Jagtial', 'Jangaon', 'Mulugu', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri', 'Bhadradri Kothagudem', 'Jayashankar Bhupalapally', 'Narayanpet'],
            stats: {
                claims_received: { Individual: '651,822', Community: '3,427', Total: '655,249' },
                titles_distributed: { Individual: '230,735', Community: '721', Total: '231,456' },
                land_distributed: { Individual: '669,689.14', Community: '457,663.17', Total: '1,127,352.32' },
                claims_rejected: '94,426',
                claims_disposed: '325,882',
                percent_disposed: '49.73%',
                percent_titles: '35.32%'
            }
        },
        'tripura': {
            name: 'Tripura', color: '#e31a1c', fillColor: '#fb9a99',
            districts: ['North Tripura', 'Dhalai', 'Sipahijala', 'Gomati', 'Khowai', 'West Tripura', 'South Tripura', 'Unokoti'],
            stats: {
                claims_received: { Individual: '200,557', Community: '164', Total: '200,721' },
                titles_distributed: { Individual: '127,931', Community: '101', Total: '128,032' },
                land_distributed: { Individual: '465,192.88', Community: '552.40', Total: '465,745.28' },
                claims_rejected: '68,848',
                claims_disposed: '196,880',
                percent_disposed: '98.09%',
                percent_titles: '63.79%'
            }
        },
        'odisha': {
            name: 'Odisha', color: '#ff7f00', fillColor: '#fdbf6f',
            districts: ['Bhadrak', 'Dhenkanal', 'Jajpur', 'Subarnapur', 'Nuapada', 'Balangir', 'Boudh', 'Cuttack', 'Kandhamal', 'Nayagarh', 'Khordha', 'Kalahandi', 'Jagatsinghpur', 'Puri', 'Nabarangapur', 'Rayagada', 'Koraput', 'Malkangiri', 'Angul', 'Kendrapara', 'Ganjam', 'Gajapati', 'Mayurbhanj', 'Sundargarh', 'Kendujhar', 'Balasore', 'Jharsuguda', 'Bargarh', 'Deogarh', 'Sambalpur'],
            stats: {
                claims_received: { Individual: '732,530', Community: '35,843', Total: '768,373' },
                titles_distributed: { Individual: '463,129', Community: '8,990', Total: '472,119' },
                land_distributed: { Individual: '676,078.86', Community: '763,729.00', Total: '1,439,807.86' },
                claims_rejected: '146,340',
                claims_disposed: '618,429',
                percent_disposed: '80.49%',
                percent_titles: '61.44%'
            }
        }
    };
    
    // --- DOM Elements ---
    const topBar = document.getElementById('top-bar');
    const collapseButton = document.getElementById('collapse-button');
    const stateDropdown = document.getElementById('state-dropdown');
    const districtDropdown = document.getElementById('district-dropdown');
    const statisticsPanel = document.getElementById('statistics-panel');
    const boundariesRadio = document.getElementById('boundaries-radio'); 
    const statsSidebar = document.getElementById('stats-sidebar');
    const sidebarToggleButton = document.getElementById('sidebar-toggle-button'); 
    const adminViewRadio = document.getElementById('admin-view-radio');
    const satViewRadio = document.getElementById('sat-view-radio');
    
    // Dummy filter elements
    const villageDropdown = document.getElementById('village-dropdown');
    const tehsilDropdown = document.getElementById('tehsil-dropdown');
    const tribalGroupDropdown = document.getElementById('tribal-group-dropdown');


    // --- Core Functions ---

    function getFitBoundsPadding() {
        const sidebarWidth = statsSidebar.classList.contains('hidden') ? 0 : 260;
        return [topBar.offsetHeight + 10, sidebarWidth]; 
    }
    

    function clearLayer(layerName = 'all') {
        if (layerName === 'current' || layerName === 'all') {
            if (currentLayer) {
                overlayGroup.removeLayer(currentLayer); 
                currentLayer = null;
            }
        }
        // Removed: fraClaimsLayer clear logic
        if (layerName === 'thematic' || layerName === 'all') {
            if (thematicLayer) {
                overlayGroup.removeLayer(thematicLayer); 
                thematicLayer = null;
            }
        }
    }

    // Removed: updateStatus function

    function toggleStatsSidebar(show) {
        const stateSelected = stateDropdown.value !== "";
        const districtSelected = districtDropdown.value !== "";
        const showSidebar = show && stateSelected && !districtSelected; 

        document.body.classList.toggle('stats-open', showSidebar);
        statsSidebar.classList.toggle('hidden', !showSidebar);

        if (sidebarToggleButton) {
            sidebarToggleButton.setAttribute('aria-expanded', showSidebar);
        }
        
        setTimeout(() => map.invalidateSize(), 300);
    }

    function renderStatistics(stateKey) {
        if (!stateKey) {
            statisticsPanel.innerHTML = '<p>Select a state to view statistics.</p>';
            toggleStatsSidebar(false); 
            return;
        }

        const stats = stateData[stateKey].stats;
        const formatThreePartStat = (title, data, unit = '') => `
            <strong>${title}</strong>
            <ul>
                <li>Individual: ${data.Individual} ${unit}</li>
                <li>Community: ${data.Community} ${unit}</li>
                <li>Total: ${data.Total} ${unit}</li>
            </ul>
        `;

        statisticsPanel.innerHTML = `
            ${formatThreePartStat('Claims received', stats.claims_received)}
            ${formatThreePartStat('Titles distributed', stats.titles_distributed)}
            ${formatThreePartStat('Land distributed', stats.land_distributed, 'acres')}

            <strong>Claims rejected:</strong> ${stats.claims_rejected}<br><br>
            <strong>Claims Disposed off:</strong> ${stats.claims_disposed}<br><br>

            <hr style="border-color: rgba(255, 255, 255, 0.5); margin: 8px 0;">

            <strong>% Claims disposed:</strong> ${stats.percent_disposed}<br><br>
            <strong>% Titles distributed:</strong> ${stats.percent_titles}<br>
        `;
    }

    // Removed: renderFraClaims function


    function renderBoundaries(stateKey, districtName) {
        clearLayer('thematic'); 
        clearLayer('current'); 

        if (!stateKey) return;
        
        const config = stateData[stateKey];
        let fileToLoad = `${stateKey}.geojson`;
        
        console.log(`Loading boundary layer: ${fileToLoad}...`);

        fetch(fileToLoad)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                let targetBounds = null; 

                if (districtName) {
                    const selectedFeature = data.features.find(f => 
                        f.properties && f.properties.district === districtName
                    );

                    if (selectedFeature) {
                        const tempLayer = L.geoJSON(selectedFeature);
                        targetBounds = tempLayer.getBounds();
                    } else {
                        console.warn(`District feature for ${districtName} not found.`);
                    }
                }
                
                const styleFeature = (feature) => {
                    const isSelected = districtName 
                        ? (feature.properties && feature.properties.district === districtName) 
                        : true; 
                    
                    return {
                        color: isSelected ? config.color : '#444', 
                        fillColor: isSelected ? config.fillColor : '#888',
                        fillOpacity: isSelected && districtName ? 0.6 : 0.3,
                        weight: isSelected && districtName ? 3 : 1
                    };
                };

                currentLayer = L.geoJSON(data, { style: styleFeature });
                overlayGroup.addLayer(currentLayer); 

                const bounds = targetBounds || currentLayer.getBounds();
                
                map.fitBounds(bounds, {
                    paddingTopLeft: getFitBoundsPadding()
                });

                console.log(`State layer for ${config.name} loaded.`);
            })
            .catch(err => {
                console.error(`Could not load boundary file for ${config.name}:`, err);
            });
    }

    function renderThematicLayer(stateKey, layerType) {
        clearLayer('thematic');

        if (stateKey !== 'madhya-pradesh') {
            console.log('Thematic layers are only available for Madhya Pradesh.');
            boundariesRadio.checked = true;
            renderBoundaries(stateKey, districtDropdown.value || null);
            return;
        }

        let fileNames = [];
        let layerName = '';
        let baseStyle = {};
        
        // Define layer configurations
        switch (layerType) {
            case 'crop-land':
                fileNames = ['yellow_crop_land.geojson'];
                layerName = 'Agricultural Land';
                baseStyle = { color: '#FFD700', fillColor: '#FFD700', fillOpacity: 0.5, weight: 1.5 };
                break;
            case 'water-bodies':
                fileNames = ['blue_finally.geojson']; 
                layerName = 'Water Bodies';
                baseStyle = { color: '#00BFFF', fillColor: '#00BFFF', fillOpacity: 0.8, weight: 1.5 };
                break;
            case 'homesteads':
                fileNames = ['red_finally.geojson'];
                layerName = 'Homesteads';
                baseStyle = { color: '#FF4500', fillColor: '#FF4500', fillOpacity: 0.7, weight: 1.5 };
                break;
            case 'forests':
                fileNames = ['land_use.geojson', 'green_finally.geojson']; 
                layerName = 'Forest Cover & Land Use';
                baseStyle = { color: '#006400', fillColor: '#38761d', fillOpacity: 0.6, weight: 1.5 }; 
                break;
            default:
                return;
        }

        console.log(`Loading thematic layer: ${layerName}...`);

        if (currentLayer) {
            clearLayer('current');
            renderBoundaries(stateKey, null); 
        }

        const fetchPromises = fileNames.map(fileName => 
            fetch(fileName)
                .then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status} for ${fileName}`);
                    return r.json();
                })
        );
        
        Promise.all(fetchPromises)
            .then(dataArray => {
                const featureGroup = L.featureGroup();
                let bounds = null;

                dataArray.forEach((data, index) => {
                    const layerOptions = {
                        style: (feature) => { return baseStyle; },
                        onEachFeature: (feature, layer) => {
                            const fileTag = fileNames.length > 1 ? ` (File: ${fileNames[index]})` : '';
                            layer.bindPopup(`<strong>Layer:</strong> ${layerName}${fileTag}`);
                        }
                    };

                    const layer = L.geoJSON(data, layerOptions);
                    featureGroup.addLayer(layer);
                    
                    if (bounds) {
                        bounds.extend(layer.getBounds());
                    } else {
                        bounds = layer.getBounds();
                    }
                });

                thematicLayer = featureGroup;
                overlayGroup.addLayer(thematicLayer); 

                if (bounds) {
                    map.fitBounds(bounds, {
                        paddingTopLeft: getFitBoundsPadding()
                    });
                }

                console.log(`Displaying ${layerName} for Madhya Pradesh.`);
            })
            .catch(err => {
                console.error(`Could not load thematic file(s) for ${layerName}:`, err);
            });
    }

    function switchBaseLayer(layerType) {
        if (layerType === 'satellite') {
            if (map.hasLayer(administrativeBaseLayer)) {
                map.removeLayer(administrativeBaseLayer);
            }
            if (!map.hasLayer(satelliteBaseLayer)) {
                satelliteBaseLayer.addTo(map);
            }
            overlayGroup.remove();
            console.log('Switched to Satellite View. Overlays hidden.');
        } else { 
            if (map.hasLayer(satelliteBaseLayer)) {
                map.removeLayer(satelliteBaseLayer);
            }
            if (!map.hasLayer(administrativeBaseLayer)) {
                administrativeBaseLayer.addTo(map);
            }
            overlayGroup.addTo(map);
            console.log('Switched to Administrative View. Dynamic layers visible.');

            const stateKey = stateDropdown.value;
            if (stateKey) {
                const layerType = document.querySelector('input[name="layer-type"]:checked').value;
                const districtName = districtDropdown.value;
                
                if (layerType === 'boundaries') {
                    renderBoundaries(stateKey, districtName || null);
                } else { // Handle thematic layers
                    renderThematicLayer(stateKey, layerType);
                }
            }
        }
    }


    // --- State and District Logic ---

    function handleStateSelection(stateKey) {
        clearLayer(); 
        districtDropdown.innerHTML = '<option value="" disabled selected>-- Select a District --</option>';
        districtDropdown.disabled = true;

        // Reset dummy filters on state change
        villageDropdown.value = "";
        tehsilDropdown.value = "";
        tribalGroupDropdown.value = "";
        villageDropdown.disabled = true;
        tehsilDropdown.disabled = true;
        tribalGroupDropdown.disabled = true;

        if (!stateKey) {
            renderStatistics(null);
            console.log('Please select a State to begin.');
            return;
        }

        const config = stateData[stateKey];
        renderStatistics(stateKey); 
        
        config.districts.forEach(distName => {
            const option = document.createElement('option');
            option.value = distName;
            option.textContent = distName;
            districtDropdown.appendChild(option);
        });
        districtDropdown.disabled = false;
        
        if (adminViewRadio.checked) {
            renderBoundaries(stateKey, null); 
        } else {
            console.log(`State ${config.name} selected. Switch to Administrative View to see boundaries or claims.`);
        }
        
        const topBarCollapsed = topBar.classList.contains('collapsed');
        toggleStatsSidebar(topBarCollapsed);
    }

    function handleDistrictSelection(stateKey, districtName) {
        renderStatistics(stateKey); 
        
        if (!districtName) {
            handleStateSelection(stateKey);
            return;
        }

        // Enable dummy filters when a district is selected (for demonstration)
        villageDropdown.disabled = false;
        tehsilDropdown.disabled = false;
        tribalGroupDropdown.disabled = false;
        
        if (adminViewRadio.checked) {
            const layerType = document.querySelector('input[name="layer-type"]:checked').value;
            if (boundariesRadio.checked) {
                renderBoundaries(stateKey, districtName);
            } else { // Handle thematic layers
                renderThematicLayer(stateKey, layerType);
            }
        }
        
        toggleStatsSidebar(false); 
    }


    // --- Initialization and Event Listeners ---
    
    // NOTE: All FRA claim generation functions are removed.

    // 1. Initial layer view is boundaries, no specific function needed.

    // 2. Populate State Dropdown
    Object.keys(stateData).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = stateData[key].name;
        stateDropdown.appendChild(option);
    });

    // 3. Date Change Listener (Placeholder remains functional, but now does nothing significant)
    const claimDateInput = document.getElementById('claim-date');
    if (claimDateInput) {
        claimDateInput.addEventListener('change', (event) => {
            const dateValue = event.target.value;
            console.log(`Date changed to ${dateValue}. This element is no longer tied to layer regeneration.`);
        });
    }

    // 4. Other Event Listeners 
    collapseButton.addEventListener('click', () => {
        const isCollapsed = topBar.classList.toggle('collapsed');
        collapseButton.setAttribute('aria-expanded', !isCollapsed);
        
        toggleStatsSidebar(isCollapsed);

        setTimeout(() => {
            map.invalidateSize();
            if (adminViewRadio.checked && currentLayer) {
                 map.fitBounds(currentLayer.getBounds(), {
                     paddingTopLeft: getFitBoundsPadding(),
                     animate: true 
                 });
            }
        }, 300); 
    });

    adminViewRadio.addEventListener('change', () => switchBaseLayer('administrative'));
    satViewRadio.addEventListener('change', () => switchBaseLayer('satellite'));
    sidebarToggleButton.addEventListener('click', () => {
        const isCurrentlyHidden = statsSidebar.classList.contains('hidden');
        toggleStatsSidebar(isCurrentlyHidden); 
    });
    stateDropdown.addEventListener('change', (event) => {
        const stateKey = event.target.value;
        districtDropdown.value = "";
        handleStateSelection(stateKey);
    });
    districtDropdown.addEventListener('change', (event) => {
        const districtName = event.target.value;
        const stateKey = stateDropdown.value;

        if (stateKey) {
            handleDistrictSelection(stateKey, districtName);
        }
    });
    document.querySelectorAll('input[name="layer-type"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const stateKey = stateDropdown.value;
            const districtName = districtDropdown.value;
            const layerType = event.target.value;

            if (!stateKey) {
                console.log('Select a state before changing the layer view.');
                boundariesRadio.checked = true;
                return;
            }
            
            if (satViewRadio.checked) {
                adminViewRadio.checked = true;
                switchBaseLayer('administrative');
            }

            const thematicLayers = ['crop-land', 'water-bodies', 'homesteads', 'forests']; 

            if (thematicLayers.includes(layerType) && districtName) {
                districtDropdown.value = "";
                handleStateSelection(stateKey);
            }

            if (thematicLayers.includes(layerType)) {
                toggleStatsSidebar(false);
                renderThematicLayer(stateKey, layerType);
            } else if (boundariesRadio.checked) {
                renderBoundaries(stateKey, districtDropdown.value || null); 
            }
        });
    });

    // Dummy listeners for the new filter dropdowns
    villageDropdown.addEventListener('change', () => {
        console.log(`Filtering by Village: ${villageDropdown.value}. Actual filtering is not yet implemented.`);
    });
    tehsilDropdown.addEventListener('change', () => {
        console.log(`Filtering by Tehsil: ${tehsilDropdown.value}. Actual filtering is not yet implemented.`);
    });
    tribalGroupDropdown.addEventListener('change', () => {
        console.log(`Filtering by Tribal Group: ${tribalGroupDropdown.value}. Actual filtering is not yet implemented.`);
    });
    
    console.log('Welcome to the FRA Atlas. Select a state to begin.');
});
