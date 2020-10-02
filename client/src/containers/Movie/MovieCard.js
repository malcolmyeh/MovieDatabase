import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatLink } from "../../libs/linkutils";

export default function MovieCard(movie) {
    return (
        <Card as={Link} to={`/movie/${formatLink(movie.Title)}`} key={movie.Title} style={{ maxWidth: "11vw", textDecoration: 'none', color: 'black' }}>
            <Card.Header >
                <div style={{ "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" }}>
                    {`${movie.Title} (${movie.Year})`}</div>
            </Card.Header>
            <Card.Img variant="bottom" src={movie.Poster} style={{ maxHeight: "28vh" }} />
            <Card.Body>
                <div style={{ "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" }}>
                    {`${movie.Rated} | ${movie.Runtime}`}
                </div>
            </Card.Body>
        </Card >
    );
}