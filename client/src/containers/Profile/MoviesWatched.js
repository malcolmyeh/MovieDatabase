import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

var sampleMoviesWatched = require("./sample-movies-watched.json");

export default function Reviews(id) {
    const [moviesWatched, setMoviesWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    async function loadMoviesWatched(moviesWatched) {
        return moviesWatched.data.movies;
    }
    useEffect(() => {
        async function onLoad() {
            try {
                const moviesWatched = await loadMoviesWatched(sampleMoviesWatched);
                setMoviesWatched(moviesWatched);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    });

    return (!isLoading &&
        <>
            <Row>
                <Col>
                    <h3>Movies Watched</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    {moviesWatched.map((movie) => {
                        return <img key={movie.Title} alt="poster" src={movie.Poster} style={{ maxHeight: "15vh" }} />
                    })}
                </Col>
            </Row>
        </>
    )

}
