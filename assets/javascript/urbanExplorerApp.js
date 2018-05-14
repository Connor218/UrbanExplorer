$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCIccHJ6pBk5j_LX4oNadIhetMTSSKr0ps",
        authDomain: "urbanexplorer-f961c.firebaseapp.com",
        databaseURL: "https://urbanexplorer-f961c.firebaseio.com",
        projectId: "urbanexplorer-f961c",
        storageBucket: "urbanexplorer-f961c.appspot.com",
        messagingSenderId: "919120165671"
    };
    firebase.initializeApp(config);

    //a path to the database, it stores all the input data
    var database = firebase.database();

    var foodArray = ["Night Life", "Coffee", "FastFood", "Vegan", "Asian", "Luxury"];
    var foodIconArray = ["assets/images/00.png", "assets/images/01.png", "assets/images/02.png", "assets/images/03.png", "assets/images/04.png", "assets/images/05.png"];
    var addressGeometryLat = 0;
    var addressGeometryLong = 0;
    var cityName;

    var buttonHooker = $("#foodButtonWrapper");  // create a variable to hook all buttons ad future user input append

    function renderButtons(arr) {             // create a function to render current game array as  buttons
        for (var i = 0; i < arr.length; i++) {

            var newDiv = $("<div>").attr("class", "imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
            var newImg = $("<img>").attr("src", foodIconArray[i]);
            newImg.attr("class", "imgButtons");
            //newImg.attr("data-hover",foodIconArrayHover[i]);
            newImg.attr("data-foodtype", foodArray[i]);

            newImg.attr("data-foodindex", i);        // added

            var newP = $("<p>").text(foodArray[i]);
            newP.attr("class", "text-center");
            newDiv.append(newImg, newP);
            buttonHooker.append(newDiv);
        }
    }

    // $("#myform").submit(function (event) {
    //     event.preventDefault();

    // });


    //define a variable to capture user click and store button's value into the var
    // var currentQueryVar;
    $(document).on("click", "#searchButton", function (event) {
        event.preventDefault();


        //     //change the logo location on click
        $("#demo").css("margin-left", "+=-350");

        //function that replaces dots with spaces
        //console.log("reset address" + inputAddressValidation($("#searchField").val()));
        inputAddressValidation($("#searchField").val());


        currentQueryVar = $("#searchField").val();
        //console.log(currentQueryVar);
        var currentURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + currentQueryVar + "key=AIzaSyBGnYxlsr-8atPpbWbMsM2crsD-kah9JAI";
        //*************  Google Geo API ***************
        $.ajax({
            url: currentURL,
            method: "GET"
        }).then(function (response) {
            //log full response
            console.log(response);
            console.log(currentURL);
            // $("#contentContainer").text(JSON.stringify(response));

            //formated address
            // console.log("the formatted address is: " + response.results[0].formatted_address)
            //address geometry
            addressGeometryLat = response.results[0].geometry.location.lat
            //console.log("the geometry of location latitude is: " + response.results[0].geometry.location.lat)
            addressGeometryLong = response.results[0].geometry.location.lng
            //console.log("the geometry of location longitude is: " + response.results[0].geometry.location.lng)
            //we are going to use the cityName variable to use in weather API AJAX
            cityName = response.results[0].address_components[3].long_name
            //console.log("the name of the city is: " + response.results[0].address_components[3].long_name)

            //call weather api to extract weather information using cityname as parameter
            var APIKey = "ae1eea3fe56f73fb07fdc6e4480bc31b";
            // Here we are building the URL we need to query the database passing th cityName from geoapi call to this inner ajax call
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
                "q=" + cityName + "&units=imperial&appid=" + APIKey;


            //*************  OpenWeatherMap API ***************
            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // Log the queryURL
                //console.log(queryURL);
                // Log the resulting object
                //console.log(response);
                // Transfer content to HTML
                var weatherHooker = $("#cityWeather"); // get hold of the cityweaher class container prepare to append to this div
                weatherHooker.empty();  // empty the contents inside this container to avoid overlapping append
                var newCity = $("<div>").attr("class", "city text-center");  // create city div
                var newTemp = $("<div>").attr("class", "temp text-center");    // create temp div
                var newThermo = $("<img>").attr("src", "assets/images/thermo.png");
                newThermo.attr("width", "45px");
                newTemp.append(newThermo);
                weatherHooker.append(newCity, newTemp);


                $(".city").html("<h5>" + response.name + " Weather </h5>");
                // $(".wind").text("Wind Speed: " + response.wind.speed);
                // $(".humidity").text("Humidity: " + response.main.humidity);
                $(".temp").prepend($("<span>").text("Temperature (F) " + response.main.temp));
                // Log the data in the console as well
                // console.log("Wind Speed: " + response.wind.speed);
                // console.log("Humidity: " + response.main.humidity);
                // console.log("Temperature (F): " + response.main.temp);
            });
            //*************  OpenWeatherMap API ends here ***************
            // Render food type buttons to allow user to choose food
            $("#foodButtonWrapper").empty();
            renderButtons(foodArray);   //render food array button to html page

            //take the input data(address) and push it to firebase database(button for adding address)

            //the value of user input
            var userInputAddress = $("#searchField").val().trim()

            //to empty the serach box
            $("#searchField").val("");

            //holding the address info/data in local object
            //push(upload) our data to firebase every time the form gets submited with unique key
            database.ref().push({
                userInputAddress: userInputAddress

            }).then(function (data) {
                console.log(data)
            })
            //(if we wanted to display address on the screen later on) create firebase event for adding address to the database 
            //and a row in html when a user adds an entry
            database.ref().on("child_added", function (childSnapshot) {
                //console.log(childSnapshot.val());
                // Store everything into a variable.
                var userInputAddress = childSnapshot.val().inputAddress;
            });
        });
    });
    renderButtons(foodArray);   //for debug testing use, delete before publish render food array button to html page


    //user click the imgButtons calling google place api

    // testing google own method
    var map;
    // var infowindow;

    function initMap(someVar) {   
        var pyrmont = { lat: addressGeometryLat, lng: addressGeometryLong }; 

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
            keyword: someVar,  
        }, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            $("#contentContainer").empty();  // empty out the table area in a new circle
            renderTableHeader();  //render table data
            for (var i = 0; i < results.length; i++) {
                var place = results[i];  //travese through a list of returned restaurant objects
                console.log(place.name); //restaurant name
                // console.log(place.place_id);
                console.log(place.rating);      //restaurant rating
                console.log(place.vicinity);    //restaurant address
                console.log("lat = " + place.geometry.location.lat());   //restaurant lat info
                console.log("lon = " + place.geometry.location.lng());   //restaurant long info
                console.log("Open? " + place.opening_hours.open_now);  //restaurant still opening or not

                // var types = String(place.types);
                // types = types.split(",");
                // console.log(types[0]);
                renderTableData(i + 1, place.name, place.vicinity, calcDistance(place.geometry.location.lat(),place.geometry.location.lng(),addressGeometryLat, addressGeometryLong), place.rating, place.opening_hours.open_now);

            }
        }
    }

    ////******/

    //user click the imgButtons calling google place api

    var foodQueryVar;

    $(document).on("click", ".imgButtons", function () {

        foodQueryVar = $(this).attr("data-foodtype");
        console.log(foodQueryVar);
        initMap(foodQueryVar);

    });


    //deal with hover effect 
    // reference link https://www.w3schools.com/jquery/event_hover.asp
    $(document).on("mouseover", ".imgButtons", function () {
        $(this).hover(function () { $(this).attr("src", "assets/images/0" + $(this).attr("data-foodindex") + "i.png") },
            function () { $(this).attr("src", "assets/images/0" + $(this).attr("data-foodindex") + ".png")});

    });

    // separate table header render from tbody data.

    function renderTableHeader() {
        var tableHooker = $("#contentContainer");
        var table = $("<table>").attr("class", "table table-striped table-dark");
        var thead = $("<thead>").html("<tr><th scope=\"col\">#</th><th scope=\"col\">Name of Place</th><th scope=\"col\">Address</th><th scope=\"col\">Appx Distance (Miles)</th><th scope=\"col\">Rating (Max 5.0)</th><th scope=\"col\">Open</th></tr>");
        var tbody = $("<tbody>").attr("id", "table-content"); // define tbody id hooker to make future data append easier
        table.append(thead, tbody);
        tableHooker.append(table);
    }

    // define a recallable table body render to fill in the table data
    function renderTableData(a, b, c, d, e, f) {
        var tableContentHooker = $("#table-content");
        var tdata = $("<tr>").html("<td scope=\"col\">"+ a +"</td><td scope=\"col\">"+b+"</td><td scope=\"col\">"+c+"</td><td scope=\"col\">"+d+"</td><td scope=\"col\">"+e+"</td><td scope=\"col\">"+f+"</td>");    

        tableContentHooker.append(tdata);

    }

    // function that replaces dots with spaces
    function inputAddressValidation(inputString) {
        var dotReplacedInput = inputString.replace(/\./g, " ");
        console.log("revised address is: ", dotReplacedInput);
        return dotReplacedInput
    }


    // To calculate distance between two coordinates 
    function calcDistance(pointAx, pointAy, pointBx, pointBy) {

        var xDistanceDegree = pointBx - pointAx
        var yDistanceDegree = pointBy - pointAy
        // console.log(xDistance +" " + yDistance);

        // DistanceDegree values are in latitude and longitude. Need to convert from degrees to miles. 68.703 represents 1 degree in miles
        // Calculating the hypotenuse of a right triangle

    var zDistanceMiles = 68.703*(Math.sqrt((xDistanceDegree * xDistanceDegree) + (yDistanceDegree * yDistanceDegree)));
    // console.log(zDistance);
    zDistanceMiles = Math.round(zDistanceMiles * 10) / 10;
    return zDistanceMiles;
}


});



