const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Tạo model cho danh sách các thể loại film đang có và id tương ứng
const GenreModel = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("genre", GenreModel);
