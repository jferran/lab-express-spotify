require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req, res, next) => res.render("index"))
app.get('/artist-search', (req, res, next) =>{
    //const { artist } = req.query
    let artist = req.query.artist
    
    console.log("searching", artist)
    
    spotifyApi
    .searchArtists(artist)
    .then(data => {
        //console.log('The received data from the API: ', JSON.stringify(data.body));
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //res.render("")
        res.render("artist-search-results", {artists: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const { artistId } = req.params
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        //console.log("The retrieved artists albums data: ", JSON.stringify(data))
        res.render("albums", {albums: data.body.items})
    })
    .catch(err => console.log("Error ocurred while retrieving artist albums: ", err))

  });

  app.get('/tracks/:albumId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const { albumId } = req.params
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        console.log("The retrieved tracks data: ", JSON.stringify(data))
        res.render("tracks", {tracks: data.body.items})
    })
    .catch(err => console.log("Error ocurred while retrieving artist albums: ", err))

  });