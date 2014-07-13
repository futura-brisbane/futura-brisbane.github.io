// Configure the styles for our map
var defaultStyles = {
    "Library": {
        radius: 1500,
        fillColor: '#1f77b4' /*dark blue*/
    },
    "Schools": {
        radius: 500,
        fillColor: '#ff7f0e' /*orange*/

    },
    "BusinessCentre": {
        radius: 500,
        fillColor: '#2ca02c' /*green*/

    },
    "BusStops": {
        radius: 500,
        fillColor: '#d62728' /*red*/

    },
    "Parks": {
        radius: 500,
        fillColor: '#FFCCFF' /*Pink*/

    },
    "PetShops": {
        radius: 500,
        fillColor: '#e377c2' /*dark pink*/

    },
    "WifiHotSpot": {
        radius: 500,
        fillColor: '#99CCFF' /*light blue*/

    }
}

// Setup everything ready to go
$(document).ready(function() {

    createMap();
    $('#displayMap').click(createUserMap);

})

function createUserMap() {
    selectStyles();
    drawLegend();
    loadData();
    $('html, body').animate({
        scrollTop: $("#map").offset().top
    }, 1000);
}


function selectStyles() {
    selectedStyles = {};
    $('input.data-available:checked').each(function() {
        var name = this.name;
        var category = $(this).val();
        var radius = $('input[name=' + category + ']:checked').val();
        selectedStyles[name] = {
            radius: radius,
            fillColor: defaultStyles[name].fillColor
        };
    });
}

legend = 0;
function drawLegend() {
    if (legend) {
        map.removeControl(legend);
    }
    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        $.each(selectedStyles, function(name, style) {
            div.innerHTML +=
                '<i style="background:' + style.fillColor + '"></i> ' +name + '<br>';

            });

        return div;
    };

    legend.addTo(map);
}

function createMap() {

    $('#map').css({height:'500px'});


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

    drawMarkers(csvData);
}

var markers = [];
function drawMarkers(data) {
    $.each(markers, function(i, marker) {
        map.removeLayer(marker);
    });
    markers = [];

    $.each(data, function(i, val) {
        var circleType = val[0];
        var latitude = val[1];
        var longitude = val[2];
        if (!selectedStyles[circleType]) {
            // console.log("No matching style for: " + circleType);
            return;
        }

        if (!latitude || !longitude) {
            console.log("Invalid lat or long at line: " + (i + 1));
            return;
        }

        var radius = selectedStyles[circleType].radius;
        var style = {
            color: selectedStyles[circleType].fillColor,
            stroke: false,
            fillOpacity: 0.3
        }
        var marker = L.circle([latitude, longitude], radius, style);

        marker.on('click', function() {
            console.log(circleType)
        })
        marker.addTo(map);
        markers.push(marker);
    });
}
