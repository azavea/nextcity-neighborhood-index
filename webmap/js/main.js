/* =====================
Leaflet Configuration
===================== */

//Creating the map
var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 12
});

//Adding the basemap
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//Style function to change style based on quantile breaks
var Total_Style = function(feature) {
  if (feature.properties.TotalScore <= -6){
      return {fillColor: "#BB4107", fillOpacity: 0.7, color: "#BB4107", weight: 2};  }
  if (feature.properties.TotalScore <= -3){
      return {fillColor: "#DC7C4E", fillOpacity: 0.7, color: "#DC7C4E", weight: 2};  }
  if (feature.properties.TotalScore <= 5){
      return {fillColor: "#C1B5C6", fillOpacity: 0.7, color: "#9D88A6", weight: 2};  }
  if (feature.properties.TotalScore <= 8){
      return {fillColor: "#6F4D8F", fillOpacity: 0.7, color: "#6F4D8F", weight: 2};  }
  if (feature.properties.TotalScore <= 14){
      return {fillColor: "#1F0439", fillOpacity: 0.7, color: "#1F0439", weight: 2};  }

};

// var Total_Style = function(feature) {
//   if (feature.properties.TotalScore <= -6){
//       return {fillColor: "#C35B29", fillOpacity: 0.7, color: "#C35B29", weight: 2};  }
//   if (feature.properties.TotalScore <= -3){
//       return {fillColor: "#DC7C4E", fillOpacity: 0.7, color: "#DC7C4E", weight: 2};  }
//   if (feature.properties.TotalScore <= 5){
//       return {fillColor: "#DFF6F5", fillOpacity: 0.7, color: "#7BC0BD", weight: 2};  }
//   if (feature.properties.TotalScore <= 8){
//       return {fillColor: "#4C9A97", fillOpacity: 0.7, color: "#4C9A97", weight: 2};  }
//   if (feature.properties.TotalScore <= 14){
//       return {fillColor: "#1A716E", fillOpacity: 0.7, color: "#1A716E", weight: 2};  }
//
// };

//Changing the opacity and line weight for when a feature is moused over
var overStyle = {
  fillOpacity: 0.3,
  weight: 6,
};

//Changing the opacity and line weight back to original
var outStyle = {
  fillOpacity: 0.7,
  weight: 2
};

//Creating a global variable to store the coordinates of each feature when it gets clicked on
var view = [];

//Function that dictates what happens to each feature of the leaflet layer
var eachFeature = function(feature, layer) {
  layer.bindLabel("<div id='text'>" + "<div id='name'>" + layer.feature.properties.Neighborho +
  "</div>" + " is " + "<b>" + "<span id='category'>" + '<style>#category{background-color:' + layer.feature.properties.color + '; padding: 5px;}</style>' +
   layer.feature.properties.category + "</b>" + "</span>" + "</div>" +
   "<br>" + "<table style='width:100%'>" + "<tr>" + "<td>Population Index</td>" + "<td>"+layer.feature.properties.PopScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Crime Index</td>" + "<td>" + layer.feature.properties.CrimeScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Median HH Income Index</td>" + "<td>"+layer.feature.properties.MHIScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Poverty Index</td>" + "<td>"+layer.feature.properties.PovScore + "</td>"+ "</tr>" + "</table>" );

  /* =====================
  The following code will run every time a feature on the map is moused over.
  ===================== */

  //Setting the style to change when a feature is moused over, and setting it back to its original state
  layer.on('mouseover', function() { layer.setStyle(overStyle);});
  layer.on('mouseout', function() { layer.setStyle(outStyle);});

  layer.on('click', function (e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */

    //pushing the lat long of each clicked feature into the view variable
    view.push(e.latlng.lat, e.latlng.lng);

    //setting the map view to center on clicked feature, zooming in to 14.
    map.setView(view, 14);

    //emptying the view variable so that it can be stored with new lat longs
    view = [];

  });
};

//Creating variable for the data
var dataset = 'https://raw.githubusercontent.com/azavea/nextcity-neighborhood-index/master/phila_neighborhoods_stress_index_v3.geojson';

//calling the data from github
$.getJSON(dataset, function(response) {
  //Creating the leaflet layer and adding it to the map
  //Calling the eachFeature and Total_Style functions
           var neighborhood = new L.geoJson(response, {
               onEachFeature: eachFeature,
               style: Total_Style
           }).addTo(map);
       });


//Function to assign the colors to the legend labels
function getColor(d) {
    return d == "Facing Challenges" ? '#BB4107' :
           d == "Falling Behind"    ? '#DC7C4E' :
           d == "Keeping Pace"      ? '#C1B5C6' :
           d == "Making Progress"   ? '#6F4D8F' :
           d == "Ahead of the Game" ? '#1F0439' :
                                      '#FFEDA0';
}



//We might use this later, if there are different colors for the borders, they will need to be added
//separately to the legend

// function getColor_border(d) {
//     return d == "-12 to -6"? '#C35B29' :
//            d == "-5 to -3" ? '#DC7C4E' :
//            d == "-2 to -1" ? '#FEA77D' :
//            d == "0"        ? '#DFF6F5' :
//            d == "1 to 5"   ? '#7BC0BD' :
//            d == "6 to 8"   ? '#4C9A97' :
//            d == "9 to 14"  ? '#1A716E' :
//                              '#FFEDA0';
// }


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

//Creating the div for the legend
    var div = L.DomUtil.create('div', 'info legend title'),
        grades = ["Facing Challenges", "Falling Behind", "Keeping Pace", "Making Progress", "Ahead of the Game" ];

//Legend label
    div.innerHTML += '<b>Score</b><br>';  // don't forget the break tag

// loop through intervals and generate a label with a colored block for each interval
//This is looking through the grades variable created above and pulling the corresponding color from the getColor function
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + getColor(grades[i]) + '"></i> ' +
           (grades[i] ? grades[i] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
