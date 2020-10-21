const User = require("../models/User");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");
const loremIpsum = require("lorem-ipsum").loremIpsum;

// Script to populate database with movie reviews
// expects users and movies to already exist

mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

async function insertReviews() {
  console.log("Inserting reviews...");
  var db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error: "));
  // todo: exit if no users or no movies

  const users = await User.find();
  const userIds = users.map((user) => user._id);
  const movies = await Movie.find().limit(users.length * 3);
  const movieIds = movies.map((movie) => {
    return {
      title: movie.Title,
      id: movie._id,
    };
  });

  for (var i = 0; i < userIds.length; ++i) {
    const reviewMovieIds = movieIds.slice(i * 3, i * 3 + 3);
    for (const movieId of reviewMovieIds) {
      const review = new Review({
        user: userIds[i],
        movieId: movieId.id,
        movieTitle: movieId.title,
        score: Math.floor(Math.random() * 10) + 1,
        title: loremIpsum().slice(0, -1),
        body: loremIpsum({ count: 3, units: "paragraph" }),
      });
      const user = await User.findOne({_id: userIds[i]});
      user.reviews.push(review._id);
      user.moviesWatched.push(movieId.id);
      await review.save();
      await updateRating(movieId.id);
      await user.save();
      console.log("Review for", movieId.title, "saved.");
    }
  }
  console.log("Done inserting reviews. ");
  // mongoose.disconnect();
}

// updates Movie rating one review is added or deleted
async function updateRating(movieId) {
  try {
    // get average rating from reviews
    const reviews = await Review.find({ movieId: movieId });
    var average =
      reviews.reduce((total, next) => total + next.score, 0) / reviews.length;
    // update rating on movie
    const movie = await Movie.findOne({ _id: movieId });
    movie.rating = average;
    await movie.save();
  } catch (e) {
    console.log(e);
  }
}

// insertReviews();

module.exports = { insertReviews }