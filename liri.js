require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
// var Spotify = require('node-spotify-api');

var SpotifyWebApi = require('spotify-web-api-node');
var request = require("request");
var fs = require("fs");



// var spotify = new Spotify(keys.spotify);
var spotifyApi = new SpotifyWebApi(keys.spotify);
var client = new Twitter(keys.twitter);

// Retrieve an access token.


var params = { screen_name: 'rocktest6' };

var userInput = process.argv;

var userCommand = userInput[2];
var userArgument = userInput[3];

function tweeting(){
     client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        } else {
            console.log(error);
        }
    });
}

function spot(){
       spotifyApi.clientCredentialsGrant()
        .then(function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.searchTracks(userArgument)
                .then(function (data) {
                    console.log(data.body);
                }, function (err) {
                    console.error(err);
                }), function (err) {
                    console.log('Something went wrong when retrieving an access token', err);
                };

        });
}

function movies(){
     if (typeof userArgument == "undefined") {
        userArgument = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userArgument + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (typeof JSON.parse(body).Title == "undefined") {
                console.log("Movie not found.  Check spelling or enter different title.");
            } else {
                console.log("title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        } else {
            console.log(error, response);
        }
    });
}

if (userCommand === "my-tweets") {
   tweets();
}

// if (request[2]==="spotify-this-song"){
//     spotify.search({ type: 'track', query: request[3] }, function(err, data) {
//         if (err) {
//           return console.log('Error occurred: ' + err);
//         }

//       console.log(data); 
//       });
// }
// spotifyApi.clientCredentialsGrant()
//     .then(function (data) {
//         console.log('The access token expires in ' + data.body['expires_in']);
//         console.log('The access token is ' + data.body['access_token']);

//         // Save the access token so that it's used in future calls
//         spotifyApi.setAccessToken(data.body['access_token']);


//     }, function (err) {
//         console.log('Something went wrong when retrieving an access token', err);
//     });

if (userCommand === "spotify-this-song") {
 spot();
}

var queryUrl = "http://www.omdbapi.com/?t=" + userArgument + "&y=&plot=short&apikey=trilogy";

if (userCommand === "movie-this") {
   movies();
}

if (userCommand === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        data = data.replace(/['"]+/g, '');
        var readCommands = data.split(", ");

        console.log(readCommands);

        userArgument = readCommands[1];

        switch(readCommands[0]){
            case "my-tweets":
            tweets();
            break;
            case "spotify-this-song":
            spot();
            break;
            case "movie-this":
            movies();
            break;
        }
    });
}