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
    var client = new Twitter({
        consumer_key: "fWWXtFuW89K9ALfpBmyBac31Y",
        consumer_secret: "yLajimAO4gTJhSjh5SFbRdKgEl7lZHGjlJjgU8qFYGSCigvby5",
        access_token_key: "949006103173623809-dqhaoXNRMu22wpzCILJbdl2QawrH4PD",
        access_token_secret: "gi11gLf7Rlya1dbuLMzpvlUGChNjAk4RWn4bifyEExvOi" 
    });
    //var client = new Twitter(keys.twitter);

    var params = {
        q: "#nodejs",
        count: 20,
        result_type: "recent",
        lang: "en"
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            console.log("------------Recent Tweets-----------------------")
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("------------------------------------------------")
            }
        }else {

        };
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
    

    //#######################----MOVE-API-KEY-TO-ENV-FILE-----########
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    

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