const express = require("express");
const app = express(); 
app.set("view engine", "ejs"); 
app.use(express.static("public")); //folder for images, cs, js

const request = require('request'); // get the content from webpage

//routes
app.get("/", async function(req, res){ // 2) Declare function with await keyword as async

    let keywordArray = ["otters", "winter", "sunflower", "cats"]; 
    let randomIndex = Math.floor(Math.random() * keywordArray.length); 
    let parsedData = await getImages(keywordArray[randomIndex], "horizontal"); // 1) Declare async code as await - wait for getImages() to return 
                                                            // 3) getImages() must return a Promise object - whether it has been fulfilled or not
    
    let randomIndices = getRandomIndices(parsedData.hits.length); 
    console.dir("parsedData: " + parsedData); //display content of object
    
    res.render("index", {"images":parsedData, "randomIndices": randomIndices}); //variable_name, variable 

    
}); //root route

app.get("/results", async function(req, res) {
    
    // console.dir(req); 
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    let orientation = req.query.orientation; 
    // let parameters = req.URL.query; 
    
    // console.log(parameters);
    
    let parsedData = await getImages(keyword, orientation); 
    
    let randomIndices = getRandomIndices(parsedData.hits.length); 
    console.dir("parsedData: " + parsedData); //display content of object
    
    res.render("index", {"images":parsedData, "randomIndices": randomIndices}); //variable_name, variable 
    
}); //results route

function getRandomIndices(totalHits) {
    let SIZE = 4; 
    var arr = new Array(SIZE);
    let i = 0;
    while (i < SIZE) {
        var randomNumber = (Math.floor((Math.random()) * totalHits));
        if (!(arr.includes(randomNumber))) {
            arr[i] = randomNumber;
            i ++;
        }
    }
    return arr; 
}

// Returns all data from the Pixaby API as JSON format
function getImages(keyword, orientation) {
    let URL = "https://pixabay.com/api/?key=";
    let API_KEY = "15391705-950cb256f2c7cb87c365c78fc"; 
    let parameters = "&q=" + keyword + "&orientation=" + orientation;
    return new Promise(function(resolve, reject){
        request(URL + API_KEY + parameters, function (error, response, body) {
            
            if (!error && response.statusCode == 200) { //no issues in the request
                // the data we are getting from API is plain-text. We need to convert it to JSON
                // which will then allow us to extract the data. 
                let parsedData = JSON.parse(body); //converts string to JSON
                
                resolve(parsedData); 
                
                
                // res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                
                // pass parameters from route(/) to view (index.ejs)
                // res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL}); //variable_name, variable 
                
            } else {
                reject(error); 
                console.log(response.statusCode); 
                console.log(error); 
            } 
        }); //request
    }); //Promise 
}
//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
}); 