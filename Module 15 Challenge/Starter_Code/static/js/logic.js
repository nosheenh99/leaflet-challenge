// This function creates the Leaflet map and plots the earthquake data
function createMap(earthquakeData) {
    // Create the map centered on a specific location
    var map = L.map('map').setView([0, 0], 2);

    // Add the tile layer to the map (you can choose different map styles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Function to determine marker size based on earthquake magnitude
    function getMarkerSize(magnitude) {
        return magnitude * 4; // Adjust the marker size multiplier as needed
    }

    // Function to determine marker color based on earthquake depth
    function getMarkerColor(depth) {
        // Colors based on depth range in meters
        if (depth < 10) return '#ff0000'; // Red
        else if (depth < 30) return '#ff7f00'; // Orange
        else if (depth < 50) return '#ffff00'; // Yellow
        else if (depth < 70) return '#7fff00'; // Lime
        else if (depth < 90) return '#00ff00'; // Green
        else return '#00ff7f'; // Light Green
    }

    // Loop through the earthquake data and plot markers for each earthquake
    for (var i = 0; i < earthquakeData.features.length; i++) {
        var earthquake = earthquakeData.features[i];
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2]; // Depth is the third coordinate
        var latitude = earthquake.geometry.coordinates[1];
        var longitude = earthquake.geometry.coordinates[0];

        // Create a circle marker for each earthquake and add a popup with information
        L.circleMarker([latitude, longitude], {
            radius: getMarkerSize(magnitude),
            fillColor: getMarkerColor(depth),
            color: '#000',
            weight: 1,
            fillOpacity: 0.7
        }).bindPopup(`<b>Magnitude: ${magnitude}</b><br>Depth: ${depth} km`).addTo(map);
    }

    // Add a legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [10, 30, 50, 70, 90];
        var colors = ['#ffff00', '#ffcc00', '#ff9900', '#ff6600', '#ff3300', '#ff0000'];
        var labels = [];

        for (var i = 0; i < depths.length; i++) {
            var color = colors[i];
            var depthLabel = depths[i] + (i + 1 < depths.length ? '–' + depths[i + 1] : '+');
            labels.push(
                `<i style="background:${color}"></i> ${depthLabel} km`
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}

// Function to fetch the earthquake data using the URL
function fetchEarthquakeData(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => createMap(data))
        .catch(error => console.log("Failed to fetch earthquake data:", error));
}

// URL of the JSON data
// All Earthquakes from Past 30 Days
// var earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// All Earthquakes from Past 7 Days
var earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data and create the map
fetchEarthquakeData(earthquakeDataURL);
