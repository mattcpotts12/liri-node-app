//read and set any environment variables with the dotenv package
require("dotenv").config();

var inquirer = require("inquirer");

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
            console.log("\n------------Recent Tweets-----------------------")
            for (var i = 0; i < tweets.length; i++) {
                // console.log(tweets[i].created_at);
                // console.log(tweets[i].text);
                // console.log("------------------------------------------------")

                var tweetDate = tweets[i].created_at;
                var tweet = tweets[i].text;

                var results_tweet = 
                    "Date: " + tweetDate + "\r\n" + 
                    "Tweet: " + tweet;

                console.log(results_tweet);
                console.log("\n------------------------------------------------\n")

                fs.appendFile(
                    "random.txt", 
                    "my-tweets:"+ "\r\n" + 
                    results_tweet + "\r\n", 
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
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
            //console.log(JSON.stringify(data.tracks.items[0], null, 2));
            
            //creates an array of all of the songs found from CLI search
            var songList = [];
            for (var j = 0; j < data.tracks.items.length; j++) {
                var newArtist = data.tracks.items[j].artists[0].name;
                var newSong = data.tracks.items[j].name;
                songList.push(newSong + " by: " + newArtist);
            }

            var path = data.tracks.items[0];

            inquirer.prompt([
                {
                    name: "songs",                    
                    type: "rawlist",
                    message: "Select song below that matches searched results",
                    choices: songList 
                }
            ]).then(function(answers) {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    var song = data.tracks.items[i].name;
                    var artist = data.tracks.items[i].artists[0].name;
                    var track = song + " by: " + artist;
                    if (track === answers.songs) {
                        var path = data.tracks.items[i];

                        var results_spotify = 
                            "----------SPOTIFY RESULTS---------" +
                            "\n Artists: " + path.artists[0].name + 
                            "\n Song Title: " + path.name + 
                            "\n Album: " + path.album.name + 
                            "\n Song Link: " + "https://open.spotify.com/track/" + path.id + 
                            "\n-----------------------------------";
                    }                
                }
                console.log(results_spotify);    

                fs.appendFile(
                    "random.txt", 
                    "spotify-this-song: " + songName + "\r\n" +
                    "Results: " + results_spotify + "\r\n", 
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                )
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
            console.log(body);
        }
        console.log(queryURL);

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