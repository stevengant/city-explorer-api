'use strict';

const axios = require('axios');
const { response } = require('express');

let cache = {};

async function getMovie(req, res, next) {
  try {
    let cityName = req.query.cityName;

    // *** CREATE KEY ***
    let key = `${cityName}Movies`;

    // *** IF KEY EXISETS AND IS VALID TIME, SEND DATA ***
    if(cache[key] && (Date.now() - cache[key].timeStamp) < 50000) {
      console.log('Cache was hit');
      response.status(200).send(cache[key].data);
    } else {
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    let movieResults = await axios.get(movieUrl);

    // console.log(movieResults.data.results);
    let movieDataToSend = movieResults.data.results.map(elem => new Movies(elem));

    // **** Cache the results from the api call
    cache[key] = {
      data: movieDataToSend,
      timeStamp: Date.now()
    };

    res.status(200).send(movieDataToSend);
    }
  } catch (error) {
    next(error);
  }
}

// *** Movies CLASS TO GROOM BULKY DATA ***
class Movies {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.average_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = obj.poster_path;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
  }
}

module.exports = getMovie;