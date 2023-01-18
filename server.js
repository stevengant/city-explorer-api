'use strict';

console.log('basic server');

// REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');

let data = require('./data/weather.json');
const { response } = require('express');



const app = express();

// MIDDLEWARE
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('/weather', (req, res, next) => {
  console.log('this is a request', req);
  try {
    // let lat = req.query.lat;
    // let lon = req.query.lon;
    let searchQuery = req.query.searchQuery;
    // let dataToGroom = data.find(elem => elem.lat === lat && elem.lon === lon && elem.city_name === searchQuery);
    let dataToGroom = data.find(elem => elem.city_name.toLowerCase() === searchQuery.toLowerCase());
    console.log(dataToGroom);

    let dataToSend = dataToGroom.data.map(elem => new Forecast(elem));

    res.status(200).send(dataToSend);

  } catch (error) {
    next(error);
  }

});

class Forecast {
  constructor(data) {
    this.date = data.datetime;
    this.description = data.weather.description;
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