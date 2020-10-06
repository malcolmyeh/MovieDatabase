import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Filter from "../../components/Filter/Filter";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";

const sampleMovieList = require("./sample-movie-list.json");

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let location = useLocation();
  let queryString = new URLSearchParams(location.search).get("q");

  async function loadMovies() {
    // search to be handled on server side
    setIsLoading(true);
    console.log(
      sampleMovieList.movies.filter((movie) =>
        movie.Title.toLowerCase().includes(queryString)
      ).length,
      " movies found."
    );
    await delay();
    setMovies(
      sampleMovieList.movies.filter((movie) => {
        return (
          movie.Title.toLowerCase().includes(queryString) ||
          movie.Year.includes(queryString)
        );
      })
    );
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadMovies();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  function renderMovies() {
    return isLoading ? (
      Loading("movies")
    ) : (
      <FadeIn>
        <Row>{movies.map((movie) => MovieCard(movie))}</Row>
      </FadeIn>
    );
  }

  return (
    <Container>
      <h1>Search: {queryString.replace(/-/g, " ")}</h1>
      <h3>Movies</h3>
      {Filter(movies, setMovies)}
      {renderMovies()}
      <h3>Names (not yet implemented)</h3>
      <h3>Users (not yet implemented)</h3>
    </Container>
  );
}
