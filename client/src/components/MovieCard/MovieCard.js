import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {v1 as uuidv1} from "uuid";

export default function MovieCard(movie) {

  return (
    <Card
      as={Link}
      to={`/movie/${movie._id}`}
      key={uuidv1()}
      style={{ width: "11vw", textDecoration: "none", color: "black" }}
    >
      <Card.Img
        variant="bottom"
        src={movie.Poster}
        style={{ height: "29vh", width: "11vw" }}
      />
      <Card.Header>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${movie.Title} (${movie.Year})`}
        </div>
      </Card.Header>
    </Card>
  );
}
