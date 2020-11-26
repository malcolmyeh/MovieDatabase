const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const People = require("../models/People");
const User = require("../models/User");

var genreList = []; // save genres in memory as it is not likely to change
const MAX_RETRIES = 10;

router.get("/movies/:movie", async (req, res, next) => {
  console.log("GET movie", req.params.movie);
  try {
    var isWatched = false;
    const movie = await Movie.findOne({ _id: req.params.movie });
    if (req.session.loggedIn) {
      const user = await User.findOne({ _id: req.user._id });
      isWatched = user.moviesWatched.includes(req.params.movie);
    }
    res.status(200).send({ movie: movie, isWatched: isWatched });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Movie doesn't exist!" });
  }
});

router.get("/movies", async (req, res, next) => {
  console.log("GET movies", req.query);
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
    res.status(200).send(reducedMovies);
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "No movies found!" });
  }
});

router.get("/featuredmovies", async (req, res, next) => {
  console.log("GET featured movies");
  try {
    const movies = await Movie.find()
      .sort([["Year", -1]])
      .limit(5);
    const reducedMovies = movies.map((movie) => {
      return {
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        id: movie._id,
      };
    });
    res.status(200).send(reducedMovies);
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "No movies found! " });
  }
});

router.post("/movies", async (req, res, next) => {
  console.log("POST movies");
  console.log("source:", req.get("source"));
  console.log("req.body:", req.body);
  const movie = req.body;
  if (req.session.loggedIn && req.user.accountType == "Contributor" || req.get("source") == "postman") {
    try {
      var directorNames = [];
      var writerNames = [];
      var actorNames = [];
      var directors = [];
      var writers = [];
      var actors = [];
      var people = [];

      var newMovie = new Movie({
        // everything except people
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

      // Get people from each movie object
      movie.Director.replace(/ *\([^)]*\) */g, "")
        .split(", ")
        .forEach((director) => {
          // remove brackets
          directorNames.push(director);
        });
      directorNames = Array.from(new Set(directorNames)).sort();

      movie.Writer.replace(/ *\([^)]*\) */g, "")
        .split(", ")
        .forEach((writer) => {
          writerNames.push(writer);
        });
      writerNames = Array.from(new Set(writerNames)).sort();
      movie.Actors.split(", ").forEach((actor) => {
        actorNames.push(actor);
      });
      actorNames = Array.from(new Set(actorNames)).sort();

      // Create person document if doesn't exist, get array of {String, ObjectIds}
      directors = await getPeopleIds(directorNames);
      writers = await getPeopleIds(writerNames);
      actors = await getPeopleIds(actorNames);
      people.push(...directors, ...writers, ...actors);

      // update Director
      for (const director of directors) {
        const directorDocument = await People.findOne({ _id: director.id });
        directorDocument.movies.push(newMovie._id);
        for (const follower of directorDocument.followers) {
          console.log("Notifying", follower);
          req.app.io.emit(follower, {
            name: directorDocument.name,
            body: `directed in ${newMovie.Title}.`,
          });
        }
        for (const person of people.filter(
          (ele) => ele.name != director.name
        )) {
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
      }

      // update Writers
      for (const writer of writers) {
        const writerDocument = await People.findOne({ _id: writer.id });
        writerDocument.movies.push(newMovie._id);
        for (const follower of writerDocument.followers) {
          console.log("Notifying", follower);
          req.app.io.emit(follower, {
            name: writerDocument.name,
            body: `wrote in ${newMovie.Title}.`,
          });
        }
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
        for (const follower of actorDocument.followers) {
          console.log("Notifying", follower);
          req.app.io.emit(follower, {
            name: actorDocument.name,
            body: `acted in ${newMovie.Title}.`,
          });
        }
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
      newMovie.Director = directors.map((director) => director.id);
      newMovie.Writer = writers.map((writer) => writer.id);
      newMovie.Actors = actors.map((actor) => actor.id);
      await newMovie.save();
      console.log(movie.Title, " saved.");
      res.status(204).send(movie);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Error adding new movie. " });
    }
  } else {
    res.status(401).send({
      error: "Cannot create movie - must be logged in and contributing user. ",
    });
  }
});

router.get("/genres", async (req, res, next) => {

  // this goes through every movie and returns array of unique genres but is very slow (2000+ ms)
  // should it be hard coded?

  // try {
  //   if (genreList.length === 0) {
  //     const movies = await Movie.find();
  //     var genres = [];
  //     movies.forEach((movie) => {
  //       var arr = movie.Genre.split(", ");
  //       genres = [...arr, ...genres];
  //     });
  //     var uniqueGenres = Array.from(new Set(genres)).sort();
  //     console.log(uniqueGenres);
  //     genreList = uniqueGenres;
  //   }
  //   res.status(200).send({ genres: genreList });
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).send({ error: "Error getting genres." });
  // }
  res
    .status(200)
    .send({
      genres: [
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "N/A",
        "News",
        "Romance",
        "Sci-Fi",
        "Short",
        "Sport",
        "Thriller",
        "War",
        "Western",
      ],
    });
});

router.get("/recommended", async (req, res, next) => {
  console.log("GET recommended");
  let queryMovie = req.query.movie;
  let queryUser = req.query.user;
  if (queryMovie) {
    // match rating and as many genres as possible
    try {
      const movie = await Movie.findOne({ _id: queryMovie });
      const rated = movie.Rated;
      const genre = movie.Genre;
      var recommended = [];
      var recommendedId = [];
      const recommendedMovies = await Movie.find({ Rated: rated, Genre: genre })
        .sort([["Year", -1]])
        .limit(5);
      for (const recommendedMovie of recommendedMovies) {
        if (
          recommendedMovie._id.toString() !== queryMovie &&
          !recommendedId.includes(recommendedMovie._id.toString())
        ) {
          recommended.push(recommendedMovie);
          recommendedId.push(recommendedMovie._id.toString());
        }
      }

      // if initial query doesn't find at least 1 movie, keep trying with less and less genres
      const broaderGenres = genre.split(", ");
      var counter = 0;
      while (recommended.length < 5 && counter < MAX_RETRIES) {
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
          if (
            recommendedMovie._id.toString() !== queryMovie &&
            !recommendedId.includes(recommendedMovie._id.toString())
          ) {
            recommended.push(recommendedMovie);
            recommendedId.push(recommendedMovie._id.toString());
          }
        }
        ++counter;
      }
      reducedRecommended = recommended.slice(0, 5).map((movie) => {
        return {
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          _id: movie._id,
        };
      });
      res.status(200).send(reducedRecommended);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Error getting recommended! " });
    }
  } else if (queryUser) {
    try {
      const user = await User.findOne({ _id: queryUser });
      var recommended = [];
      var recommendedId = [];
      if (user.moviesWatched.length === 0 && user.followingPeople.length == 0) {
        // if no movies watched or people followed, send featured movies
        console.log("User hasn't watched any movies or followed any people.");
        const movies = await Movie.find()
          .sort([["Year", -1]])
          .limit(5);
        recommended.push(...movies);
      }
      if (user.followingPeople.length > 0) {
        // get movies from following people
        console.log("User follows at least one person.");
        for (const personId of user.followingPeople) {
          const person = await People.findOne({ _id: personId });
          for (const movieId of person.movies) {
            const movie = await Movie.findOne({ _id: movieId });
            if (!recommendedId.includes(movie._id.toString())) {
              recommended.push(movie);
              recommendedId.push(movie._id.toString());
            }
          }
        }
      }
      if (user.moviesWatched.length > 0) {
        // get most popular genre
        var genres = [];
        console.log("User has watched at least one movie.");
        for (const movieId of user.moviesWatched) {
          const movie = await Movie.findOne({ _id: movieId });
          movie.Genre.split(", ").forEach((genre) => {
            genres.push(genre);
          });
        }
        genres = Array.from(new Set(genres)).sort();
        var max = 0,
          result,
          freq = 0;
        for (var i = 0; i < genres.length; i++) {
          if (genres[i] === genres[i + 1]) {
            freq++;
          } else {
            freq = 0;
          }
          if (freq >= max) {
            result = genres[i];
            max = freq;
          }
        }
        const recommendedMovies = await Movie.find({ Genre: result })
          .sort([["Year", -1]])
          .limit(5);
        for (const recommendedMovie of recommendedMovies) {
          if (
            recommendedMovie._id.toString() !== queryMovie &&
            !recommendedId.includes(recommendedMovie._id.toString())
          ) {
            recommended.push(recommendedMovie);
            recommendedId.push(recommendedMovie._id.toString());
          }
        }
      }
      const reducedRecommended = recommended.slice(0, 5).map((movie) => {
        return {
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          id: movie._id,
        };
      });
      res.status(200).send(reducedRecommended);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Error getting recommended! " });
    }
  } else {
    res.status(400).send({ error: "Invalid query params. " });
  }
});

router.post("/movies/addPeople/:movie", async (req, res, next) => {
  console.log("POST addPeople");
  if (req.session.loggedIn && req.user.accountType == "Contributor") {
    console.log(req.body);
    var directorNames = [];
    var writerNames = [];
    var actorNames = [];
    var directors = [];
    var writers = [];
    var actors = [];
    var people = [];

    if (req.body.Director) {
      req.body.Director.split(", ").forEach((director) => {
        directorNames.push(director);
      });
      directorNames = Array.from(new Set(directorNames)).sort();
    }
    if (req.body.Writer) {
      req.body.Writer.split(", ").forEach((writer) => {
        writerNames.push(writer);
      });
      writerNames = Array.from(new Set(writerNames)).sort();
    }
    if (req.body.Actors) {
      req.body.Actors.split(", ").forEach((actor) => {
        actorNames.push(actor);
      });
      actorNames = Array.from(new Set(actorNames)).sort();
    }

    directors = await getPeopleIds(directorNames);
    writers = await getPeopleIds(writerNames);
    actors = await getPeopleIds(actorNames);
    console.log("people:", directorNames, writerNames, actorNames);
    people.push(...directors, ...writers, ...actors);

    for (const director of directors) {
      const directorDocument = await People.findOne({ _id: director.id });
      directorDocument.movies.push(req.params.movie);
      for (const follower of directorDocument.followers) {
        console.log("Notifying", follower);
        req.app.io.emit(follower, {
          name: directorDocument.name,
          body: `directed in ${newMovie.Title}.`,
        });
      }
      for (const person of people.filter((ele) => ele.name != director.name)) {
        var collaborator = directorDocument.frequentCollaborators.find(
          (ele) => ele.name === person.name
        );
        if (collaborator) {
          ++collaborator.count;
        } else {
          directorDocument.frequentCollaborators.push({
            name: person.name,
            id: person.id,
            count: 1,
          });
        }
      }
      await directorDocument.save();
    }
    for (const writer of writers) {
      const writerDocument = await People.findOne({ _id: writer.id });
      writerDocument.movies.push(req.params.movie);
      for (const follower of writerDocument.followers) {
        console.log("Notifying", follower);
        req.app.io.emit(follower, {
          name: writerDocument.name,
          body: `wrote in ${newMovie.Title}.`,
        });
      }
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
    for (const actor of actors) {
      const actorDocument = await People.findOne({ _id: actor.id });
      actorDocument.movies.push(req.params.movie);
      for (const follower of actorDocument.followers) {
        console.log("Notifying", follower);
        req.app.io.emit(follower, {
          name: actorDocument.name,
          body: `acted in ${newMovie.Title}.`,
        });
      }
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
    for (const director of directors) {
      await Movie.updateOne(
        { _id: req.params.movie },
        { $addToSet: { Director: director.id } }
      );
    }
    for (const writer of writers) {
      await Movie.updateOne(
        { _id: req.params.movie },
        { $addToSet: { Writer: writer.id } }
      );
    }
    for (const actor of actors) {
      await Movie.updateOne(
        { _id: req.params.movie },
        { $addToSet: { Actors: actor.id } }
      );
    }
    res.status(204).send("Movie updated.");
  } else {
    res.status(401).send({
      error: "Cannot update movie - must be logged in and contributing user. ",
    });
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
