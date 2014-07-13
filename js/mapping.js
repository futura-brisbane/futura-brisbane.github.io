// Configure the styles for our map
var styles = {
    "Library": {
        radius: 1500,
        fillColor: '#ff0'
    },
    "Schools": {
        radius: 500,
        fillColor: '#03f'

    },
    "BusinessCentre": {
        radius: 500,
        fillColor: '#03f'

    },
    "BusStops": {
        radius: 500,
        fillColor: '#03f'

    },
    "Parks": {
        radius: 500,
        fillColor: '#03f'

    },
    "PetShops": {
        radius: 500,
        fillColor: '#03f'

    },
    "WifiHotSpot": {
        radius: 500,
        fillColor: '#03f'

    }
}

// Setup everything ready to go
$(document).ready(function() {

    $('#displayMap').click(createUserMap);

})

function createUserMap() {
    drawMap();
    loadData();
}

function drawMap() {

    $('#map').css({height:'500px'});
    $('html, body').animate({
        scrollTop: $("#map").offset().top
    }, 1000);


    map = L.map('map', {
      center : [-27.45, 153],
      zoom : 11
    });

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});
    var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: '1234'
    });
    map.addLayer(MapQuestOpen_OSM);
}


function loadData() {
    $.ajax({
        type: "GET",
        url: "TheDataBase.csv",
        dataType: "text",
        success: function(data) {
            processData(data);
        }
    })
}


function processData(data) {
    csvData = $.csv.toArrays(data);

    //remove headers
    csvData.shift();

    // cleanup spaces
    for (var i = 0; i < csvData.length; i++) {
        for (var j = 0; j < csvData[i].length; j++) {
            csvData[i][j] = csvData[i][j].trim();
        }
    }

    drawCircles(csvData);
}

var markers = [];
function drawCircles(data) {
    $.each(markers, function(i, marker) {
        map.removeLayer(marker);
    });
    markers = [];

    $.each(data, function(i, val) {
        var circleType = val[0];
        var latitude = val[1];
        var longitude = val[2];
        if (!styles[circleType]) {
            console.log("No matching style for: " + circleType);
            return;
        }

        if (!latitude || !longitude) {
            console.log("Invalid lat or long at line: " + (i + 1));
            return;
        }

        var radius = styles[circleType].radius;
        var style = {
            color: styles[circleType].fillColor,
            stroke: false,
            fillOpacity: 0.5
        }
        var marker = L.circle([latitude, longitude], radius, style);

        marker.on('click', function() {
            console.log(circleType)
        })
        marker.addTo(map);
        markers.push(marker);
    });
}
