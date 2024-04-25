var map = L.map('map').setView([42.36, -83.2], 11);
var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var togglerCheckboxes = document.querySelectorAll(".toggler-checkbox");
var markers = [];
var circles = [];

var colors = [
    "green",
    "blue",
    "orange",
    "red",
    "black"
]

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attribution">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.compass().addTo(map);
L.control.scale().addTo(map);

// add Detroit boundary
var url = '../detroit_boundary.geojson';
fetch(url)
    .then(response => response.json())
    .then(data => {
        var detroitBoundaryLayer = L.geoJSON(data, {
            style: {
                color: 'grey',
                fillOpacity: 0,
                weight: 3,
                opacity: 1
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON file:', error));



var groceryStores = [];
var restaurants = [];
var fastFood = [];
var dollarStores = [];
var gasStations = [];

function parseCSV(csvData) {
    var rows = csvData.split('\n');
    for (var i = 1; i < rows.length; i++) { // start from index 1 to skip header row
        var columns = rows[i].split(',');
        var name = columns[1].trim().slice(1, -1); // trim leading and trailing quote marks
        var price = columns[2].trim().slice(1, -1);
        var type = columns[3].trim().slice(1, -1);
        var longitude = parseFloat(columns[5].trim());
        var latitude = parseFloat(columns[6].trim());
        var categories = columns[4].trim().slice(1, -1);
        let obj = {
            name: name,
            price: price,
            type: type,
            latitude: latitude,
            longitude: longitude,
            categories: categories};

        switch(type) {
            case 'grocery store':
                groceryStores.push(obj);
                break;
            case 'restaurant':
                restaurants.push(obj);
                break;
            case 'fast food':
                fastFood.push(obj);
                break;
            case 'dollar store':
                dollarStores.push(obj);
                break;
            case 'gas station':
                gasStations.push(obj);
                break;
            default:
                // Ignore if type doesn't match any of the specified types
                break;
        }
    }
}

// Function to load CSV file
function loadCSV(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                parseCSV(xhr.responseText);
                // You can perform further operations here once the CSV is loaded and parsed
                console.log("CSV loaded and parsed successfully.");
            } else {
                console.error("Failed to load CSV file.");
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

// Load CSV file
loadCSV('../detroit_businesses.csv');

locations = [
    groceryStores,
    restaurants,
    fastFood,
    dollarStores,
    gasStations
];

function clearMarkers() {
    markers.forEach(function(marker) {
        map.removeLayer(marker);
    });
    circles.forEach(function(circle) {
        map.removeLayer(circle);
    });
}

function getPrices() {
    var checkedPrices = [];
    var checkboxes = document.querySelectorAll('.price-checkbox:checked');
    
    checkboxes.forEach(function(checkbox) {
        checkedPrices.push(checkbox.id);
    });
    
    return checkedPrices;
}

function addLayers(prices) {
    togglerCheckboxes.forEach(function(checkbox, index) {
        var x = 1;
        if (checkbox.checked) {
            var checkedCategory = locations[index];

            // declare icon for category
            var color = colors[index];
            var dotIcon = L.divIcon({
                className: `${color}-dot-icon`,
                html: `<div class="${color}-dot"></div>`,
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });
            
            markersCategory = []
            checkedCategory.forEach(function(obj) {
                // Access properties of the current object
                if (prices.includes(obj.price)) {
                    var m = L.marker([obj.latitude, obj.longitude], { icon: dotIcon }).addTo(map);
                    m.bindTooltip(`<b>${obj.name}</b><p>${obj.categories}</p><p>Price: ${obj.price}</p>`);
                    markers.push(m);
                    markersCategory.push(obj);

                    var circle = L.circle([obj.latitude, obj.longitude], {
                        radius: 804.672, // half-mile in meters
                        color: color,
                        opacity: 0.3,
                        fillOpacity: 0,
                        interactive: false,
                        weight: 1
                    }).addTo(map);
                    circles.push(circle);
                }
            });
        }
    });
}

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('click', function() {
        // clear map
        clearMarkers();

        // get active prices
        var prices = getPrices();

        // add layers corresponding to all checked categories
        addLayers(prices);
    });
});