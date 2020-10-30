const express = require("express");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const User = require("../models/User");
const { query } = require("express");
const router = express.Router();

router.get("/reviews", async (req, res, next) => {
  console.log("GET reviews");
  try {
    var userId = req.query.userId;
    var movieId = req.query.movieId;
    var query = {};
    if (userId) query.userId = userId;
    if (movieId) query.movieId = movieId;

    const reviews = await Review.find(query);
    res.send(reviews);
  } catch {
    res.status(404);
    res.send({ error: "No reviews found!" });
  }
});

// Post new review
router.post("/reviews", async (req, res, next) => {
  console.log("POST review");
  if (req.session.loggedIn) {
    try {
      const review = new Review({
        userId: req.body.userId,
        userName: req.body.userName,
        movieId: req.body.movieId,
        movieTitle: req.body.movieTitle,
        score: req.body.score,
        title: req.body.title,
        body: req.body.body,
      });
      await review.save();
      console.log("REVIEW ID:", review._id);
      await User.updateOne(
        { _id: req.user._id },
        { $push: { reviews: review._id } }
      );
      await updateRating(req.body.movieId);
      res.status(200).send("Posted review!");
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ error: "Could not post review!" });
    }
  } else {
    res.status(401).send("Cannot post review - not logged in.");
  }
});

// Delete review by id
router.delete("/reviews/:id", async (req, res) => {
  console.log("DELETE review", req.params.id);
  if (req.session.loggedIn) {
    try {
      const review = await Review.findOne({ _id: req.params.id });
      const movieId = review.movieId;
      console.log("movieId:", movieId);
      await Review.deleteOne({ _id: req.params.id });
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { reviews: { $in: [req.params.id] } } }
      );
      updateRating(movieId);
      res.status(204).send();
    } catch (e) {
      console.log(e);
      res.status(404);
      res.send({ error: "Review does not exist!" });
    }
  } else {
    res.status(401).send("Cannot delete review - not logged in. ");
  }
});

// updates Movie rating one review is added or deleted
async function updateRating(movieId) {
  try {
    // get average rating from reviews
    const reviews = await Review.find({ movieId: movieId });
    var average;
    if (reviews.length == 0) average = 0;
    else
      average = (
        reviews.reduce((total, next) => total + next.score, 0) / reviews.length
      ).toFixed(1);

    // update rating on movie
    const movie = await Movie.findOne({ _id: movieId });
    movie.Rating = average;
    await movie.save();
  } catch (e) {
    console.log(e);
  }
}

module.exports = router;
