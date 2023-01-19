'use strict';

const axios = require('axios');

async function getMovie(req, res, next) {
  try {
    let cityName = req.query.cityName;
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    let movieResults = await axios.get(movieUrl);

    console.log(movieResults.data.results);
    let movieDataToSend = movieResults.data.results.map(elem => new Movies(elem));

    res.status(200).send(movieDataToSend);

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
    this.image_url = 'https://image.tmdb.org/t/p/w500' + obj.poster_path;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
  }
}

module.exports = getMovie;