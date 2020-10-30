import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import Trailer from "../../components/Trailer/Trailer";
import axios from "axios";
import { loremIpsum } from "lorem-ipsum";
axios.defaults.withCredentials = true;

var reviewList = [];
// var currentId = "";

export default function Movie() {
  const { isAuthenticated, username, userId, isContributor } = useAppContext();
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState({});
  const [directors, setDirectors] = useState([]);
  const [writers, setWriters] = useState([]);
  const [actors, setActors] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [watched, setWatched] = useState(false);
  const { id } = useParams();

  async function loadReviews() {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/reviews?movieId=${id}`,
      { credentials: "include" }
    );
    console.log("reviewList: ", res.data);
    reviewList = res.data;
    setReviews(reviewList);
    setIsLoadingReviews(false);
  }

  async function loadMovie() {
    // movie
    setIsLoadingMovie(true);
    const movieRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/movies/${id}`
    );
    console.log("movieRes,", movieRes);
    setMovie(movieRes.data.movie);
    setWatched(movieRes.data.isWatched);
    // director name from id
    const directorIds = movieRes.data.movie.Director;
    const directorArr = [];
    for (const directorId of directorIds) {
      const directorRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/people/${directorId}`
      );
      directorArr.push(directorRes.data.person.name);
    }
    setDirectors(directorArr);

    const writerIds = movieRes.data.movie.Writer;
    // writer names from id
    const writerArr = [];
    for (const writerId of writerIds) {
      const writerRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/people/${writerId}`
      );
      // setWriters(...writers, writerRes.data.name);
      writerArr.push(writerRes.data.person.name);
    }
    setWriters(writerArr);
    // actor names from id
    const actorArr = [];
    const actorIds = movieRes.data.movie.Actors;
    for (const actorId of actorIds) {
      const actorRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/people/${actorId}`
      );
      // setActors(...actors, actorRes.data.name);
      actorArr.push(actorRes.data.person.name);
    }
    setActors(actorArr);
    setIsLoadingMovie(false);
  }

  async function loadRecommended() {
    const res = await axios(
      `${process.env.REACT_APP_API_URL}/api/recommended/${id}`
    );
    console.log("recommended: ", res.data);
    setRecommended(res.data);
    setIsLoadingRecommended(false);
  }

  useEffect(() => {
    setIsLoadingMovie(true);
    setIsLoadingReviews(true);
    setIsLoadingRecommended(true);
    async function onLoad() {
      try {
        await loadMovie(); // load movie first so visual transition isn't as jarring
        loadReviews();
        loadRecommended();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);

  async function handleWatched() {
    try {
      if (watched) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/removemoviewatched/${id}`
        );
        console.log(res);
        setWatched(false);
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/addmoviewatched/${id}`
        );
        console.log(res);
        setWatched(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Review form fields
  var [fields, handleFieldChange] = useFields({
    title: "",
    score: "",
    body: "",
    director: "",
    writer: "",
    actors: "",
  });

  function generateReview() {
    fields.title = loremIpsum().slice(0, -1);
    fields.body = loremIpsum({ count: 3, units: "paragraph" });
    fields.score = Math.floor(Math.random() * 11).toString();
    handleSubmit();
  }

  function generateRating() {
    fields.score = Math.floor(Math.random() * 11).toString();
    handleSubmit();
  }

  // Review Modals state
  const [showFullReview, setShowFullReview] = useState(false);
  const [showBasicReview, setShowBasicReview] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const handleCloseFull = () => {
    setShowFullReview(false);
    resetReview();
  };
  const handleCloseBasic = () => {
    setShowBasicReview(false);
    resetReview();
  };
  const handleCloseAddPerson = () => {
    setShowAddPerson(false);
    resetAddPerson();
  };
  const handleShowFull = () => setShowFullReview(true);
  const handleShowBasic = () => setShowBasicReview(true);
  const handleShowAddPerson = () => setShowAddPerson(true);
  function resetReview() {
    fields.title = "";
    fields.score = "";
    fields.body = "";
  }

  function resetAddPerson() {
    fields.director = "";
    fields.writer = "";
    fields.actors = "";
  }

  function getReviews() {
    return isLoadingReviews ? (
      Loading("reviews")
    ) : (
      // todo: sort by date
      <FadeIn>
        <h2>User Reviews</h2>
        {reviews.map((review) => {
          return review.title !== "" && review.body !== "" ? ( // don't display basic review/score
            <div key={review.user + review.title}>
              <h5>{`${review.score}/10\xa0\xa0${review.title}`}</h5>
              <p>
                {`${review.date.slice(0, 10)}\xa0|\xa0 by `}
                <Link to={`/profile/${review.userId}`}>{review.userName}</Link>
              </p>
              <p>{review.body}</p>
            </div>
          ) : (
            <></>
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
    setIsLoadingReviews(true);
    const { score, title, body } = fields;
    const newReview = {
      userId: userId,
      userName: username,
      movieTitle: movie.Title,
      movieId: id,
      score: score,
      title: title,
      body: body,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reviews`,
        newReview
      );
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    handleCloseBasic();
    handleCloseFull();
    // loadMovie();
    loadReviews();
    return;
  }

  function validateReviewForm() {
    return Number(fields.score) > 0 && Number(fields.score <= 10);
  }

  function validateAddPersonForm() {
    return (
      fields.director.length > 0 ||
      fields.writer.length > 0 ||
      fields.actors.length > 0
    );
  }

  async function handleAddPerson(event) {
    event.preventDefault();
    const { director, writer, actors } = fields;
    const newPeople = {
      Director: director.length > 0 ? director : null,
      Writer: writer.length > 0 ? writer : null,
      Actors: actors.length > 0 ? actors : null,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/addPeople/${id}`,
        newPeople
      );
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    handleCloseAddPerson();
    loadMovie();
    return;
  }

  function renderAddPersonForm() {
    return (
      <Modal show={showAddPerson} onHide={handleCloseAddPerson}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPerson}>
            <Form.Row>
              <Form.Group>
                <Form.Label>Director</Form.Label>
                <Form.Control
                  id="director"
                  value={fields.director}
                  onChange={handleFieldChange}
                />
                <Form.Label>Writer</Form.Label>
                <Form.Control
                  id="writer"
                  value={fields.writer}
                  onChange={handleFieldChange}
                />
                <Form.Label>Actors</Form.Label>
                <Form.Control
                  id="actors"
                  value={fields.actors}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>
            <LoadingButton
              type="submit"
              // isLoading={isLoading}
              disabled={!validateAddPersonForm()}
            >
              Submit
            </LoadingButton>
          </Form>
        </Modal.Body>
      </Modal>
    );
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
                  id="score"
                  value={fields.score}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>
            <LoadingButton
              type="submit"
              // isLoading={isLoading}
              disabled={!validateReviewForm()}
            >
              Submit
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
                  id="score"
                  value={fields.score}
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
              // isLoading={isLoading}
              disabled={!validateReviewForm()}
            >
              Submit
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

  function getDirectors() {
    return directors.map((director, index) => {
      if (directors.length === index + 1) {
        return (
          <Link key={director} to={`/name/${movie.Director[index]}`}>
            {director}
          </Link>
        );
      } else {
        return (
          <React.Fragment key={director}>
            <Link to={`/name/${movie.Director[index]}`}>{director}</Link>{" "}
            {`,\xa0`}
          </React.Fragment>
        );
      }
    });
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
    // match same score and match all genres -> removing last genre if no match
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
                <p>{`\xa0\xa0(${reviews.length} ratings)`}</p>
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
              alt={movie.Poster}
              style={{ height: "30vh" }}
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
              <Col>Director: {getDirectors()}</Col>
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
            <Row>
              <Col>
                {isContributor ? (
                  <>
                    {renderAddPersonForm()}
                    <Button
                      className="mr-1"
                      variant="outline-dark"
                      onClick={handleShowAddPerson}
                    >
                      Edit Movie
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </Col>
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
