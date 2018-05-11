
var gameArray = ["Beyond Two Souls", "Dark Souls 3", "Monster Hunter: World", "Detroit: Become Human", "Mass Effect 3", "Destiny 2"];
// adding the following code to enable user retrive user added game names saved on local storage.
console.log(localStorage.getItem("gameArrayInStorage"));
if(JSON.parse(localStorage.getItem("gameArrayInStorage")) != null){
    gameArray =JSON.parse(localStorage.getItem("gameArrayInStorage"));
}    
//render all the bottons according to the game array data
var buttonHooker = $("#buttonGroup");  // create a variable to hook all buttons ad future user input append

function renderButtons(arr){             // create a function to render current game array as  buttons
    for (var i = 0; i <arr.length; i++){
        var newButton = $("<button>");
        newButton.text(arr[i]);
        newButton.attr("class","buttons text-center badge badge-pill badge-secondary");
        newButton.attr("value",arr[i]);
        buttonHooker.append(newButton);
    }
}
renderButtons(gameArray);   //render game array button to html page

function renderUserButton(string){       // create a function to render user input as button
    var newButton = $("<button>");
    newButton.text(string);
    newButton.attr("class","buttons text-center badge badge-pill badge-secondary");
    newButton.attr("value",string);
    buttonHooker.append(newButton);
}
// renderUserButton("New game");  // testing 

function renderImg(obj){
    $("#gifContainer").html("");  // empty the container for new content;
    for(var i =0; i<obj.data.length; i++ ){
        // console.log(obj.data[i].images.original_still.url);
        var imgRatio = obj.data[i].images.original_still.width/obj.data[i].images.original_still.height;
        // console.log(imgRatio);
        // adding this to filter out the image that has ratio not fit the layout
        if(imgRatio<2.3&& imgRatio>1.4 && obj.data[i].images.original_still.width >200){    
            // console.log("right size");
            var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
            var newImg = $("<img>").attr("src", obj.data[i].images.original_still.url);
            newImg.attr("class","images");
            newImg.attr("data-still",obj.data[i].images.original.url);
            newImg.attr("data-animate",obj.data[i].images.original_still.url);
            newImg.attr("data-state","still");
            var newP = $("<p>").text(obj.data[i].title);
            newP.attr("class","text-center");
            newP.append("<br> Rating: "+obj.data[i].rating);
            newDiv.append(newImg,newP);
            $("#gifContainer").append(newDiv);
        }
    } 
}

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
        console.log(response);
        // $("#contentContainer").text(JSON.stringify(response));
        // renderImg(response);
    });
});

//user click the imgButtons calling google place api

var foodQueryVar;
var lat =37.4228775;  // need to pass in those parameters by parsing data from google geo coding api
var lon = -122.085133;      // for now testing purpose just assign some value
$(document).on("click", ".imgButtons", function(){

    foodQueryVar = $(this).attr("data-type");
    console.log(foodQueryVar);


    var currentURL = "http://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius=3000&type=restaurant&keyword="+foodQueryVar+ "&key=AIzaSyBGnYxlsr-8atPpbWbMsM2crsD-kah9JAI";
//query example https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.4228775,-122.085133&radius=3000&type=restaurant&keyword=vegan&key=AIzaSyBGnYxlsr-8atPpbWbMsM2crsD-kah9JAI
    console.log(currentURL);
    $.ajax({
        url:currentURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        // $("#contentContainer").text(JSON.stringify(response));
        // renderImg(response);
    });
});


// change image src after click event happening on the images
$(document).on("click",".images",function(){
    if($(this).attr("data-state") == "still"){
        console.log("hello");
        $(this).attr("src",$(this).attr("data-animate"));
        $(this).attr("data-state","animate");
    }
    else{
        $(this).attr("src",$(this).attr("data-still"));
        $(this).attr("data-state","still");
    }

});

$("#add-game").on("click", function(event) {
    event.preventDefault();
    // This line of code will grab the input from the textbox
    var game = $("#game-input").val().trim();
    // The game from the textbox is then added to gameArray
    if(game!= ''){
        gameArray.push(game);
        renderUserButton(game);
        localStorage.setItem("gameArrayInStorage",JSON.stringify(gameArray));
    }
    //Render the new Button
    $("#game-input").val("");
})