const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

const movies = require("./routes/movies.js");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// // Chỉnh sửa file json danh sách phim trước khi tải lên cơ sở dữ liệu để sử dụng
// // Chuyển từ [1,2,3] thành [{_id: 1},{_id: 2},{_id: 3}]
// const fs = require("fs");
// const path = require("path");
// const jsArrObj = require("./datas/movieList.js");
// app.get("/test", (req, res) => {
//   const jsArr = jsArrObj.list();
//   let smallArr = [];
//   for (let i = 0; i < jsArr.length; i++) {
//     if (jsArr[i].genre_ids.length === 1) {
//       smallArr.push({ _id: jsArr[i].genre_ids[0] });
//       jsArr[i].genre_ids = smallArr;
//       smallArr = [];
//     } else if (jsArr[i].genre_ids.length > 1) {
//       jsArr[i].genre_ids.forEach((item) => smallArr.push({ _id: item }));
//       jsArr[i].genre_ids = smallArr;
//       smallArr = [];
//     }
//   }
//   fs.writeFileSync(
//     path.resolve(__dirname, "./datas/movieListEdited.json"),
//     JSON.stringify(jsArr)
//   );
//   console.log("done");
// });

app.use("/movies", movies);
app.use((req, res) => {
  return res.redirect(`${process.env.CLIENT_APP}/123`);
});
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGDB_USER}:${process.env.MONGODB_PASS}@users.nyp2s8t.mongodb.net/movie?retryWrites=true&w=majorit`
  )
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
