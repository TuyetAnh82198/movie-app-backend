const moment = require("moment");

const MovieModel = require("../models/Movie.js");
const GenreModel = require("../models/Genre.js");
const VideoModel = require("../models/Video.js");

//Hàm trả về danh sách phim phát hành gần nhất
const getLastedMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find();
    const moviesWithReleaseDate = [];
    movies.forEach((movie) => {
      movie.release_date ? moviesWithReleaseDate.push(movie) : "";
    });
    const latestMovies = moviesWithReleaseDate
      .sort((a, b) => {
        return moment(a.release_date).diff(b.release_date);
      })
      .reverse()
      .slice(0, 20);
    return res.status(200).json({ result: latestMovies });
  } catch {
    (err) => {
      return res.redirect(`${process.env.CLIENT_APP}/server-error`);
    };
  }
};
//Hàm trả về danh sách phim Xu hướng
const getTrendingMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find();
    const trendingMovies = movies.sort((a, b) => b.popularity - a.popularity);
    const page = req.params.page ? req.params.page : 1;
    //trả về mỗi trang 20 bộ phim
    const result = trendingMovies.slice((page - 1) * 20, page * 20);
    return res.status(200).json({
      result: result,
      page: page,
      totalPages: Math.ceil(trendingMovies.length / 20),
    });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//Hàm trả về danh sách phim dựa theo rating
const getMoviesByRating = async (req, res) => {
  try {
    const movies = await MovieModel.find();
    const moviesGotByRating = movies.sort(
      (a, b) => b.vote_average - a.vote_average
    );
    const page = req.params.page ? req.params.page : 1;
    //trả về mỗi trang 20 bộ phim
    const result = moviesGotByRating.slice((page - 1) * 20, page * 20);
    return res.status(200).json({
      result: result,
      page: page,
      totalPages: Math.ceil(moviesGotByRating.length / 20),
    });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//Hàm trả về danh sách phim Hành động
const getMovies = async (req, res) => {
  try {
    const foundType = await GenreModel.findOne({
      name: req.params.type[0].toUpperCase() + req.params.type.slice(1),
    });
    const foundTypeId = foundType._id;
    const movies = await MovieModel.find({
      genre_ids: { _id: foundTypeId },
    });
    const page = req.params.page ? req.params.page : 1;
    const result = movies.slice((page - 1) * 20, page * 20);
    return res.status(200).json({
      result: result,
      page: page,
      totalPage: Math.ceil(movies.length / 20),
    });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//Hàm trả về thông tin của video của phim được click để hiển thị trailer
const getVideo = async (req, res) => {
  try {
    const videos = await VideoModel.find({ _id: req.params.id });
    // console.log(videos);
    if (videos.length === 0) {
      return res.status(200).json({ result: [] });
    } else if (videos.length > 0) {
      const result = videos[0].videos.filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );
      if (result.length === 0) {
        return res.status(200).json({ result: [] });
      } else if (result.length > 0) {
        return res.status(200).json({ result: result });
      }
    }
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//Hàm trả về danh sách phim thỏa điều kiện tìm kiếm
const searchMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find({
      $or: [
        {
          title: {
            $regex: req.body.keyword
              .split(" ")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(" "),
          },
        },
        {
          original_name: {
            $regex: req.body.keyword
              .split(" ")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(" "),
          },
        },
      ],
    });
    if (
      req.body.genre !== "select genre" ||
      req.body.mediaType !== "select media type" ||
      req.body.lang !== "select language" ||
      req.body.year !== "select year"
    ) {
      if (req.body.genre !== "select genre") {
        const genreFromReq = req.body.genre;
        const genre = genreFromReq[0].toUpperCase() + genreFromReq.slice(1);
        const foundGenre = await GenreModel.findOne({ name: genre });
        const foundGenreId = foundGenre._id;
        const filteredOutMovies = movies.filter(
          (movie) =>
            movie.genre_ids.filter((item) => item._id === foundGenreId) &&
            (req.body.mediatype !== "select media type"
              ? movie.media_type === req.body.mediaType
              : movie.media_type !== "") &&
            (req.body.lang !== "select language"
              ? movie.original_language === req.body.lang
              : movie.original_language !== "") &&
            (req.body.year !== "select year"
              ? movie.release_date.split("-")[0] === req.body.year ||
                movie.first_air_date.split("-")[0] === req.body.year
              : movie.release_date !== "" || movie.first_air_date !== "")
        );
        // console.log(filteredOutMovies);
        const page = req.params.page ? req.params.page : 1;
        return res.status(200).json({
          //trả về mỗi trang 20 kết quả
          result: filteredOutMovies.slice((page - 1) * 20, page * 20),
          page: page,
          totalPage: Math.ceil(filteredOutMovies.length / 20),
        });
      } else if (req.body.genre === "select genre") {
        const filteredOutMovies = movies.filter(
          (movie) =>
            (req.body.mediaType !== "select media type"
              ? movie.media_type === req.body.mediaType
              : movie.media_type !== "") &&
            (req.body.lang !== "select language"
              ? movie.original_language === req.body.lang
              : movie.original_language !== "") &&
            (req.body.year !== "select year"
              ? movie.release_date.split("-")[0] === req.body.year ||
                movie.first_air_date.split("-")[0] === req.body.year
              : movie.release_date !== "" || movie.first_air_date !== "")
        );
        // console.log(

        // );
        const page = req.params.page ? req.params.page : 1;
        return res.status(200).json({
          //trả về mỗi trang 20 kết quả
          result: filteredOutMovies.slice((page - 1) * 20, page * 20),
          page: page,
          totalPage: Math.ceil(filteredOutMovies.length / 20),
        });
      }
    } else {
      const page = req.params.page ? req.params.page : 1;
      return res.status(200).json({
        //trả về mỗi trang 20 kết quả
        result: movies.slice((page - 1) * 20, page * 20),
        page: page,
        totalPage: Math.ceil(movies.length / 20),
      });
    }
    // console.log(
    //   req.params.keyword
    //     .split(" ")
    //     .map((word) => word[0].toUpperCase() + word.slice(1))
    //     .join(" ")
    // );
    // console.log(movies.slice(0, 2));
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};

module.exports = {
  getLastedMovies,
  getTrendingMovies,
  getMoviesByRating,
  getMovies,
  getVideo,
  searchMovies,
};
