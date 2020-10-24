const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const People = require("../models/People");

var genreList = []; // save genres in memory as it is not likely to change

router.get("/movies/:movie", async (req, res, next) => {
  console.log("GET movie", req.params.movie);
  try {
    const movie = await Movie.findOne({ _id: req.params.movie });
    res.send(movie);
  } catch {
    res.status(404);
    res.send({ error: "Movie doesn't exist!" });
  }
});

router.get("/movies", async (req, res, next) => {
  console.log("GET movies");
  console.log(req.query);
  try {
    let genre = req.query.genre;
    let title = req.query.title;
    let year = req.query.year;
    let minrating = req.query.minrating;
    let query = {};
    if (title) query.Title = { $regex: `(?i).*${title.replace("-", " ")}.*` };
    if (genre) query.Genre = { $regex: `(?i).*${genre}.*` };
    if (year) query.Year = year;
    if (minrating) query.Rating = { $gte: minrating };

    const movies = await Movie.find(query).sort([["Year", -1]]);
    var reducedMovies = movies.map((movie) => {
      const reducedMovie = {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        _id: movie._id,
      };
      return reducedMovie;
    });
    res.send(reducedMovies);
  } catch {
    res.status(404);
    res.send({ error: "No movies found!" });
  }
});

router.get("/featuredmovies", async (req, res, next) => {
  console.log("GET featured movies");
  try {
    const movies = await Movie.find()
      .sort([["Year", -1]])
      .limit(10);
    const reducedMovies = movies.map((movie) => {
      return {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        id: movie._id,
      };
    });
    res.send(reducedMovies);
  } catch {
    res.status(404);
    res.send({ error: "No movies found! " });
  }
});

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
      imdbRating: movie.imdbRating,
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
    if (genreList.length === 0) {
      const movies = await Movie.find();
      var genres = [];
      movies.forEach((movie) => {
        var arr = movie.Genre.split(", ");
        genres = [...arr, ...genres];
      });
      var uniqueGenres = Array.from(new Set(genres)).sort();
      console.log(uniqueGenres);
      genreList = uniqueGenres;
    }
    res.send({ genres: genreList });
  } catch {
    res.status(500);
    res.send({ error: "Error getting genres!" });
  }
});

router.get("/recommended/:movie", async (req, res, next) => {
  // todo: change to param
  // /recommended?movie={id}
  // /recommended?user={id}

  console.log("GET recommended");
  try {
    const movie = await Movie.findOne({ _id: req.params.movie });
    const rated = movie.Rated;
    const genre = movie.Genre;
    console.log("rated:", rated);
    console.log("genre:", genre);
    var recommended = [];
    const recommendedMovies = await Movie.find({ Rated: rated, Genre: genre })
      .sort([["Year", -1]])
      .limit(5);
    for (const recommendedMovie of recommendedMovies) {
      console.log("recommendedid: ", recommendedMovie._id);
      console.log("movieid: ", movie._id);
      if (recommendedMovie._id == movie._id) {
        recommended.push(recommendedMovie);
      }
    }
    console.log("recommended: ", recommended);

    // if initial query doesn't find at least 1 movie, keep trying with less and less genres
    const broaderGenres = genre.split(", ");

    while (recommended.length < 5) {
      const remaining = 5 - recommended.length;
      broaderGenres.pop();
      const genres = broaderGenres.join(", ");
      var newRecommendedMovies;
      if (genres == "") {
        newRecommendedMovies = await Movie.find({
          Rated: rated,
        })
          .sort([["Year", -1]])
          .limit(remaining);
      } else {
        newRecommendedMovies = await Movie.find({
          Rated: rated,
          Genre: genres,
        })
          .sort([["Year", -1]])
          .limit(remaining);
      }

      for (const recommendedMovie of newRecommendedMovies) {
        if (recommendedMovie._id !== movie._id) {
          recommended.push(recommendedMovie);
        }
      }
    }
    reducedRecommended = recommended.slice(0, 5).map((movie) => {
      return {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        _id: movie._id,
      };
    });
    console.log(reducedRecommended);
    res.send(reducedRecommended);
  } catch {
    res.status(500);
    res.send({ error: "Error getting recommended! " });
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
