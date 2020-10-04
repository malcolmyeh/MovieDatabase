import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";

// samplesGenres contains arr of unique genres
// todo: should this be hardcoded? Can we add movie with other genres?
// on server side, can get genres from every movie and return unique array
/*
function getUniqueGenres(){
    const data = movies.map((movie) => { return movie.Genre });
    var genreArr = [];
    for (const genreString of data) {
      var arr = genreString.split(", ");
      genreArr = [...arr, ...genreArr];
    }
    const uniqueGenreArr = Array.from(new Set(genreArr)).sort();
    console.log("uniqueGenreArr: ", uniqueGenreArr);
}
*/

var sampleGenres = require("./genres.json");

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadGenres() {
    await delay();
    setGenres(sampleGenres.data.genres);
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadGenres();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  });

  function listGenres() {
    return isLoading ? (
      Loading()
    ) : (
      <FadeIn>
        <ListGroup>
          {genres.map((genre) => {
            return (
              <ListGroup.Item key={genre}>
                <Link to={`/genre/${formatLink(genre)}`}>{genre}</Link>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </FadeIn>
    );
  }
  return (
    <Container>
      <h1>Movies by Genre</h1>
      {listGenres()}
    </Container>
  );
}
