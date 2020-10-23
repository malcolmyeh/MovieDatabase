import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";
import Trailer from "../../components/Trailer/Trailer";
import axios from "axios";
import { loremIpsum } from "lorem-ipsum";

const sampleMovieList = require("./sample-movie-list.json");

// hard coded movie and reviews
var sampleReviews = require("./sample-reviews.json");

var reviewList = [];

export default function Movie() {
  const { isAuthenticated, username } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState({});
  const [director, setDirector] = useState("");
  const [writers, setWriters] = useState([]);
  const [actors, setActors] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [watched, setWatched] = useState(false);

  const { id } = useParams();
  async function loadReviews() {
    if (reviewList.length === 0) {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      console.log("reviewList: ", res.data);
      reviewList = res.data;
    }
    setReviews(reviewList);
    setIsLoadingReviews(false);
  }

  async function loadMovie() {
    // movie
    const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
    setMovie(movieRes.data);
    // director name from id
    const directorId = movieRes.data.Director;
    const directorRes = await axios.get(
      `http://localhost:5000/api/people/${directorId}`
    );
    setDirector(directorRes.data.name);
    const writerIds = movieRes.data.Writer;
    // writer names from id
    const writerArr = [];
    for (const writerId of writerIds) {
      const writerRes = await axios.get(
        `http://localhost:5000/api/people/${writerId}`
      );
      // setWriters(...writers, writerRes.data.name);
      writerArr.push(writerRes.data.name);
    }
    setWriters(writerArr);
    // actor names from id
    const actorArr = [];
    const actorIds = movieRes.data.Actors;
    for (const actorId of actorIds) {
      const actorRes = await axios.get(
        `http://localhost:5000/api/people/${actorId}`
      );
      // setActors(...actors, actorRes.data.name);
      actorArr.push(actorRes.data.name);
    }
    setActors(actorArr);
    setIsLoadingMovie(false);
  }

  async function loadRecommended(sampleMovieList) {
    await delay();
    setRecommended(sampleMovieList.movies);
    setIsLoadingRecommended(false);
  }

  useEffect(() => {
    setIsLoadingMovie(true);
    setIsLoadingReviews(true);
    setIsLoadingRecommended(true);
    async function onLoad() {
      try {
        await loadMovie();
        loadReviews();
        loadRecommended(sampleMovieList);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [id]);

  function handleWatched() {
    const w = watched;
    setWatched(!w);
  }

  // Review form fields
  var [fields, handleFieldChange] = useFields({
    title: "",
    rating: "",
    body: "",
  });

  function generateReview() {
    fields.title = loremIpsum().slice(0, -1);
    fields.body = loremIpsum({ count: 3, units: "paragraph" });
    fields.rating = Math.floor(Math.random() * 11).toString();
    handleSubmit();
  }

  function generateRating() {
    fields.rating = Math.floor(Math.random() * 11).toString();
    handleSubmit();
  }

  // Review Modals state
  const [showFullReview, setShowFullReview] = useState(false);
  const [showBasicReview, setShowBasicReview] = useState(false);
  const handleCloseFull = () => {
    setShowFullReview(false);
    resetReview();
  };
  const handleCloseBasic = () => {
    setShowBasicReview(false);
    resetReview();
  };
  const handleShowFull = () => setShowFullReview(true);
  const handleShowBasic = () => setShowBasicReview(true);
  function resetReview() {
    fields.title = "";
    fields.rating = "";
    fields.body = "";
  }

  function getReviews() {
    return isLoadingReviews ? (
      Loading("reviews")
    ) : (
      // todo: read more accordion or separate page
      // todo: sort by date
      <FadeIn>
        <h2>User Reviews</h2>
        {reviews.map((review) => {
          return review.title !== "" && review.body !== "" ? ( // don't display basic review/rating
            <div key={review.user + review.title}>
              <h5>{`${review.score}/10\xa0\xa0${review.title}`}</h5>
              <p>
                {`${review.date.slice(0, 10)}\xa0|\xa0 by `}
                <Link to={`/profile/${review.userId}`}>
                  {review.userName}
                </Link>
              </p>
              <p>{review.body}</p>
            </div>
          ) : (
            <h3>No reviews</h3>
          );
        })}
      </FadeIn>
    );
  }

  function handleSubmitForm(event) {
    event.preventDefault();
    handleSubmit();
  }

  async function handleSubmit() {
    // todo: let server handle duplicates
    setIsLoading(true);
    setIsLoadingReviews(true);
    const { rating, title, body } = fields;
    const newReview = {
      movie: movie.title,
      rating: rating,
      title: title,
      body: body,
      user: username, // todo: appcontext stores username
      date: "31/12/20", // todo: generate date (momentjs?), formatdate function
    };
    try {
      sampleReviews.reviews.push(newReview);
    } catch (e) {
      console.log(e);
    }
    handleCloseBasic();
    handleCloseFull();
    setIsLoading(false);
    loadReviews(sampleReviews);
    return;
  }

  function validateForm() {
    return Number(fields.rating) > 0 && Number(fields.rating <= 10);
  }

  function renderBasicReviewForm() {
    return (
      <Modal show={showBasicReview} onHide={handleCloseBasic}>
        <Modal.Header closeButton>
          <Modal.Title>Rate {movie.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="danger" onClick={generateRating}>
            Generate
          </Button>
          <Form onSubmit={handleSubmitForm}>
            <Form.Row>
              <Form.Group as={Col} sm={2}>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  id="rating"
                  value={fields.rating}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              {" "}
              Submit{" "}
            </LoadingButton>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  function renderFullReviewForm() {
    return (
      <Modal show={showFullReview} onHide={handleCloseFull}>
        <Modal.Header closeButton>
          <Modal.Title>Review {movie.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="danger" onClick={generateReview}>
            Generate
          </Button>
          <Form onSubmit={handleSubmitForm}>
            <Form.Row>
              <Form.Group as={Col} sm={2}>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  id="rating"
                  value={fields.rating}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <Form.Group as={Col} sm={10}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  id="title"
                  value={fields.title}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Review</Form.Label>
                <Form.Control
                  id="body"
                  value={fields.body}
                  as="textarea"
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              {" "}
              Submit{" "}
            </LoadingButton>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  // returns list of string with link (for genre, writers, actors, etc.)
  function getGenres() {
    var genreArr = movie.Genre.split(", ");
    return (
      <div style={{ display: "flex" }}>
        {genreArr.map((ele, i) => {
          if (genreArr.length === i + 1) {
            return (
              <Link to={`/genre/${ele}`} key={ele}>
                {ele}
              </Link>
            );
          } else {
            return (
              <div key={ele}>
                <Link to={`/genre/${ele}`} key={ele}>
                  {ele}
                </Link>
                {`,\xa0`}
              </div>
            );
          }
        })}
      </div>
    );
  }

  function getDirector() {
    return <Link to={`/name/${movie.Director}`}>{director}</Link>;
  }

  function getWriters() {
    return writers.map((writer, index) => {
      if (writers.length === index + 1) {
        return (
          <Link key={writer} to={`/name/${movie.Writer[index]}`}>
            {writer}
          </Link>
        );
      } else {
        return (
          <React.Fragment key={writer}>
            <Link to={`/name/${movie.Writer[index]}`}>{writer}</Link> {`,\xa0`}
          </React.Fragment>
        );
      }
    });
  }

  function getActors() {
    return actors.map((actor, index) => {
      if (actors.length === index + 1) {
        return (
          <Link key={actor} to={`/name/${movie.Actors[index]}`}>
            {actor}
          </Link>
        );
      } else {
        return (
          <React.Fragment key={actor}>
            <Link to={`/name/${movie.Actors[index]}`}>{actor}</Link> {`,\xa0`}
          </React.Fragment>
        );
      }
    });
  }

  function renderMoreLike() {
    // todo:
    // 3 or 6 recommended movies
    // search with title (sequels/prequels)
    // match same rating and match all genres -> removing last genre if no match
    return (
      <Row className="mt-3">
        <Col>
          {isLoadingRecommended ? (
            Loading("recommended")
          ) : (
            <FadeIn>
              <h2>More Like This</h2>
              <Row>
                {recommended.length > 0 ? (
                  recommended.map((movie) => MovieCard(movie))
                ) : (
                  <p>No recommended movies. </p>
                )}
              </Row>
            </FadeIn>
          )}
        </Col>
      </Row>
    );
  }

  function renderMovieInfo() {
    return isLoadingMovie ? (
      Loading("movie")
    ) : (
      <FadeIn>
        <Row className="mt-5">
          <Col sm={8}>
            <h1>
              {movie.Title} ({movie.Year})
            </h1>
            <Row>
              <Col style={{ display: "flex" }}>
                {movie.Rated}
                {`\xa0\xa0\xa0|\xa0\xa0\xa0`}
                {movie.Runtime}
                {`\xa0\xa0\xa0|\xa0\xa0\xa0`}
                {getGenres()}
                {`\xa0\xa0\xa0|\xa0\xa0\xa0`}
                {movie.Released}
              </Col>
            </Row>
            <Row>
              <Col>
                {!watched ? (
                  <LoadingButton
                    onClick={handleWatched}
                    variant="outline-primary"
                  >
                    Add to Watched
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    onClick={handleWatched}
                    variant="outline-danger"
                  >
                    Remove from Watched
                  </LoadingButton>
                )}
              </Col>
            </Row>
          </Col>
          <Col sm={3} style={{ display: "flex" }}>
            {reviews.length > 0 ? (
              <>
                <h1>★{movie.Rating}</h1>
                <p>{`\xa0\xa0(${reviews.length} ratings)`}</p>{" "}
              </>
            ) : (
              <h3>No ratings </h3>
            )}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={2}>
            <img
              src={movie.Poster}
              alt="Poster"
              style={{ maxHeight: "30vh" }}
            />
          </Col>
          <Col sm={6}>{Trailer(movie)}</Col>
        </Row>
        <Row className="mt-3">
          <Col sm={8}>
            <Row>
              <Col>{movie.Plot}</Col>
            </Row>
            <Row>
              <Col>Director: {getDirector()}</Col>
            </Row>
            <Row>
              <Col style={{ display: "inline-block", overflow: "hidden" }}>
                {`Writers:\xa0`}
                {getWriters()}
              </Col>
            </Row>
            <Row>
              <Col style={{ display: "inline-block", overflow: "hidden" }}>
                {`Actors:\xa0`}
                {getActors()}
              </Col>
            </Row>
            <Row>
              <Col>
                {`Metascore:\xa0`}
                {movie.Metascore}
                {`\xa0IMDB Rating:\xa0`}
                {movie.imdbRating}
              </Col>
            </Row>
            <Row>
              <Col>{movie.Awards}</Col>
            </Row>
          </Col>
        </Row>
      </FadeIn>
    );
  }

  function renderReviews() {
    return (
      <Row className="mt-3">
        <Col>
          {getReviews()}
          {isAuthenticated ? (
            <>
              {renderFullReviewForm()}
              {renderBasicReviewForm()}
              <Button
                className="mr-1"
                variant="outline-dark"
                onClick={handleShowFull}
              >
                Review this title
              </Button>
              <Button
                className="mr-1"
                variant="outline-dark"
                onClick={handleShowBasic}
              >
                Rate this title
              </Button>
            </>
          ) : (
            <h3>Sign in to review or rate this title. </h3>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <Container>
      {renderMovieInfo()}
      {renderMoreLike()}
      {renderReviews()}
    </Container>
  );
}
