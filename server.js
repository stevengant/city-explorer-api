'use strict';

console.log('basic server');

// REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

let data = require('./data/weather.json');
const { response } = require('express');



const app = express();

// MIDDLEWARE
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

// DEFINE WEATHER ENDPOINT
app.get('/weather',async (req, res, next) => {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    // let searchQuery = req.query.searchQuery;
    // let dataToGroom = data.find(elem => elem.lat === lat && elem.lon === lon && elem.city_name === searchQuery);
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let weatherResults = await axios.get(url);


    

    // *** FIND CITY
    // let dataToGroom = data.find(elem => elem.city_name.toLowerCase() === searchQuery.toLowerCase());
    // console.log(dataToGroom);

    // *** USE A CLASS TO MINIFY BULKY DATA ***
    let dataToSend = weatherResults.data.data.map(elem => new Forecast(elem));


    res.status(200).send(dataToSend);


  } catch (error) {
    next(error);
  }

});

// DEFINE MOVIES ENDPOINT
app.get('/movie', async (req, res, next) => {
  try {
    let cityName = req.query.cityName;
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    let movieResults = await axios.get(movieUrl);

    console.log(movieResults.data.results);
    let movieDataToSend = movieResults.data.results.map(elem => new Movies(elem));
  
    res.status(200).send(movieDataToSend);

  }catch (error) {
    next(error);
  }
})


// *** Forecast CLASS TO GROOM BULKY DATA ***
class Forecast {
  constructor(data) {
    this.date = data.datetime;
    this.description = data.weather.description;
  }
}

// *** Movies CLASS TO GROOM BULKY DATA ***
class Movies {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.average_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500' + obj.poster_path;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
  }
}


// **** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});


// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));