$(document).ready(function () {

    console.log("Lettt's get started!");
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCIccHJ6pBk5j_LX4oNadIhetMTSSKr0ps",
        authDomain: "urbanexplorer-f961c.firebaseapp.com",
        databaseURL: "https://urbanexplorer-f961c.firebaseio.com",
        projectId: "urbanexplorer-f961c",
        storageBucket: "",
        messagingSenderId: "919120165671"
    };
    firebase.initializeApp(config);
    //a path to the database, it stores all the input data
    var database = firebase.database();
   
    //take the input data(address) and push it to firebase database(button for adding address)
    $("#myform").submit(function (event) {
        event.preventDefault();
        //console.log("works");
        //the value of user input
        var userInputAddress = $("#searchField").val().trim()

         //to empty the serach box
         $("#searchField").val("");

        //holding the address info/data in local object
        //push(upload) our data to firebase every time the form gets submited with unique key
        database.ref().push({
            userInputAddress: userInputAddress
           
        })
    });
    //(if we wanted to display address on the screen) create firebase event for adding address to the database 
    //and a row in html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        // Store everything into a variable.
        var userInputAddress = childSnapshot.val().inputAddress;
    });

});