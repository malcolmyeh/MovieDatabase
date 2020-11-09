import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";
axios.defaults.withCredentials = true;

var movieList = [];
var nameList = [];
var userList = [];
var currentQuery = "";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [names, setNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentNamePage, setCurrentNamePage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);

  const moviesPerPage = 10;
  const namesPerPage = 20;
  const usersPerPage = 20;
  const moviePageNumbers = [];
  const namePageNumbers = [];
  const userPageNumbers = [];

  var i;
  for (i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
    moviePageNumbers.push(
      <Pagination.Item
        onClick={setMoviePage}
        key={i}
        id={i}
        active={i === currentMoviePage}
      >
        {i}
      </Pagination.Item>
    );
  }

  for (i = 1; i <= Math.ceil(names.length / namesPerPage); i++) {
    namePageNumbers.push(
      <Pagination.Item
        onClick={setNamePage}
        key={i}
        id={i}
        active={i === currentNamePage}
      >
        {i}
      </Pagination.Item>
    );
  }

  for (i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    userPageNumbers.push(
      <Pagination.Item
        onClick={setUserPage}
        key={i}
        id={i}
        active={i === currentUserPage}
      >
        {i}
      </Pagination.Item>
    );
  }

  function setMoviePage(event) {
    setCurrentMoviePage(Number(event.target.id));
  }

  function setNamePage(event) {
    setCurrentNamePage(Number(event.target.id));
  }

  function setUserPage(event) {
    setCurrentUserPage(Number(event.target.id));
  }

  let location = useLocation();
  let queryString = new URLSearchParams(location.search).get("q");
  async function loadMovies() {
    setIsLoadingMovies(true);
    try {
      if (movieList.length === 0 || queryString !== currentQuery) {
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/movies?title=${queryString}`
        );
        movieList = res.data;
        currentQuery = queryString;
      }
      setMovies(movieList);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoadingMovies(false);
  }

  async function loadNames() {
    setIsLoadingNames(true);
    try {
      if (nameList.length === 0 || queryString !== currentQuery) {
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/people?name=${queryString}`
        );
        nameList = res.data;
        currentQuery = queryString;
      }
      setNames(nameList);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoadingNames(false);
  }

  async function loadUsers() {
    setIsLoadingUsers(true);
    try {
      if (userList.length === 0 || queryString !== currentQuery) {
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/users?name=${queryString}`
        );
        userList = res.data;
        currentQuery = queryString;
      }
      setUsers(userList);
    } catch (e) {
      console.log(e);
      alert(e);
    }

    setIsLoadingUsers(false);
  }

  useEffect(() => {
    async function onLoad() {
      loadMovies();
      loadNames();
      loadUsers();
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  function renderMoviePageNumbers() {
    return moviePageNumbers.length <= 1 ? (
      <></>
    ) : (
      <Row style={{ marginTop: "30px" }}>
        <Pagination style={{ overflowX: "auto", overflowY: "hidden " }}>
          {moviePageNumbers}
        </Pagination>
      </Row>
    );
  }
  function renderNamePageNumbers() {
    return namePageNumbers.length <= 1 ? (
      <></>
    ) : (
      <Row style={{ marginTop: "30px" }}>
        <Pagination style={{ overflowX: "auto", overflowY: "hidden " }}>
          {namePageNumbers}
        </Pagination>
      </Row>
    );
  }
  function renderUserPageNumbers() {
    return userPageNumbers.length <= 1 ? (
      <></>
    ) : (
      <Row style={{ marginTop: "30px" }}>
        <Pagination style={{ overflowX: "auto", overflowY: "hidden " }}>
          {userPageNumbers}
        </Pagination>
      </Row>
    );
  }

  function renderMovies() {
    const lastIndex = currentMoviePage * moviesPerPage - 1;
    const firstIndex = lastIndex - moviesPerPage + 1;
    const currentMovies = movies.slice(firstIndex, lastIndex + 1);
    return movies.length === 0 ? (
      <h4>No movies found. </h4>
    ) : (
      <FadeIn>
        <Row className="justify-content-md-center">
          {currentMovies.map((movie) => MovieCard(movie))}
        </Row>
      </FadeIn>
    );
  }

  function renderNames() {
    const lastIndex = currentNamePage * namesPerPage - 1;
    const firstIndex = lastIndex - namesPerPage + 1;
    const currentNames = names.slice(firstIndex, lastIndex + 1);
    return names.length === 0 ? (
      <h4>No people found. </h4>
    ) : (
      <FadeIn>
        <Row>
          <Col style={{ display: "inline-block", overflow: "hidden" }}>
            {currentNames.map((name, index) => {
              if (currentNames.length === index + 1) {
                return (
                  <Link key={name._id} to={`/name/${name._id}`}>
                    {name.name}
                  </Link>
                );
              } else {
                return (
                  <React.Fragment key={name._id}>
                    <Link to={`/name/${name._id}`}>{name.name}</Link> {`,\xa0`}
                  </React.Fragment>
                );
              }
            })}
          </Col>
        </Row>
      </FadeIn>
    );
  }

  function renderUsers() {
    const lastIndex = currentUserPage * usersPerPage - 1;
    const firstIndex = lastIndex - usersPerPage + 1;
    const currentUsers = users.slice(firstIndex, lastIndex + 1);
    return users.length === 0 ? (
      <h4>No users found. </h4>
    ) : (
      <FadeIn>
        <Row>
          <Col style={{ display: "inline-block", overflow: "hidden" }}>
            {currentUsers.map((user, index) => {
              if (currentUsers.length === index + 1) {
                return (
                  <Link key={user._id} to={`/profile/${user._id}`}>
                    {user.username}
                  </Link>
                );
              } else {
                return (
                  <React.Fragment key={user._id}>
                    <Link to={`/profile/${user._id}`}>{user.username}</Link>
                    {`,\xa0`}
                  </React.Fragment>
                );
              }
            })}
          </Col>
        </Row>
      </FadeIn>
    );
  }

  return (
    <Container>
      <h1>Search: {queryString.replace(/-/g, " ")}</h1>
      <h3>Movies</h3>
      {isLoadingMovies ? (
        Loading("movies")
      ) : (
        <>
          {renderMovies()}
          {renderMoviePageNumbers()}
        </>
      )}
      <h3>People</h3>
      {isLoadingNames ? (
        Loading("people")
      ) : (
        <>
          {renderNames()}
          {renderNamePageNumbers()}
        </>
      )}
      <h3>Users</h3>
      {isLoadingUsers ? (
        Loading("users")
      ) : (
        <>
          {renderUsers()}
          {renderUserPageNumbers()}
        </>
      )}
    </Container>
  );
}
