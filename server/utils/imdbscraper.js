const cheerio = require("cheerio");
const axios = require("axios");
const { writeFileSync } = require("fs");

// returns array of imdbID of movies matching search term
async function getImdbIDs(searchTerm, type = "movie") {
  var searchURL;
  if (type === "movie") {
    searchUrl = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";
  } else if (type === "series") {
    searchUrl = "https://www.imdb.com/find?s=tt&ttype=tv&ref_=fn_tv&q=";
  } else {
    console.log("Type must be movie or series. ");
    return;
  }
  console.log(`Searching IMDB for "${searchTerm}"...`);
  const imdbIDs = [];

  try {
    const res = await axios.get(`${searchUrl}${searchTerm}`);
    const $ = cheerio.load(res.data);
    // console.log(`${$(".findResult").length} movies found: `);

    $(".findResult").each(function (i, element) {
      const $element = $(element);
      const $title = $element.find("td.result_text");
      const imdbID = $element
        .find("td.result_text a")
        .attr("href")
        .match(/title\/(.*)\//)[1];
      // console.log(i + 1, $title.text().substring(1));
      imdbIDs.push(imdbID);
    });
    // console.log("imdbIDs:", imdbIDs);
  } catch (e) {
    console.log(e);
  }
  return imdbIDs;
}

// returns JSON containing movie data
async function getMovieData(imdbID) {
  var movie = {};

  const movieUrl = "https://www.imdb.com/title/";
  console.log(`Getting data for "${imdbID}"...`);
  try {
    const res = await axios.get(`${movieUrl}${imdbID}`);
    writeFileSync(`moviedata.html`, res.data);

    const $ = cheerio.load(res.data);

    if ($(".navigation_panel").text().includes("Episode Guide")) {
      console.log("is series");
      movie.Type = "series";
    } else if ($(".bp_heading").text().includes("All Episodes")) {
      console.log("is episode");
      movie.Type = "episode";
    } else {
      console.log("is movie");
      movie.Type = "movie";
    }
    // Title
    movie.Title = $(".title_wrapper h1")
      .first()
      .contents()
      .filter(function () {
        return this.type === "text";
      })
      .text()
      .trim();
    // Rated
    movie.Rated = $(".subtext")
      .first()
      .contents()
      .filter(function () {
        return this.type === "text";
      })[0]
      .data.trim()
      ? $(".subtext")
          .first()
          .contents()
          .filter(function () {
            return this.type === "text";
          })[0]
          .data.trim()
      : "N/A";
    movie.Awards = $("#titleAwardsRanks .awards-blurb")
      ? $("#titleAwardsRanks .awards-blurb")
          .text()
          .replace(/\s\s+/g, " ")
          .trim()
      : "N/A";
    if (movie.Type === "movie") {
      // Year
      const $year = $(".title_wrapper span").attr("id", "titleYear");
      movie.Year = $year.first().contents().text().trim().replace(/[()]/g, "");
    } else if (movie.Type === "series") {
      // Year
      movie.Year = $(".subtext")
        .text()
        .match(/\(([^)]+)\)/)[1]
        .trim()
        .replace(/[()]/g, "");
    } else {
      // Year
      movie.Year = $(".parentDate").text().trim().replace(/[()]/g, "");
      movie.Awards = "N/A";
    }
    // IMDB Rating
    movie.imdbRating = $(".ratingValue").text().replace("/10", "").trim()
      ? $(".ratingValue").text().replace("/10", "").trim()
      : "N/A";

    // Metascore
    movie.Metascore = $(".metacriticScore").text().trim()
      ? $(".metacriticScore").text().trim()
      : "N/A";

    // Runtime
    if (
      $(".subtext")
        .first()
        .contents()
        .filter(function () {
          return this.name === "time";
        })[0]
    ) {
      movie.Runtime =
        $(".subtext")
          .first()
          .contents()
          .filter(function () {
            return this.name === "time";
          })[0]
          .attribs.datetime.replace(/\D/g, "") + " min";
    } else {
      movie.Runtime = "N/A";
    }
    movie.Released = $(".subtext")
      .find("a")
      .contents()
      [$(".subtext").find("a").contents().length - 1].data.replace(
        / *\([^)]*\) */g,
        ""
      )
      .replace("Episode aired", "")
      .trim();
    // Genre
    var genresList = [];
    $(".subtext")
      .find("a")
      .each(function (i, element) {
        if ($(element).attr("href").includes("/search/title?genres="))
          genresList.push($(element.children));
      });
    genresList = genresList.map((genre) => genre[0].data);
    movie.Genre = genresList.join(", ");

    // JSON contains Actors, Directors, Writers
    var jsonData;

    $("script").map((i, script) => {
      if (script.attribs.type === "application/ld+json")
        jsonData = JSON.parse(script.children[0].data);
    });

    movie.Director = jsonData.director ? jsonData.director.name : "N/A";
    movie.Writer = jsonData.creator
      .filter((writer) => writer["@type"] === "Person")
      .map((writer) => writer.name)
      .join(", ");
    movie.Actors = jsonData.actor
      .filter((actor) => actor["@type"] === "Person")
      .map((actor) => actor.name)
      .join(", ");

    movie.Poster = $("div.poster a img").attr("src");
    movie.Plot = $("div.summary_text").text().trim();

    var arr = [];
    $("#titleDetails")
      .find("div")
      .map((i, detail) => {
        arr.push({
          title: $(detail).find("h4").text().trim().replace(":", ""),
          text: $(detail)
            .text()
            .replace("|", "")
            .replace("|", "")
            .replace("|", "")
            .replace("»", "")
            .replace($(detail).find("h4").text().trim(), "")
            .replace("See more", "")
            .trim()
            .split("\n"),
        });
      });
    var detailObj = {};
    for (var ele of arr) {
      var words = [];
      for (var word of ele.text) {
        word = word.replace(/(^\s+|\s+$)/g, "");
        words.push(word);
      }
      words = words.filter((word) => word.length > 0);
      detailObj[ele.title] = words;
    }
    movie.Production = detailObj["Production Co"]
      ? detailObj["Production Co"][0]
          .split(",")[0]
          .replace(/ *\([^)]*\) */g, "")
      : "N/A";
    movie.BoxOffice = detailObj["Cumulative Worldwide Gross"]
      ? detailObj["Cumulative Worldwide Gross"][0]
      : "N/A";
    movie.Language = detailObj.Language ? detailObj.Language.join(", ") : "N/A";
    movie.Country = detailObj.Country ? detailObj.Country[0] : "N/A";
    // console.log(movie);
  } catch (e) {
    console.log(e);
  }
  return movie;
}

// getImdbIDs("test", "series");
// getMovieData("tt3297776"); // episode
// getMovieData("tt1520211"); //series
// getMovieData("adsfasdf");

exports.getImdbIDs = getImdbIDs;
exports.getMovieData = getMovieData;
