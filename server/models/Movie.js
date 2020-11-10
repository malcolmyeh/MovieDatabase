const { TestScheduler } = require("jest");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

// validation for Rated and Type
const rated_enum = [
  "APPROVED",
  "Approved",
  "G",
  "GP",
  "M",
  "M/PG",
  "N/A",
  "NC-17",
  "NOT RATED",
  "Not Rated",
  "PASSED",
  "PG",
  "PG-13",
  "Passed",
  "R",
  "TV-13",
  "TV-14",
  "TV-G",
  "TV-MA",
  "TV-PG",
  "TV-Y7",
  "UNRATED",
  "Unrated",
  "X",
];
const type_enum = ["episode", "movie", "series"];

const MovieSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: [true, "Title is required. "],
    },
    Year: {
      type: String,
      required: [true, "Year is required. "],
    },
    Rated: {
      type: String,
      enum: rated_enum,
      validate: {
        validator: (Rated) => rated_enum.includes(Rated),
      },
      required: [true, "Rated is required. "],
    },
    Released: {
      type: String,
      required: [true, "Released is required. "],
    },
    Runtime: {
      type: String,
      required: [true, "Runtime is required. "],
    },
    Genre: {
      type: String,
      required: [true, "Genre is required. "],
    },
    Director: {
      type: Array,
      default: [],
      required: [true, "Director is required. "],
    },
    Writer: {
      type: Array,
      default: [],
      required: [true, "Writer is required. "],
    },
    Actors: {
      type: Array,
      default: [],
      required: [true, "Actors is required. "],
    },
    Plot: {
      type: String,
      required: [true, "Plot is required. "],
    },
    Language: {
      type: String,
      required: [true, "Language is required. "],
    },
    Country: {
      type: String,
      required: [true, "Country is required. "],
    },
    Awards: {
      type: String,
      default: "None",
    },
    Poster: {
      type: String,
      default:
        "https://i.pinimg.com/originals/ae/9f/73/ae9f732d6094233e902ca2bfdc8e2a84.jpg",
    },
    Ratings: {
      type: Array,
      default: [],
    },
    Metascore: {
      type: String,
      default: "N/A",
    },
    imdbRating: {
      type: String,
      default: "N/A",
    },
    imdbId: {
      type: String,
      default: "N/A",
    },
    Type: {
      type: String,
      enum: type_enum,
      validate: {
        validator: (Type) => type_enum.includes(Type),
      },
      required: [true, "type is required. "],
    },
    DVD: {
      type: String,
      default: "N/A",
    },
    BoxOffice: {
      type: String,
      default: "N/A",
    },
    Production: {
      type: String,
      default: "N/A",
    },
    Rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
  }
  // { strict: false }
);

module.exports = Movie = mongoose.model("movies", MovieSchema);
