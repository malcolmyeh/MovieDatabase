import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Link, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Loading from "../../components/Loading/Loading";

import FadeIn from "../../components/Fade/Fade";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Name() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [movies, setMovies] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [numMovies, setNumMovies] = useState(5);
  const { id } = useParams();

  const [person, setPerson] = useState({});

  async function loadPerson() {
    setIsLoading(true);
    // person
    try {
      const personRes = await axios(
        `${process.env.REACT_APP_API_URL}/api/people/${id}`
      );
      setIsFollowing(personRes.data.isFollowing)
      setPerson(personRes.data.person);
      // console.log("personRes.data", personRes.data);
      // movies
      const movieIds = personRes.data.person.movies;
      const movieArr = [];
      for (const movieId of movieIds) {
        const movieRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies/${movieId}`
        );
        movieArr.push(movieRes.data.movie);
      }
      // console.log("movieArr:", movieArr);
      setMovies(movieArr);
      // frequent collaborators
      // sort collaborators by count and return top 10
      const collaboratorArr = personRes.data.person.frequentCollaborators
        .sort((a, b) => a.count - b.count)
        .slice(0, 10);
      setCollaborators(collaboratorArr);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoading(false);
  }
  // console.log("isFollowing:",isFollowing);

  useEffect(() => {
    async function onLoad() {
      loadPerson();
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleFollow() {
    if (!isFollowing) {
      try {
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/followperson/${id}`
        );
        console.log(res);
        setIsFollowing(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/unfollowperson/${id}`
        );
        console.log(res);
        setIsFollowing(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  function renderMovies() {
    return isLoading ? (
      Loading("movies")
    ) : (
      <FadeIn>
        <Row>
          <h3>Movies</h3>
        </Row>
        <Row>{movies.slice(0, numMovies).map((movie) => MovieCard(movie))}</Row>
        <Row>
          {numMovies !== movies.length ? (
            <p
              type="submit"
              onClick={() => {
                setNumMovies(movies.length);
              }}
              style={{ textDecoration: "underline" }}
            >
              See all
            </p>
          ) : (
            <p
              type="submit"
              onClick={() => {
                setNumMovies(5);
              }}
              style={{ textDecoration: "underline" }}
            >
              See less
            </p>
          )}
        </Row>
      </FadeIn>
    );
  }

  function renderInfo() {
    return isLoading ? (
      Loading("info")
    ) : (
      <>
        <Row>
          <Col sm={4.5}>
            <img
              alt="user"
              style={{ height: "15vh" }}
              src="https://www.peerq.com/profilepics/default-profile.png"
            />
          </Col>
          <Col sm={8}>
            <h1>{person.name}</h1>
            {isFollowing ? (
              <LoadingButton onClick={handleFollow} variant="outline-danger">
                Unfollow
              </LoadingButton>
            ) : (
              <LoadingButton onClick={handleFollow} variant="outline-primary">
                Follow
              </LoadingButton>
            )}
          </Col>
        </Row>
      </>
    );
  }

  function renderCollaborators() {
    return isLoading ? (
      Loading("collaborators")
    ) : (
      <FadeIn>
        <Row>
          <h3>Frequent Collaborators</h3>
        </Row>
        <Row>
          {collaborators.length !== 0 ? (
            collaborators.map((collaborator, i) => {
              if (collaborators.length === i + 1) {
                return (
                  <Link to={`/name/${collaborator.id}`} key={collaborator.id}>
                    {collaborator.name}
                  </Link>
                );
              } else {
                return (
                  <div key={collaborator.id}>
                    <Link to={`/name/${collaborator.id}`}>
                      {collaborator.name}
                    </Link>
                    {`,\xa0`}
                  </div>
                );
              }
            })
          ) : (
            <p>No collaborators found. </p>
          )}
        </Row>
      </FadeIn>
    );
  }

  return (
    <Container>
      {renderInfo()}
      {renderMovies()}
      {renderCollaborators()}
    </Container>
  );
}
