const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Tạo model cho danh sách các phim đang có
const MovieModel = new Schema({
  _id: { type: Number, required: true },
  adult: { type: Boolean, required: true },
  backdrop_path: { type: String, required: true },
  title: { type: String, required: false },
  original_language: { type: String, required: true },
  original_title: { type: String, required: false },
  overview: { type: String, required: true },
  poster_path: { type: String, required: true },
  media_type: { type: String, required: true },
  genre_ids: [{ _id: { type: Number, required: true } }],
  popularity: { type: Number, required: true },
  release_date: { type: String, required: false },
  video: { type: Boolean, required: false },
  vote_average: { type: Number, required: true },
  vote_count: { type: Number, required: true },
});

module.exports = mongoose.model("movie", MovieModel);
