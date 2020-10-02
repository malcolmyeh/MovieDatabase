import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import MovieCard from "../Movie/MovieCard";

const sampleMovieList = require("./sample-movie-list.json");

export default function Search() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // const queryString = (new URLSearchParams(useLocation().search).get("q"));
    let location = useLocation();
    let queryString = new URLSearchParams(location.search).get("q");
    async function loadMovies() {
        console.log("loading movies from query: ", queryString);
        // return sampleMovieList.data.movies;
        console.log(sampleMovieList.data.movies.filter(movie => movie.Title.toLowerCase().includes(queryString)).length, " movies found.");
        return sampleMovieList.data.movies.filter(movie => {
            return movie.Title.toLowerCase().includes(queryString)||movie.Year.includes(queryString)});
    }

    useEffect(() => {
        async function onLoad() {
            console.log("onLoad()");
            try {
                console.log("queryString: ", queryString);
                const movies = await loadMovies();
                setMovies(movies);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [location])

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
            <h1>Search: {queryString.replace(/-/g, ' ')}</h1>
            <h3>filter by date, rating, etc.</h3>
            {renderMovies()}
        </Container>
    )
}