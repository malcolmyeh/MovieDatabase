const movies = require("../data/movie-data.json");
const Movie = require("../models/Movie");
const People = require("../models/People");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

// Script to load movies and people from movie-data.json

async function run() {
  var db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error: "));
  var people = [];

  movies.forEach((movie) => {
    people.push(movie.Director);
    movie.Writer.replace(/ *\([^)]*\) */g, "").split(", ").forEach(writer => {
      people.push(writer);
    })
    movie.Actor.split(", ").forEach(actor => {
      people.push(actor);
    })
  });

  const uniquePeople = Array.from(new Set(people)).sort();
  console.log("uniquePeople: ", uniquePeople);

  await db.once("open", async function () {
    await Movie.insertMany(movies, function (error, docs) {
      if (error) console.log(error);
    });
    // await People.insertMany
  });
  mongoose.disconnect();
}

run();
