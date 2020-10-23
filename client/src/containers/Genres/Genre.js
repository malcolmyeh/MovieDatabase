import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Pagination } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Filter from "../../components/Filter/Filter";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var movieList = [];
var currentId = "";

export default function Genre() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const moviesPerPage = 25;
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

  async function loadMovies(id) {
    if (movieList.length === 0 || id !== currentId) {
      const res = await axios(`http://localhost:5000/api/movies?genre=${id}`);
      movieList = res.data;
      currentId = id;
    }
    setMovies(movieList);
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
  }, [id]);

  function renderPageNumbers() {
    return (
      <Row className="justify-content-md-center" style={{ marginTop: "30px" }}>
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
      <h1>{id.charAt(0).toUpperCase() + id.slice(1)}</h1>
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
    </Container>
  );
}
