import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";

var sampleMoviesWatched = require("./sample-movies-watched.json");

export default function Reviews(id) {
  const [moviesWatched, setMoviesWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  async function loadMoviesWatched(id) {
    setIsLoading(true);
    await delay();
    setMoviesWatched(sampleMoviesWatched.movies);
    setIsLoading(false);
  }
  useEffect(() => {
    async function onLoad() {
      try {
        loadMoviesWatched(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);

  return isLoading ? (
    Loading("movies watched")
  ) : (
    <FadeIn>
      <Row>
        <Col>
          <h3>Movies Watched</h3>
        </Col>
      </Row>
      <Row>{moviesWatched.map((movie) => MovieCard(movie))}</Row>
    </FadeIn>
  );
}
