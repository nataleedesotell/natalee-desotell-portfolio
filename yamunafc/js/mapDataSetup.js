var map = L.map('map', {
  center: [28.6139, 77.2090],
  zoom: 9,
  minZoom: 4,
  maxZoom: 16,
  zoomControl: false,
});

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id:'mapbox.streets',
    accessToken:'pk.eyJ1IjoibmF0YWxlZWRlc290ZWxsIiwiYSI6ImNqbzYyb3BtbjBnNzUzcXFtN3JycWJvMzAifQ.yBDabAw2e-7FOB7GAnFagA'
}).addTo(map);

$.ajax("data/fc.geojson", {
  dataType: "json",
  success: function(response) {

    //create a Leaflet GeoJSON Cluster Group layer
    var priceToRentRatiosClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: true,
      maxClusterRadius: 1, 
      removeOutsideVisibleBounds: false,
      iconCreateFunction: function(cluster) {
        /*var childCount = cluster.getChildCount();

        var c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(30, 30),
        });*/

        //Modify cluster markers based on child's properties

        var childCount = cluster.getChildCount();
        var children = cluster.getAllChildMarkers();
        var radii = 0;
        var fillColors = [];

        for (i=0; i<children.length; i++) {
          radii += children[i].options.radius;
          if (children[i].options.radius == 0) {
            //don't count children w/ radius 0 in the total!
            childCount--;
          }
          fillColors[fillColors.length] = children[i].options.fillColor;
        }

        var radius = radii/childCount;
        fillColors.sort(); //this way we know similar values are grouped

        var fillColorFrequencies = [];
        fillColorFrequencies.push({color: fillColors[0], frequency: 1});

        for (i=1; i<fillColors.length; i++) {
          if (fillColors[i] == fillColorFrequencies[fillColorFrequencies.length-1].color) {
            fillColorFrequencies[fillColorFrequencies.length-1].frequency++;
          } else {
            fillColorFrequencies.push({color: fillColors[i], frequency: 1});
          }
        }
        
        var fillColor = fillColorFrequencies[0];
        for (i=1; i<fillColorFrequencies.length; i++) {
          if (fillColorFrequencies[i].frequency >= fillColor.frequency) {
            fillColor = fillColorFrequencies[i];
          }
        }

        var colorClass = '';
        if (fillColor.color == '#feedde') {
          colorClass = 'color5';
        } else if (fillColor.color == '#fdbe85') {
          colorClass = 'color4';
        } else if (fillColor.color == '#fd8d3c') {
          colorClass = 'color3';
        } else if (fillColor.color == '#e6550d') {
          colorClass = 'color2';
        } else if (fillColor.color == '#a63603') {
          colorClass = 'color1';
        } else {
          colorClass = 'defaultColor';
        }

        if (radius === 0 || childCount === 0) {
          childCount = '';
        }

        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster myCustomIcon ' + colorClass,
          iconSize: new L.Point(radius*2, radius*2),
        });
      },
    });

    var priceToRentRatiosGeoJSON = L.geoJson(response, {
      //L.geoJson function options
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          //circleMarkerOptions
          radius: calcPropRadius(feature.properties['2016']),
          fillColor: '#C71585',
          color: "#fff",
          weight: 0.0,
          opacity: 0.8,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature,
    });

    //add the JSON to the Cluster group, and the Cluster group to the map
    priceToRentRatiosClusterGroup.addLayer(priceToRentRatiosGeoJSON);
    map.addLayer(priceToRentRatiosClusterGroup);

    //establish panning bounds for the map
    var boundsMargin = 8;
    var dataBounds = priceToRentRatiosClusterGroup.getBounds();
    var mapBounds = L.latLngBounds(
      L.latLng(dataBounds.getSouth()-boundsMargin, dataBounds.getWest()-boundsMargin),
      L.latLng(dataBounds.getNorth()+boundsMargin, dataBounds.getEast()+boundsMargin)
    );
    map.setMaxBounds(mapBounds);
    map.fitBounds(mapBounds);

    //get attribute labels
    var attributes = extractAttributeLabels(response);

    //this function found in separate file. Must be called within AJAX success
    //function b/c it uses attribute values extracted from the retrived data
    setupControls(map, attributes, priceToRentRatiosClusterGroup);
  }
});

function onEachFeaturePopupSetup(layer, popupContent) {
  //event listeners to open popup on hover,
  //and close it on un-hover, with no flickering
  //and disabling clickability
  layer.on({
    mouseover: function(){
      this.bindPopup(popupContent, {
        offset: new L.Point(0,-6),
        className: 'activePopup',
      }).openPopup().unbindPopup();
      // ^^ binding the popup, opening it, and unbinding it
      //means the user can't click the icon after hover and
      //make the popup flicker on/off
    },
    mouseout: function(){
      $('.activePopup').hide(); //we assigned a class above so we could
      //do this, despite the fact that the popup is no longer bound
      //to the marker, tehehehe ;)
    },
  });
}

function generatePopup(feature, attribute) {
  return '<strong>' + feature.properties['toGeocode'] + '</strong>' + '</br>'
    + '<span class="popupAttributeLabel">Fecal Coliform Mean Level (MPN/100 mL) <em>(' + attribute + ')</em></span>' + '</br>'
    + '<span class="popupAttributeValue">' + feature.properties[attribute];
}

function onEachFeature(feature, layer) {
    var popupContent = generatePopup(feature, '2016');
    onEachFeaturePopupSetup(layer, popupContent);
};

function calcPropRadius(attValue) {

    var radius;
    //scale factor to adjust symbol size evenly
    var scaleFactor = 1;
    //radius calculated
    radius = Math.log(attValue*scaleFactor);

    //discrete values
    /*if (attValue <= 10) {
      radius = 4;
    } else if (attValue > 10 && attValue <= 12.5) {
      radius = 6;
    } else if (attValue > 12.5 && attValue <= 15) {
      radius = 8;
    } else if (attValue > 15) {
      radius = 10;
    } else {
      console.log('attribute value not accounted for!');
    }*/

    return radius;
};

function calcSymbolColor(attValue) {

  var color;

  if (attValue <= 0.00) {
    color = '#cccccc';
  } else if (attValue > 0.00 && attValue <= 100.00) {
    color = '#f1eef6';
  } else if (attValue > 100.001 && attValue <= 1000.00) {
    color = '#d4b9da';
  } else if (attValue > 1000.01 && attValue <= 10000.00) {
    color = '#c994c7';
  } else if (attValue > 10000.01 && attValue <= 100000.00) {
    color = '#df65b0';
  } else if (attValue > 100000.01 && attValue <= 1000000.00) {
    color = '#e7298a';
  } else if (attValue > 1000000.01 && attValue <= 10000000.00) {
    color = '#ce1256';
  } else if (attValue > 10000000.01) {
    color = '#91003f';
  } else {
    console.log('attribute value not accounted for!');
  }

  return color;
}

function extractAttributeLabels(data) {
  //empty array to hold attributes
  var attributes = [];

  //properties of the first feature in the dataset
  var properties = data.features[0].properties;

  //push each attribute name into attributes array
  for (var attribute in properties){
      //only take attributes with price-to-rent ratios
      if (attribute.indexOf("20") > -1){
          attributes.push(attribute);
      };
  };

  return attributes;
}


$('#title .fa').tooltip({
  content: 'The Yamuna is India\'s most polluted river, and fecal coliform is one measure of that can indicate how safe it is for drinking, bathing, or agriculture. These data were retrieved from Open Data India.',
});