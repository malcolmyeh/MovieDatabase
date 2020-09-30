import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";

// samplesGenres contains arr of unique genres
// todo: should this be hardcoded? Can we add movie with other genres?
// on server side, can get genres from every movie and return unique array
/*
function getUniqueGenres(){
    const data = movies.map((movie) => { return movie.Genre });
    var genreArr = [];
    for (const genreString of data) {
      var arr = genreString.split(", ");
      genreArr = [...arr, ...genreArr];
    }
    const uniqueGenreArr = Array.from(new Set(genreArr)).sort();
    console.log("uniqueGenreArr: ", uniqueGenreArr);
}
*/

var sampleGenres = require('./genres.json');

export default function Genres() {
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            try {
                const genres = await loadGenres(sampleGenres);
                setGenres(genres);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    });

    async function loadGenres(sampleData) {
        return sampleData.genres;
    }

    function listGenres() {
        console.log("genres: ", genres);
        return (
            <ListGroup>
                {genres.map((genre) => {
                    return(
                        <ListGroup.Item><Link to={`/genre/${formatLink(genre)}`}>{genre}</Link></ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
    return (
        <Container>
            <h1>Movies by Genre</h1>
            {!isLoading && listGenres()}
            <br/><br/>
        </Container>
    )
}