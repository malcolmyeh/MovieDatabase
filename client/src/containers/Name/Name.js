import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import { formatLink, unformatLink } from "../../libs/linkutils";
import { Link, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

const sampleMovies = require("./sample-movie-list.json");
const sampleCollaborators = require("./sample-collaborators-list.json");

export default function Name() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);
  const [movies, setMovies] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [numMovies, setNumMovies] = useState(5);
  const { id } = useParams();

  const [person, setPerson] = useState({});

  async function loadPerson() {
    // person
    const personRes = await axios(`http://localhost:5000/api/people/${id}`);
    setPerson(personRes.data);
    console.log("personRes.data", personRes.data);
    // movies
    const movieIds = personRes.data.movies;
    const movieArr = [];
    for (const movieId of movieIds) {
      const movieRes = await axios.get(
        `http://localhost:5000/api/movies/${movieId}`
      );
      movieArr.push(movieRes.data);
    }
    setMovies(movieArr);
    // frequent collaborators
    // sort collaborators by count and return top 10
    const collaboratorArr = personRes.data.frequentCollaborators
      .sort((a, b) => a.count - b.count)
      .slice(0, 10);
    setCollaborators(collaboratorArr);
    setIsLoading(false);
  }

  async function loadMovies(name) {
    // setIsLoadingMovies(true);
    // await delay();
    // setMovies(sampleMovies.movies);
    setIsLoadingMovies(false);
  }

  async function loadCollaborators(name) {
    // setIsLoadingCollaborators(true);
    // await delay();
    // setCollaborators(sampleCollaborators.collaborators);
    setIsLoadingCollaborators(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadPerson();
        loadMovies(id);
        loadCollaborators(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);

  async function handleFollow() {
    setIsFollowing(!isFollowing);
  }

  function renderMovies() {
    return (
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
    return (
      <>
        <Row>
          <Col sm={2}>
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
    return (
      <FadeIn>
        <Row>
          <h3>Frequent Collaborators</h3>
        </Row>
        <Row>
          {collaborators.length !== 0 ? (
            collaborators.map((collaborator, i) => {
              if (collaborators.length === i + 1) {
                return (
                  <Link
                    to={`${formatLink(`/name/${collaborator.id}`)}`}
                    key={collaborator.id}
                  >
                    {collaborator.name}
                  </Link>
                );
              } else {
                return (
                  <div key={collaborator.id}>
                    <Link to={`${formatLink(`/name/${collaborator.id}`)}`}>
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
