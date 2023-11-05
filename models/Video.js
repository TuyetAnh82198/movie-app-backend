const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Tạo model cho danh sách các video tương ứng với các film hiện tại
const VideoModel = new Schema({
  _id: { type: Number, required: true },
  videos: [
    {
      iso_639_1: { type: String, required: true },
      iso_3166_1: { type: String, required: true },
      name: { type: String, required: true },
      key: { type: String, required: true },
      site: { type: String, required: true },
      size: { type: Number, required: true },
      type: { type: String, required: true },
      official: { type: Boolean, required: true },
      published_at: { type: String, required: true },
      _id: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("video", VideoModel);
