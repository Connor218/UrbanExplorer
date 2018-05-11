var foodArray = ["drink", "coffee", "fastfood", "vegan", "asia", "steak"];
var foodIconArray =["assets/images/00.png","assets/images/01.png","assets/images/02.png","assets/images/03.png","assets/images/04.png","assets/images/05.png"];

var buttonHooker = $("#foodButtonWrapper");  // create a variable to hook all buttons ad future user input append

function renderButtons(arr){             // create a function to render current game array as  buttons
    for (var i = 0; i <arr.length; i++){

        var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
        var newImg = $("<img>").attr("src", foodIconArray[i]);
        newImg.attr("class","imgButtons");
        // newImg.attr("data-hover",foodIconArrayHover[i]);
        newImg.attr("data-foodtype",foodArray[i]);
        var newP = $("<p>").text(foodArray[i]);
        newP.attr("class","text-center");
        newDiv.append(newImg,newP);
        buttonHooker.append(newDiv);
    }
}
renderButtons(foodArray);   //render game array button to html page


//define a variable to capture user click and store button's value into the var
var currentQueryVar;
$(document).on("click", "#searchButton", function(event){
    event.preventDefault();

    currentQueryVar = $("#searchField").val();
    console.log(currentQueryVar);
    var currentURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + currentQueryVar +"key=AIzaSyBGnYxlsr-8atPpbWbMsM2crsD-kah9JAI";

    $.ajax({
        url:currentURL,
        method: "GET"
    }).then(function(response){
        //log full response
        console.log(response);
        // $("#contentContainer").text(JSON.stringify(response));

        //formated address
        console.log("the formatted address is: " + response.results[0].formatted_address)
        //address geometry
        var addressGeometryLat = response.results[0].geometry.location.lat
        console.log("the geometry of location latitude is: " + response.results[0].geometry.location.lat)
        var addressGeometryLong = response.results[0].geometry.location.lng
        console.log("the geometry of location longitude is: " + response.results[0].geometry.location.lng)
        //we are going to use the cityName variable to use in weather API AJAX
        var cityName = response.results[0].address_components[3].long_name
        console.log("the name of the city is: " + response.results[0].address_components[3].long_name)
    });
});

//user click the imgButtons calling google place api

// testing google own method
var map;
// var infowindow;

function initMap() {
  var pyrmont = {lat: 37.4228775, lng: -122.085133};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

//   infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 3500,
    type: ['restaurant'],
    keyword:'steak',
  }, callback);
}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(place.name);
        // console.log(place.place_id);
        console.log(place.rating);
        console.log(place.vicinity);
        console.log("lat = " +place.geometry.location.lat());
        console.log("lon = " +place.geometry.location.lng());
        var types = String(place.types);
        types = types.split(",");
        console.log(types[0]);
    }
  }
}

////******/

//user click the imgButtons calling google place api

var foodQueryVar;
var lat =37.4228775;  // need to pass in those parameters by parsing data from google geo coding api
var lon = -122.085133;      // for now testing purpose just assign some value
$(document).on("click", ".imgButtons", function(){

    foodQueryVar = $(this).attr("data-type");
    console.log(foodQueryVar);
    initMap();

});
