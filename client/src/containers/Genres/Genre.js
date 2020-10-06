import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Filter from "../../components/Filter/Filter";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";

const sampleMovieList = require("./sample-movie-list.json");

export default function Genre() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  async function loadMovies(id) {
    await delay();
    setMovies(sampleMovieList.movies);
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadMovies(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  });

  function renderMovies() {
    return isLoading ? (
      Loading()
    ) : (
      <FadeIn>
        <Row>{movies.map((movie) => MovieCard(movie))}</Row>
      </FadeIn>
    );
  }

  return (
    <Container>
      <h1>{id.charAt(0).toUpperCase() + id.slice(1)}</h1>
      {Filter(movies, setMovies)}
      {renderMovies()}
    </Container>
  );
}
