const express = require("express");

const {
  getLastedMovies,
  getTrendingMovies,
  getMoviesByRating,
  getMovies,
  getVideo,
  searchMovies,
} = require("../controllers/movies.js");

const route = express.Router();

route.get("/get-latest-movies", getLastedMovies);
//page đại diện cho thứ tự của trang dữ liệu muốn lấy
route.get("/get-trending-movies/:page?", getTrendingMovies);
route.get("/get-movies-by-rating/:page?", getMoviesByRating);
route.get("/get-movies/:type/:page?", getMovies);
route.get("/get-video/:id", getVideo);
route.post("/search/:page?", searchMovies);

module.exports = route;
