require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
// var Spotify = require('node-spotify-api');

var SpotifyWebApi = require('spotify-web-api-node');


// var spotify = new Spotify(keys.spotify);
var spotifyApi = new SpotifyWebApi(keys.spotify);
var client = new Twitter(keys.twitter);

// Retrieve an access token.


var params = { screen_name: 'rocktest6' };

var request = process.argv;

if (request[2] === "my-tweets") {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        } else {
            console.log(error);
        }
    });
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

if (request[2] === "spotify-this-song") {
    spotifyApi.clientCredentialsGrant()
        .then(function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            console.log(spotifyApi);

            spotifyApi.searchTracks(request[3])
                .then(function (data) {
                    console.log( data.body);
                }, function (err) {
                    console.error(err);
                }), function (err) {
                    console.log('Something went wrong when retrieving an access token', err);
                };

        });
}
