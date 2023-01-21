'use strict';

require('dotenv').config();;
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const getMovie = require('./modules/movies.js')

const app = express();

// MIDDLEWARE
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error.message);
    response.status(200).send('Sorry. Something went wrong!')
  });
}  

// **** DEFINE MOVIES ENDPOINT ****
app.get('/movie', getMovie) 

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Server up on ${PORT}`));