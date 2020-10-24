import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

export default function Reviews(id) {
  const [moviesWatched, setMoviesWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numMovies, setNumMovies] = useState(3);

  async function loadMoviesWatched(id) {
    setIsLoading(true);

    const res = await axios(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
    const movieIds = res.data.moviesWatched;
    var movieList = [];
    for (const movieId of movieIds) {
      const movie = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/movies/${movieId}`
      );
      movieList.push(movie.data);
    }

    setMoviesWatched(movieList);
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
      <Row className="justify-content-md-center">
        {moviesWatched.slice(0, numMovies).map((movie) => MovieCard(movie))}
      </Row>
      <Row>
        <Col>
          {numMovies !== moviesWatched.length ? (
            <p
              type="submit"
              onClick={() => {
                setNumMovies(moviesWatched.length);
              }}
              style={{ textDecoration: "underline" }}
            >
              See all
            </p>
          ) : (
            <p
              type="submit"
              onClick={() => {
                setNumMovies(3);
              }}
              style={{ textDecoration: "underline" }}
            >
              See less
            </p>
          )}
        </Col>
      </Row>
    </FadeIn>
  );
}
