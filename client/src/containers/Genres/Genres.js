import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var genreList = [];

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadGenres() {
    if (genreList.length === 0){
      const res = await axios(`${process.env.REACT_APP_API_URL}/api/genres`);
      genreList = res.data.genres;
    }
    setGenres(genreList);
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadGenres();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  },[]);

  function listGenres() {
    return isLoading ? (
      Loading()
    ) : (
      <FadeIn>
        <ListGroup>
          {genres.map((genre) => {
            return (
              <ListGroup.Item key={genre}>
                <Link to={`/genre/${formatLink(genre)}`}>{genre}</Link>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </FadeIn>
    );
  }
  return (
    <Container>
      <h1>Movies by Genre</h1>
      {listGenres()}
    </Container>
  );
}
