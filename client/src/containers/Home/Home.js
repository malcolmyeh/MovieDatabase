import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Carousel, Jumbotron } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import Trailer from "../../components/Trailer/Trailer";
import { formatLink } from "../../libs/linkutils";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var movieList = [];

export default function Home() {
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);

  async function loadFeatured() {
    if (movieList.length === 0) {
      setIsLoadingRecommended(true);
      const res = await axios("http://localhost:5000/api/featuredmovies");
      movieList = res.data;
    }
    console.log("movieList: ", movieList);
    setFeaturedMovies(movieList);
    setIsLoadingRecommended(false);
  }

  // Stopping trailer by forcing reload
  function stopVideos(eventkey, direction) {
    var prev;
    if (direction === "left") {
      prev = eventkey - 1;
      if (prev < 0) prev = 0;
    } else {
      prev = eventkey + 1;
      if (prev > 5) prev = 5;
    }
    var iframes = document.querySelectorAll("iframe");

    const src = iframes[prev].src;
    iframes[prev].src = src;
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadFeatured();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, []);

  return (
    <Container>
      <Jumbotron style={{ marginTop: "15px" }}></Jumbotron>
      {isLoadingRecommended ? (
        Loading()
      ) : (
        <FadeIn>
          <h3>Recommended</h3>
          <Carousel
            className="z-depth-1"
            interval={null}
            onSlid={stopVideos}
            wrap={false}
          >
            {featuredMovies.map((movie) => (
              <Carousel.Item
                key={movie.Title}
                style={{ top: "0", bottom: "auto" }}
              >
                <Row style={{ maxHeight: "440px" }}>
                  <Col md="auto" style={{ padding: "0" }}>
                    <img src={movie.Poster} alt="Poster" />
                  </Col>
                  <Col style={{ padding: "0" }}>{Trailer(movie)}</Col>
                </Row>
                <Carousel.Caption
                  as={Link}
                  style={{
                    left: "0",
                    top: "auto",
                    bottom: "0",
                    width: "100%",
                    textDecoration: "none",
                    backgroundImage: `-webkit-gradient(
                  linear, left bottom, left top, from(rgba(0,0,0,1)),
                  to(rgba(0,0,0,0.01)), color-stop(.3,#000000)
                )`,
                  }}
                  to={`/movie/${movie.id}`}
                >
                  <h1>{`${movie.Title} (${movie.Year})`}</h1>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </FadeIn>
      )}
      <h3>Feed (not yet implemented)</h3>
      <p>Followed name in Movie at xx/yy/zzzz</p>
      <p>Followed user posted Review at xx/yy/zzzz</p>
    </Container>
  );
}
