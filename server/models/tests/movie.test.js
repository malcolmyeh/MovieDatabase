const mongoose = require("mongoose");
const Movie = require("../Movie");

const movieData = {
  Title: "test-movie",
  Year: "2020",
  Rated: "R",
  Released: "1 Jan 2020",
  Runtime: "99 min",
  Genre: "Action, Comedy",
  Director: [mongoose.Types.ObjectId("4edd40c86762e0fb12000005")],
  Writer: [mongoose.Types.ObjectId("4edd40c86762e0fb12000006")],
  Actors: [mongoose.Types.ObjectId("4edd40c86762e0fb12000007")],
  Plot: "is a cool movie",
  Language: "English",
  Country: "Canada",
  Type: "movie",
};

describe("Movie Model Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          process.exit(1);
        }
      }
    );
  });

  it("creates and saves movie successfully", async () => {
    const validMovie = new Movie(movieData);
    const savedMovie = await validMovie.save();

    expect(savedMovie._id).toBeDefined();

    // moviename/password matches json
    expect(savedMovie.Title).toBe(movieData.Title);
    expect(savedMovie.Year).toBe(movieData.Year);
    expect(savedMovie.Rated).toBe(movieData.Rated);
    expect(savedMovie.Released).toBe(movieData.Released);
    expect(savedMovie.Runtime).toBe(movieData.Runtime);
    expect(savedMovie.Genre).toBe(movieData.Genre);
    expect(savedMovie.Director).toBeDefined();
    expect(savedMovie.Writer).toBeDefined();
    expect(savedMovie.Actors).toBeDefined();
    expect(savedMovie.Language).toBe(movieData.Language);
    expect(savedMovie.Country).toBe(movieData.Country);
    expect(savedMovie.Type).toBe(movieData.Type);

    // defaults
    expect(savedMovie.Awards).toBeDefined();
    expect(savedMovie.Poster).toBeDefined();
    expect(savedMovie.Ratings).toBeDefined();
    expect(savedMovie.Metascore).toBeDefined();
    expect(savedMovie.imdbRating).toBeDefined();
    expect(savedMovie.imdbId).toBeDefined();
    expect(savedMovie.DVD).toBeDefined();
    expect(savedMovie.BoxOffice).toBeDefined();
    expect(savedMovie.Production).toBeDefined();
    expect(savedMovie.Rating).toBeDefined();
  });

  it("inserts movie successfully but ignores fields not defined in schema", async () => {
    var modifiedMovie = movieData;
    modifiedMovie.invalidField = "invalid";
    validMovie = new Movie(modifiedMovie);
    const savedMovie = await validMovie.save();
    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.invalidField).toBeUndefined();
  });

  it("does not create movie without required fields", async () => {
    const invalidMovie = new Movie({});
    var err;
    try {
      const savedMovie = await invalidMovie.save();
      e = savedMovie;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("does not create movie without valid fields", async () => {
    // validation on Rated and Type
    var invalidMovieData1 = movieData;
    invalidMovieData1.Rated = "invalid";
    const invalidMovie1 = new Movie(invalidMovieData1);

    var invalidMovieData2 = movieData;
    invalidMovieData2.Type = "invalid";
    const invalidMovie2 = new Movie(invalidMovieData2);

    var err;

    try {
      const savedMovie1 = await invalidMovie1.save();
      e = savedMovie1;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);

    try {
      const savedMovie2 = await invalidMovie2.save();
      e = savedMovie2;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
