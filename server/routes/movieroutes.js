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

router.post("/movies", async (req, res, next) => {
  try {
    const movie = new Movie({
      Title : req.body.title,
      Year : req.body.year,
      Rated : req.body.rated, 
      Released : req.body.released,
      Runtime : req.body.runtime,
      Genre : req.body.genre,
      Director : req.body.director,
      Writer : req.body.writer, 
      Actors : req.body.actors,
      Plot : req.body.plot, 
      Language : req.body.language, 
      Country : req.body.country, 
      Awards : req.body.rewards, 
      Poster : req.body.poster,
      Ratings : req.body.ratings,
      Metascore : req.body.metascore,
      imdbRating : req.body.imdbRating,
      imdbId : req.body.imdbId,
      Type : req.body.type,
      DVD : req.body.dvd,
      BoxOffice : req.body.boxOffice, 
      Production : req.body.production,
      Website : req.body.website
    })
    await movie.save();
    
    
    // get all people
    var people = [];
    people.push(req.body.Director);
    req.body.Writers.split(", ").forEach((writer) => {
      people.push(writer);
    })
    req.body.Actors.split(", ").forEach((actor) => {
      people.push(actor);
    })
    console.log("People: ", people);

    // check if each person exists, else create person entry
    people.forEach((person) => {
      if (People.exists({name: person})){
        console.log(person + " already exists");
      } else {
        console.log(person + " does not exist. Creating entry...");
        const newPerson = new People({
          name: person,
          movies: [movie._id],
        })
        newPerson.save();
        // getFrequentCollaborators(); todo
      }
    });

    res.send(movie);
  } catch {
    res.status(500);
    res.send({error: "Error adding new movie. "});
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
    res.send({genres: uniqueGenres});
  } catch {
      res.status(500);
      res.send({error: "Error getting genres!"});
  }
});

module.exports = router;
