const Review = require("../models/Review");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });


async function updateRating(movieId) {
  try {
    // get average rating from reviews
    const reviews = await Review.find({ movieId: movieId });
    var average =
      reviews.reduce((total, next) => total + next.score, 0) / reviews.length;
    console.log("average: ", average);
    // update rating on movie
    const movie = await Movie.findOne({ _id: movieId });
    movie.Rating = average;
    await movie.save();
  } catch (e) {
    console.log(e);
  }
}


updateRating("5f9300ef18b62726a0d1a979");