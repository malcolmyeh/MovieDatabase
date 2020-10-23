const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: [true, 'Title is required. '],
    },
    Year: {
      type: String,
      required: [true, 'Year is required. ']
    },
    Rated: {
      type: String,
      required: [true, 'Rated is required. ']
    },
    Released: {
      type: String,
      required: [true, 'Released is required. ']
    },
    Runtime: {
      type: String,
      required: [true, 'Runtime is required. ']
    },
    Genre: {
      type: String,
      required: [true, 'Genre is required. ']
    },
    Director: {
      type: ObjectID,
      required: [true, 'Director is required. ']
    },
    Writer: {
      type: Array,
      default: [],
      required: [true, 'Writer is required. ']
    },
    Actors: {
      type: Array,
      default: [],
      required: [true, 'Actors is required. ']
    },
    Plot: {
      type: String,
      required: [true, 'Plot is required. ']
    },
    Language: {
      type: String,
      required: [true, 'Language is required. ']
    },
    Country: {
      type: String,
      required: [true, 'Country is required. ']
    },
    Awards: {
      type: String,
    },
    Poster: {
      type: String,
      required: [true, 'Poster is required. ']
    },
    Ratings: {
      type: Array,
      default: [],
    },
    Metascore: {
      type: String,
      default: 0
    },
    imdbRating: {
      type: String,
      default: 0
    },
    imdbId: {
      type: String,
    },
    Type: {
      type: String,
    },
    DVD: {
      type: String,
    },
    BoxOffice: {
      type: String,
    },
    Production: {
      type: String,
    },
    Rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  { strict: false }
);

module.exports = Movie = mongoose.model("movies", MovieSchema);
