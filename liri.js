require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
// var Spotify = require('node-spotify-api');

var SpotifyWebApi = require('spotify-web-api-node');
var request = require("request");
var fs = require("fs");

function logCommand() {
    if (typeof userArgument === "undefined") {
        userArgument = "";
    }
    fs.appendFile("log.txt", "\n" + "\n" + userCommand + " " + userArgument + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

// var spotify = new Spotify(keys.spotify);
var spotifyApi = new SpotifyWebApi(keys.spotify);
var client = new Twitter(keys.twitter);

// Retrieve an access token.


var params = { screen_name: 'rocktest6' };

var userInput = process.argv;

var userCommand = userInput[2];
var userArgument = userInput[3];
var maxTweets;

function tweeting() {
    logCommand();
    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (tweets.length < 20) {
            maxTweets = tweets.length;
        } else {
            maxTweets = 20;
        }
        if (!error) {
            for (var i = 0; i < maxTweets; i++) {
                var show = "Tweet #" + (i + 1) + ": " + tweets[i].text + "  (created on: " + tweets[i].created_at + ")";
                console.log(show);
                fs.appendFile("log.txt", "\n" + show, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
            }
        } else {
            console.log(error);
        }
    });
}

function spot() {
    logCommand();
    spotifyApi.clientCredentialsGrant()
        .then(function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls

            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
            console.log(userArgument)

            spotifyApi.searchTracks(userArgument, { market: "us", limit: 10, offset: 5 })
                .then(function (data) {
                    console.log(data.body.tracks.items[0].album.artists[0].name);
                    console.log(data.body.tracks.items[0].album.name); //Album name
                    console.log(data.body.tracks.items[0].name) //Song name
                    console.log(data.body.tracks.items[0].popularity)
                    console.log(data.body.tracks.items[0].preview_url)
                    fs.appendFile("log.txt", "\n" + data.body, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    })
                }, function (err) {
                    console.error(err);
                }), function (err) {
                    console.log('Something went wrong when retrieving an access token', err);
                };

        });
}

function movies() {
    logCommand();
    
    var queryUrl = "http://www.omdbapi.com/?t=" + userArgument + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (typeof JSON.parse(body).Title == "undefined" && userArgument == "undefined") {
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

                fs.appendFile("log.txt", "\n" + "title: " + JSON.parse(body).Title, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "Year: " + JSON.parse(body).Year, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "IMDB Rating: " + JSON.parse(body).imdbRating, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })

                fs.appendFile("log.txt", "\n" + "Country: " + JSON.parse(body).Country, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "Language: " + JSON.parse(body).Language, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "Plot: " + JSON.parse(body).Plot, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
                fs.appendFile("log.txt", "\n" + "Actors: " + JSON.parse(body).Actors, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })

            }
        } else {
            console.log(error, response);
        }
    });
}

if (userCommand === "my-tweets") {
    tweeting();
}

if (userCommand === "spotify-this-song") {
    spot();
}

var queryUrl = "http://www.omdbapi.com/?t=" + userArgument + "&y=&plot=short&apikey=trilogy";

if (userCommand === "movie-this") {
    if (typeof userArgument == "undefined") {
        userArgument = "Mr. Nobody";
    }
    movies();
}

if (userCommand === "do-what-it-says") {
    logCommand();
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        data = data.replace(/['"]+/g, '');
        var readCommands = data.split(", ");

        console.log(readCommands);

        userArgument = readCommands[1];

        switch (readCommands[0]) {
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