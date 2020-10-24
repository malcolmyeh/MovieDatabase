import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Pagination } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Filter from "../../components/Filter/Filter";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var movieList = [];
var currentQuery = "";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 10;
  const pageNumbers = [];

  for (var i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
    pageNumbers.push(
      <Pagination.Item
        onClick={setPage}
        key={i}
        id={i}
        active={i === currentPage}
      >
        {i}
      </Pagination.Item>
    );
  }

  function setPage(event) {
    setCurrentPage(Number(event.target.id));
  }

  let location = useLocation();
  let queryString = new URLSearchParams(location.search).get("q");
  async function loadMovies() {
    setIsLoading(true);

    if (movieList.length === 0 || queryString !== currentQuery) {
      const res = await axios(
        `http://localhost:5000/api/movies?title=${queryString}`
      );
      movieList = res.data;
      currentQuery = queryString;
    }
    setMovies(movieList);
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

  function renderPageNumbers() {
    return (
      <Row style={{ marginTop: "30px" }}>
        <Pagination style={{ overflowX: "auto", overflowY: "hidden " }}>
          {pageNumbers}
        </Pagination>
      </Row>
    );
  }

  function renderMovies() {
    const lastIndex = currentPage * moviesPerPage - 1;
    const firstIndex = lastIndex - moviesPerPage + 1;
    const currentMovies = movies.slice(firstIndex, lastIndex + 1);
    return (
      <FadeIn>
        <Row className="justify-content-md-center">{currentMovies.map((movie) => MovieCard(movie))}</Row>
      </FadeIn>
    );
  }

  return (
    <Container>
      <h1>Search: {queryString.replace(/-/g, " ")}</h1>
      <h3>Movies</h3>
      {Filter(movies, setMovies)}
      {isLoading ? (
        Loading()
      ) : (
        <>
          {" "}
          {renderMovies()}
          {renderPageNumbers()}{" "}
        </>
      )}
      <h3>Names (not yet implemented)</h3>
      <h3>Users (not yet implemented)</h3>
    </Container>
  );
}
