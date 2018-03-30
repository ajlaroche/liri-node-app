require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var params = {screen_name: 'rocktest6'};

var request = process.argv;

if (request[2]==="my-tweets"){
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          console.log(tweets);
        } else{
            console.log(error);
        }
      });
}