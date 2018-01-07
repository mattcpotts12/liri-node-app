//read and set any environment variables with the dotenv package
require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//access spotify and twitter API key info
//var spotifySearch = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: "dcfcc95e202d4fd389ae897d17bc420e",
    secret: "2fe2ed2183884a059962bd6e57bfe2da"
});
var client = new Twitter(keys.twitter);

var action = process.argv[2];
var input_argv = process.argv[3];

switch (action) {
    case "my-tweets":
        my_tweets();
        break;
    case "spotify-this-song":
        if (input_argv) {
            spotify_this_song();
        } else {
            var song = "The Sign"
            spotify_this_song(song);
        }
        break;
    case "movie-this":
        movie_this();
        break;
    case "do-what-it-says":
        do_what_it_says();
        break;

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$------TESTING------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    case "test":
    test();
    break;
}

function test() {
    var testRequire = require("./keys.js")
    console.log(testRequire);
}
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$------TESTING------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

//-----------------TWITTER--------------------------------------
function my_tweets() {
    client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
        console.log(tweets);
     });
}

//--------------------------------SPOTIFY--------------------------------------
function spotify_this_song(song) {
    var input = [];

    // combines user input to a string with "+" as seperators
    for (var i = 3; i < process.argv.length; i++) {
        input += process.argv[i] + " ";
    }
    var inputTRIM = input.trim();
    var songName = input.trim().split(" ").join("+");
    // console.log(songName);

    spotify.search(
        {type: "track",
        query: songName},
        function(err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var path = data.tracks.items[0];
            var artist = path.artists[0].name;
            var title = path.name;
            var songID = path.id;
            var album = path.album.name;
            var songURL = "https://open.spotify.com/track/" + songID

            console.log("ARTIST: " + artist);
            console.log("SONG NAME: " + title);
            console.log("ALBUM: " + album);
            console.log("SPOTIFY LINK: " + songURL);

        }
        
    );

}

//------------------------------------OMDB-----------------------------------------
function movie_this() {
    var input = [];

    // combines user input to a string with "+" as seperators
    for (var i = 3; i < process.argv.length; i++) {
        input += process.argv[i] + " ";
    }
    var inputTRIM = input.trim();
    var movieName = inputTRIM.split(" ").join("+");
    console.log(movieName);

    //#######################----MOVE-API-KEY-TO-ENV-FILE-----########
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryURL);

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body);
        }

        var body = JSON.parse(body);
        var title = body.Title;
        var year = body.Year;
        //################-----update so its not calling on the index number------####
        var OMDBrating = body.Ratings[0].Value;
        var RTratting = body.Ratings[1].Value;
        var lang = body.Language;
        var plot = body.Plot;
        var actors = body.Actors;
        var poster = body.Poster;

        console.log("TITLE: " + title);
        console.log("YEAR: " + year);
        console.log("IMDB RATING: " + OMDBrating);
        console.log("ROTTEN TOMATOES RATING: " + RTratting);
        console.log("LANGUAGE: " + lang)
        console.log("PLOT: " + plot);
        console.log("ACTORS: " + actors);
    })
}



//------------------------------------------------ASSISTANT------------------------------------
function do_what_it_says() {

}