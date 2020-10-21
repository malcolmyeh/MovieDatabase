const movies = require("../data/movie-data.json");
const Movie = require("../models/Movie");
const People = require("../models/People");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

// Script to load movies and people from movie-data.json

async function insertMovies() {
  console.log("Inserting movies...");
  var db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error: "));

  for (const movie of movies) {
    var directorName;
    var writerNames = [];
    var actorNames = [];
    var director;
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
      imbdbRating: movie.imbdbRating,
      imdbId: movie.imdbId,
      Type: movie.Type,
      DVD: movie.DVD,
      BoxOffice: movie.BoxOffice,
      Production: movie.Production,
    });

    // Get people from each movie object
    directorName = [movie.Director];
    movie.Writer.replace(/ *\([^)]*\) */g, "")
      .split(", ")
      .forEach((writer) => {
        // remove brackets
        writerNames.push(writer);
      });
    writerNames = Array.from(new Set(writerNames)).sort(); // some writers listed multiple times
    movie.Actors.split(", ").forEach((actor) => {
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
  }
  console.log("Done inserting movies.");
  // mongoose.disconnect();
}

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

// insertMovies();

module.exports = { insertMovies }