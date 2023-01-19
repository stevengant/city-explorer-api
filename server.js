'use strict';

console.log('basic server');

// REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather')
const getMovie = require('./modules/movies')

const app = express();

// MIDDLEWARE
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

// DEFINE WEATHER ENDPOINT
app.get('/weather', getWeather); 

// **** FIND CITY ****
// let dataToGroom = data.find(elem => elem.city_name.toLowerCase() === searchQuery.toLowerCase());
// console.log(dataToGroom);

// **** DEFINE MOVIES ENDPOINT ****
app.get('/movie', getMovie) 

// **** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});


// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));