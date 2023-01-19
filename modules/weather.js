'use strict';

const axios = require('axios');

async function getWeather(req, res, next) {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let weatherResults = await axios.get(url);
    // *** USE A CLASS TO MINIFY BULKY DATA ***
    let dataToSend = weatherResults.data.data.map(elem => new Forecast(elem));

    res.status(200).send(dataToSend);

  } catch (error) {
    next(error);
  }
}

// *** Forecast CLASS TO GROOM BULKY DATA ***
class Forecast {
  constructor(data) {
    this.date = data.datetime;
    this.description = data.weather.description;
  }
}

module.exports = getWeather;