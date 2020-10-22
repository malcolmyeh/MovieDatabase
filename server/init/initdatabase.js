const movies = require("./insertMovies");
const users = require("./insertUsers");
const reviews = require("./insertReviews");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const People = require("../models/People");
const User = require("../models/User");
const Review = require("../models/Review");

mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

async function init() {
  try {
    console.log("Clearing database...");
    await Movie.remove();
    await People.remove();
    await User.remove();
    await Review.remove();
    console.log("Database cleared. ");
    console.log("Populating database...");
    await movies.insertMovies();
    await users.insertUsers();
    await reviews.insertReviews();
    console.log("Finished populating database. ");
    mongoose.disconnect();
  } catch (e) {
    console.log(e);
  }
}

init();
