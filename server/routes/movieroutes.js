const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const People = require("../models/People");

router.get("/movies/:movie", async (req, res, next) => {
  try {
    console.log("looking for movie: ", req.params.movie);
    const movie = await Movie.findOne({ _id: req.params.movie });
    console.log("Movie found: ", movie.Title);
    res.send(movie);
  } catch {
    res.status(404);
    res.send({ error: "Movie doesn't exist!" });
  }
});

router.get("/movies", async (req, res, next) => {
  try {
    let title = req.query.title;
    let genre = req.query.genre;
    let year = req.query.year;
    let minrating = req.query.minrating;
    let query = {};
    if (title) query.Title = { $regex: `(?i).*${title}.*` };
    if (genre) query.Genre = { $regex: `(?i).*${genre}.*` };
    if (year) query.Year = year;
    if (minrating) query.Rating = { $gte: minrating };

    const movies = await Movie.find(query);
    console.log("movies: ", movies);
    var reducedMovies = movies.map((movie) => {
      const reducedMovie = {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        _id: movie._id,
      };
      return reducedMovie;
    });
    console.log("reducedMovies: ", reducedMovies);
    res.send(reducedMovies);
  } catch {
    res.status(404);
    res.send({ error: "No movies found!" });
  }
});

router.get("/featuredmovies", async (req, res, next) => {
  console.log("featured movies");
  try {
    const movies = await Movie.find().sort([['Year', -1]]).limit(10);
    console.log("movies: ", movies);
    const reducedMovies = movies.map(movie => {
      return {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
      }
    })
    res.send(reducedMovies);
  } catch {
    res.status(404);
    res.send({ error: "No movies found! "})
  }
})

router.post("/movies", async (req, res, next) => {
  try {
    var directorName;
    var writerNames = [];
    var actorNames = [];
    var director;
    var writers = [];
    var actors = [];
    var people = [];

    const newMovie = new Movie({
      Title: movie.Title,
      Year: movie.Year,
      Rated: movie.Rated,
      Released: movie.Released,
      Runtime: movie.Runtime,
      Genre: movie.Genre,
      Plot: movie.Plot,
      Language: movie.Language,
      Country: movie.Country,
      Awards: movie.Awards,
      Poster: movie.Poster,
      Ratings: movie.Ratings,
      Metascore: movie.Metascore,
      imbdbRating: movie.imbdbRating,
      imdbId: movie.imdbId,
      Type: movie.Type,
      DVD: movie.DVD,
      BoxOffice: movie.BoxOffice,
      Production: movie.Production,
    });

    directorName = [req.body.Director];
    req.body.Writer.replace(/ *\([^)]*\) */g, "")
      .split(", ")
      .forEach((writer) => {
        // remove brackets
        writerNames.push(writer);
      });
    writerNames = Array.from(new Set(writerNames)).sort(); // some writers listed multiple times
    req.body.Actors.split(", ").forEach((actor) => {
      actorNames.push(actor);
    });
    actorNames = Array.from(new Set(actorNames)).sort();

    // Create person document if doesn't exist, get array of {String, ObjectIds}
    director = await getPeopleIds(directorName);
    director = director[0]; // only one director
    writers = await getPeopleIds(writerNames);
    actors = await getPeopleIds(actorNames);
    people.push(director, ...writers, ...actors);

    // update Director
    const directorDocument = await People.findOne({ _id: director.id });
    directorDocument.movies.push(newMovie._id);
    for (const person of people.filter((ele) => ele.name != director.name)) {
      // get all other people
      var collaborator = directorDocument.frequentCollaborators.find(
        (ele) => ele.name === person.name
      );
      if (collaborator) {
        // if collaborator already exists, increase the count
        ++collaborator.count;
      } else {
        // if collaborator doesn't exist, add new collaborator
        directorDocument.frequentCollaborators.push({
          name: person.name,
          id: person.id,
          count: 1,
        });
      }
    }
    await directorDocument.save();

    // update Writers
    for (const writer of writers) {
      const writerDocument = await People.findOne({ _id: writer.id });
      writerDocument.movies.push(newMovie._id);
      for (const person of people.filter((ele) => ele.name != writer.name)) {
        var collaborator = writerDocument.frequentCollaborators.find(
          (ele) => ele.name === person.name
        );
        if (collaborator) {
          ++collaborator.count;
        } else {
          writerDocument.frequentCollaborators.push({
            name: person.name,
            id: person.id,
            count: 1,
          });
        }
      }
      await writerDocument.save();
    }

    // update Actors
    for (const actor of actors) {
      const actorDocument = await People.findOne({ _id: actor.id });
      actorDocument.movies.push(newMovie._id);
      for (const person of people.filter((ele) => ele.name != actor.name)) {
        var collaborator = actorDocument.frequentCollaborators.find(
          (ele) => ele.name === person.name
        );
        if (collaborator) {
          ++collaborator.count;
        } else {
          actorDocument.frequentCollaborators.push({
            name: person.name,
            id: person.id,
            count: 1,
          });
        }
      }
      await actorDocument.save();
    }

    // add people Ids to movie
    newMovie.Director = director.id;
    newMovie.Writer = writers.map((writer) => writer.id);
    newMovie.Actors = actors.map((actor) => actor.id);
    await newMovie.save();
    console.log(movie.Title, " saved.");

    res.send(movie);
  } catch {
    res.status(500);
    res.send({ error: "Error adding new movie. " });
  }
});

// list of genres
router.get("/genres", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    var genres = [];
    movies.forEach((movie) => {
      var arr = movie.Genre.split(", ");
      genres = [...arr, ...genres];
    });
    var uniqueGenres = Array.from(new Set(genres)).sort();
    console.log(uniqueGenres);
    res.send({ genres: uniqueGenres });
  } catch {
    res.status(500);
    res.send({ error: "Error getting genres!" });
  }
});

// Creates People if not already created from array of string (names)
// and returns array [ {name, id}, {name, id}, ...]
async function getPeopleIds(people) {
  var peopleArr = [];
  for (const person of people) {
    const name = person;
    const exists = await People.exists({ name: name });
    if (exists) {
      const personDocument = await People.findOne({ name: name });
      peopleArr.push({
        name: name,
        id: personDocument._id,
      });
      await personDocument.save();
    } else {
      const personDocument = new People({
        name: name,
      });
      peopleArr.push({
        name: name,
        id: personDocument._id,
      });
      await personDocument.save();
    }
  }
  return peopleArr;
}

module.exports = router;
