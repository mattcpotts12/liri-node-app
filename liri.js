//read and set any environment variables with the dotenv package
require("dotenv").config();




//access spotify and twitter API key info
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);




