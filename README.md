# GifDigger
UC Berkeley coding assignment 6

### Overview

In this assignment, you'll use the GIPHY API to make a dynamic web page that populates with gifs of your choice. To finish this task, you must call the GIPHY API and use JavaScript and jQuery to change the HTML of your site.

![GIPHY](Images/1-giphy.jpg)

### Before You Begin

1. **Hit the GIPHY API**.
   * Fool around with the GIPHY API. [Giphy API](https://github.com/Giphy).
   * Be sure to read about these GIPHY parameters (hint, hint):
     * `q`
     * `limit`
     * `rating`
   * Like many APIs, GIPHY requires developers to use a key to access their API data. To use the GIPHY API, you'll need a GIPHY account (don't worry, it's free!) and then obtain an API Key by [creating an app](https://developers.giphy.com/dashboard/?create=true).
   * Make sure you switch the protocol in the query URL from **`http to https`**, or the app may not work properly when deployed to Github Pages.

### Instructions

1. Before you can make any part of our site work, you need to create an array of strings, each one related to a topic that interests you. Save it to a variable called `topics`.
   * We chose animals for our theme, but you can make a list to your own liking.

2. Your app should take the topics in this array and create buttons in your HTML.
   * Try using a loop that appends a button for each string in the array.

3. When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.

4. When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.

5. Under every gif, display its rating (PG, G, so on).
   * This data is provided by the GIPHY API.
   * Only once you get images displaying with button presses should you move on to the next step.

6. Add a form to your page takes the value from a user input box and adds it into your `topics` array. Then make a function call that takes each topic in the array remakes the buttons on the page.


## Technology used
* jQuery and javascript AJAX
* Html
* Css
* Bootstrap framework 


## Key learning points
```javascript
    $.ajax({
        url:currentURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    
        renderImg(response);
    });
```
* ajax calling format

```javascript
function renderImg(obj){
    $("#gifContainer").html("");  // empty the container for new content;
    for(var i =0; i<obj.data.length; i++ ){
      ...
    }
  ...
}
```
* render a returned Json object

```javascript
if(imgRatio<2.3&& imgRatio>1.4 && obj.data[i].images.original_still.width >200){    
    console.log("right size");
    ...
}
```
* filer the returned object by it's size information, render those only the right sized images

```javascript
function renderButtons(arr){             // create a function to render current game array 
    for (var i = 0; i <arr.length; i++){
        var newButton = $("<button>");
        newButton.text(arr[i]);
        newButton.attr("class","buttons text-center badge badge-pill badge-secondary");
        newButton.attr("value",arr[i]);
        buttonHooker.append(newButton);
    }
}
```
* only button tags can assign value and retrieve the value later on

```javascript
newImg.attr("data-still",obj.data[i].images.original.url);
newImg.attr("data-animate",obj.data[i].images.original_still.url);
newImg.attr("data-state","still");
```
* define two data attribute to store url link info, toggle img src attribute according to user click

```javascript
$("#game-input").on("change",function(){
    var game = $("#game-input").val().trim();
    if(game!= ''){
        gameArray.push(game);
    }
    renderUserButton(game);
    $("#game-input").val("");
})
```
* review syntax for onchange event handler

```javascript
  localStorage.setItem("gameArrayInStorage",JSON.stringify(gameArray));
```
* how to use localStorage to store varibles including the [] type data using 
json stringify build in function

## Installation
Download the zip file, unzip on the desktop, open index.html

## Link to the site
[Click me](https://kittyshen.github.io/GifDigger/)

## Author 
[Kitty Shen ](https://github.com/kittyshen)

https://github.com/kittyshen

## License
Standard MIT License