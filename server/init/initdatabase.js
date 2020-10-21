const movies = require("./insertMovies");
const users = require("./insertUsers");
const reviews = require("./insertReviews");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

async function init() {
  console.log("Populating database...");
//   await movies.insertMovies();
  await users.insertUsers();
  await reviews.insertReviews();
  console.log("Finished populating database. ")
  mongoose.disconnect();
}

init();
