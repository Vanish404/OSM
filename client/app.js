map = L.map('map', {
    scrollWheelZoom: true
}).setView([53.68583, 23.83812], 13);

var layerGroupGeolocation = new L.layerGroup();
var busStopArray = [];
var clusters = [];

L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
}).addTo(map);


function getMyLocation() {

    map.locate({setView: true, maxZoom: 16});

    function onLocationFound(e) {

        var radius = e.accuracy / 2;
        var marker = L.marker(e.latlng)
            .bindPopup("You are within " + radius + " meters from this point");

        var circle = L.circle(e.latlng, radius);

        clearGeolocationPosition();
        layerGroupGeolocation.addLayer(marker).addTo(map);
        layerGroupGeolocation.addLayer(circle).addTo(map);

        geolocationFlag = true;
    }

    //found lcation
    map.on('locationfound', onLocationFound);

    //don't find location
    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);

}

function clearGeolocationPosition() {
    layerGroupGeolocation.clearLayers();
}

function getAllBusStop() {

    $.getJSON("bus-stop.json", function (json) {
        busStopArray = json;

    });

    var myCluster = L.geoJson(busStopArray,{
        pointToLayer: function(feature,latlng){
            var popup = feature.properties['name:ru'];
            var marker = L.marker(latlng);
            marker.bindPopup('Bus-stop name: '+popup);
            return marker;
        }
    });

    clusters = L.markerClusterGroup();
    clusters.addLayer(myCluster);
    map.addLayer(clusters);

}


function clearAllBusStop() {
   clusters.clearLayers();
}

