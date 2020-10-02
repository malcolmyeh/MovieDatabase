import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import MovieCard from "../Movie/MovieCard"
const sampleMovieList = require("./sample-movie-list.json");

export default function Genre() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    async function loadMovies() {
        return (sampleMovieList.data.movies);
    }

    useEffect(() => {
        async function onLoad() {
            try {
                const movies = await loadMovies();
                setMovies(movies);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    })

    function renderMovies() {

        const groupArray = (group, size) => group.reduce((accumulator, current, index, original) =>
            ((index % size) === 0)
                ? accumulator.concat([original.slice(index, index + size)])
                : accumulator, []
        )
        const groupedMovieArr = groupArray(movies, 5)

        return (
            groupedMovieArr.map(movies => {
                return (
                    <div key={groupedMovieArr.indexOf(movies)}>
                        <Row>
                            {movies.map((movie) => MovieCard(movie))}
                        </Row>
                    </div>

                )
            })

        )
    }

    return (!isLoading &&
        <Container>
            <h1>{id.charAt(0).toUpperCase() + id.slice(1)}</h1>
            <h3>filter by date, rating, etc.</h3>
            {renderMovies()}
        </Container>
    )
}