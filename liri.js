//read and set any environment variables with the dotenv package
require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//access spotify and twitter API key info
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var action = process.argv[2];
var input_argv = process.argv[3];

switch (action) {
    case "my-tweets":
        my_tweets();
        break;
    case "spotify-this-song":
        spotify_this_song();
        break;
    case "movie-this":
        movie_this();
        break;
    case "do-what-it-says":
        do_what_it_says();
        break;
}


//-----------------TWITTER--------------------------------------
function my_tweets() {  

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
    var songName = "";

    // combines user input to a string with "+" as seperators
    if (!process.argv[3]) {
        songName = "the sign Ace of Base"
    }else {
        for (var i = 3; i < process.argv.length; i++) {
            input += process.argv[i] + " ";
        }
        var inputTRIM = input.trim();
        songName = input.trim().split(" ").join("+");
    }


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

            fs.appendFile("random.txt", "spotify-this-song: " + songName, function(err) {
                if (err) {
                    console.log(err);
                }
            })
            

        }
        
    );

}

//------------------------------------OMDB-----------------------------------------
function movie_this() {
    var input = [];
    var movieName = "";

    if (!process.argv[3]) {
        movieName = "Mr+Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should");
        console.log("It's on Netflix");
    }else {
        // combines user input to a string with "+" as seperators
        for (var i = 3; i < process.argv.length; i++) {
            input += process.argv[i] + " ";
        }
        var inputTRIM = input.trim();
        var movieName = inputTRIM.split(" ").join("+");
    }


    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body);
        }

        var body = JSON.parse(body);
        var title = body.Title;
        var year = body.Year;
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
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            console.log("Error: " + err);
        }else {
            console.log(data);
            var dataArr = data.split(",");
            console.log(dataArr);
        }
    })
}