import React, { useState } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useFields } from "../../libs/hooks";

export default function Movie() { // todo: accept movie obj as prop
    const [isLoading, setIsLoading] = useState(false);

    // Review Modals state
    const [showFullReview, setShowFullReview] = useState(false);
    const [showBasicReview, setShowBasicReview] = useState(false);
    const handleCloseFull = () => {
        setShowFullReview(false);
        resetReview()
    };
    const handleCloseBasic = () => {
        setShowBasicReview(false);
        resetReview();
    }
    const handleShowFull = () => setShowFullReview(true);
    const handleShowBasic = () => setShowBasicReview(true);
    function resetReview(){
        fields.title = "";
        fields.rating = "";
        fields.body = "";
    }

    // Review form fields
    var [fields, handleFieldChange] = useFields({
        title: "",
        rating: "",
        body: ""
    });

    const sampleMovie = {
        "Title": "Toy Story",
        "Year": "1995",
        "Rated": "G",
        "Released": "22 Nov 1995",
        "Runtime": "81 min",
        "Genre": "Animation, Adventure, Comedy, Family, Fantasy",
        "Director": "John Lasseter",
        "Writer": "John Lasseter (original story by), Pete Docter (original story by), Andrew Stanton (original story by), Joe Ranft (original story by), Joss Whedon (screenplay by), Andrew Stanton (screenplay by), Joel Cohen (screenplay by), Alec Sokolow (screenplay by)",
        "Actors": "Tom Hanks, Tim Allen, Don Rickles, Jim Varney",
        "Plot": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "Language": "English",
        "Country": "USA",
        "Awards": "Nominated for 3 Oscars. Another 27 wins & 20 nominations.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
        "Ratings": [
            {
                "Source": "Internet Movie Database",
                "Value": "8.3/10"
            },
            {
                "Source": "Rotten Tomatoes",
                "Value": "100%"
            },
            {
                "Source": "Metacritic",
                "Value": "95/100"
            }
        ],
        "Metascore": "95",
        "imdbRating": "8.3",
        "imdbVotes": "864,385",
        "imdbID": "tt0114709",
        "Type": "movie",
        "DVD": "20 Mar 2001",
        "BoxOffice": "N/A",
        "Production": "Buena Vista",
        "Website": "N/A",
        "Response": "True"
    }

    var sampleReviews = [
        {
            rating: 1,
            date: "1/3/2020",
            user: "Bob Jones",
            title: "Terrible Movie!",
            body: "Why do the toys talk? This movie not realistic at all! would give this a 0/10 if I could. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            rating: 9,
            date: "1/2/2020",
            user: "Job Bones",
            title: "Amazing Movie!",
            body: "The toys talk! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            rating: 10,
            date: "1/1/2020",
            user: "ZZZ XXX",
            title: "Lorem ipsum",
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ]

    function getReviews() {
        return (
            // sort by date
            sampleReviews.map((review) => {
                return <div key={review.user + review.title}>
                    <h5>{`${review.rating}/10\xa0\xa0${review.title}`}</h5>
                    <p>{`${review.date}\xa0|\xa0${review.user}`}</p>
                    <p>{review.body}</p>
                </div>
            })
        )
    }

    function getAverageRating() {
        return (Math.round((sampleReviews.reduce((total, next) => total + next.rating, 0) / sampleReviews.length) * 10) / 10).toFixed(1);
    }

    // todo: maybe use youtube api to get trailer
    // play the first video result from sampleMovie.Title + " trailer"

    function removeBracket(str) {
        return str.replace(/ *\([^)]*\) */g, "");
    }

    function formatLink(url) {
        return removeBracket(url).replace(/\s+/g, '-').toLowerCase();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        return;
    }

    function validateForm() {
        return Number(fields.rating) > 0 && Number(fields.rating <= 10);
    }
    function renderBasicReviewForm() {
        return (
            <Modal show={showBasicReview} onHide={handleCloseBasic}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate {sampleMovie.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Col sm={2}>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    id="rating"
                                    value={fields.rating}
                                    onChange={handleFieldChange}
                                />
                            </Col>
                        </Form.Row>
                        <LoadingButton
                            type="submit"
                            isLoading={isLoading}
                            disabled={!validateForm()}
                        > Submit </LoadingButton>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    function renderFullReviewForm() {
        return (
            <Modal show={showFullReview} onHide={handleCloseFull}>
                <Modal.Header closeButton>
                    <Modal.Title>Review {sampleMovie.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Col sm={2}>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    id="rating"
                                    value={fields.rating}
                                    onChange={handleFieldChange}
                                />
                            </Col>
                            <Col sm={10}>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    id="title"
                                    value={fields.title}
                                    onChange={handleFieldChange}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                            id="body"
                            value={fields.body}
                            as="textarea"
                            onChange={handleFieldChange}
                        />
                        <LoadingButton
                            type="submit"
                            isLoading={isLoading}
                            disabled={!validateForm()}
                        > Submit </LoadingButton>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    // returns list of string with link (for genre, writers, actors, etc.)
    function getList(property) {
        var arr = sampleMovie[`${property}`].split(", ");
        return (
            <div style={{ "display": "flex" }}>
                {arr.map((ele, i) => {
                    if (arr.length === i + 1) {
                        return <Link to={`${formatLink(`/${(property === 'Writer' || property === 'Actor') ? `name` : property}/${formatLink(ele)}`)}`}
                            style={{ textDecoration: 'none', color: 'black' }} key={ele}>{removeBracket(ele)}</Link>
                    } else {
                        return <Link to={`${formatLink(`/${(property === 'Writer' || property === 'Actor') ? `name` : property}/${formatLink(ele)}`)}`}
                            style={{ textDecoration: 'none', color: 'black' }} key={ele}>{`${removeBracket(ele)},\xa0`}</Link>
                    }
                })}
            </div>
        )
    }

    function getDirector() {
        return (
            <Link to={`/name/${formatLink(sampleMovie.Director)}`} style={{ textDecoration: 'none', color: 'black' }}>{sampleMovie.Director}</Link>
        )
    }

    function getMoreLike() {
        // todo:
        // 3 or 6 recommended movies
        // search with title (sequels/prequels)
        // match same rating and match all genres -> removing last genre if no match
        // figure out padding between img (flexbox)
        return (
            <div style={{ "display": "flex" }}>
                <img src={"https://m.media-amazon.com/images/M/MV5BMmFkY2IxNTAtMWRiNS00MWU2LWI1NDYtY2YxYTQyYTk5OTBhXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
                <img src={"https://m.media-amazon.com/images/M/MV5BYzcyMDY2YWQtYWJhYy00OGQ2LTk4NzktYWJkNDYwZWJmY2RjXkEyXkFqcGdeQXVyMTA0MjU0Ng@@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
                <img src={"https://m.media-amazon.com/images/M/MV5BOTEyNzg5NjYtNDU4OS00MWYxLWJhMTItYWU4NTkyNDBmM2Y0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
                <img src={"https://m.media-amazon.com/images/M/MV5BMDJjNWE5MTEtMDk2Mi00ZjczLWIwYjAtNzM2ZTdhNzcwOGZjXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
                <img src={"https://m.media-amazon.com/images/M/MV5BYjQ5ZjQ0YzQtOGY3My00MWVhLTgzNWItOTYwMTE5N2ZiMDUyXkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
                <img src={"https://m.media-amazon.com/images/M/MV5BN2NjYWE5NjMtODlmZC00MjJhLWFkZTktYTJlZTI4YjVkMGNmXkEyXkFqcGdeQXVyNDc2NjEyMw@@._V1_SX300.jpg"} alt="Poster" style={{ maxHeight: "15vh" }} />
            </div>
        )
    }

    return (
        <Container>
            <Row className='mt-5'>
                <Col sm={1}>
                    <h1>+</h1>
                </Col>
                <Col sm={8}>
                    <h1>{sampleMovie.Title} ({sampleMovie.Year})</h1>
                    <Row>
                        <Col style={{ "display": "flex" }}>
                            {sampleMovie.Rated}{`\xa0\xa0\xa0|\xa0\xa0\xa0`}{sampleMovie.Runtime}
                            {`\xa0\xa0\xa0|\xa0\xa0\xa0`}{getList('Genre')}{`\xa0\xa0\xa0|\xa0\xa0\xa0`}
                            {sampleMovie.Released}
                        </Col>
                    </Row>
                </Col>
                <Col sm={3}>
                    <h1>★{getAverageRating()}</h1>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col sm={5}>
                    <img src={sampleMovie.Poster} alt="Poster" style={{ maxHeight: "30vh" }} />
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <Row><Col>{sampleMovie.Plot}</Col></Row>
                    <Row><Col>Director: {getDirector()}</Col></Row>
                    <Row><Col style={{ "display": "flex" }}>{`Writers:\xa0`}{getList('Writer')}</Col></Row>
                    <Row><Col style={{ "display": "flex" }}>{`Actors:\xa0`}{getList('Actors')}</Col></Row>
                    <Row><Col>{`Metascore:\xa0`}{sampleMovie.Metascore}{`\xa0IMDB Rating:\xa0`}{sampleMovie.imdbRating}</Col></Row>
                    <Row><Col>{sampleMovie.Awards}</Col></Row>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col><h2>More Like This</h2>
                    {getMoreLike()}
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <h2>User Reviews</h2>
                    {getReviews()}
                    {true ? <>{renderFullReviewForm()}
                    {renderBasicReviewForm()}
                    <Button variant="primary" onClick={handleShowFull}>
                        Review this title
                    </Button>
                    <Button variant="primary" onClick={handleShowBasic}>
                        Rate this title
                    </Button></> : <></>}
                    
                </Col>
            </Row>
        </Container>
    )
}

