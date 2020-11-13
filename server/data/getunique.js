// script to check unique values of movie data fields

const movies = require("../data/movie-data.json");

var ratedArr = [];
movies.forEach((movie) => {
    var rated = movie.Rated;
    ratedArr = [...ratedArr, rated];
});
var uniqueRatedArr = Array.from(new Set(ratedArr)).sort();
console.log("Rated:", uniqueRatedArr);

var typeArr = [];
movies.forEach((movie) => {
    var type = movie.Type;
    typeArr = [...typeArr, type];
});
var uniqueTypeArr = Array.from(new Set(typeArr)).sort();
console.log("Type:", uniqueTypeArr);



