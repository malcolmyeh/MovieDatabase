import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Carousel, Jumbotron } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import Trailer from "../../components/Trailer/Trailer";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";
import { useAppContext } from "../../libs/context";

axios.defaults.withCredentials = true;

var movieList = [];

function getWidth() {
  const { innerWidth: width } = window;
  if (width > 850) return "visible";
  else return "hidden";
}

export default function Home() {
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(getWidth());

  const { isAuthenticated, userId } = useAppContext();
  // console.log("userId:", userId);
  async function loadFeatured() {
    setIsLoadingRecommended(true);
    setIsLoadingTrailer(true);
    var endpoint;
    if (isAuthenticated && userId) endpoint = `/api/recommended?user=${userId}`;
    else endpoint = `/api/featuredmovies`;
    try {
      const res = await axios(`${process.env.REACT_APP_API_URL}${endpoint}`);
      movieList = res.data;
      // console.log("movieList:", movieList);
      setFeaturedMovies(movieList);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoadingRecommended(false);
    try {
      for await (var movie of movieList) {
        const query =
          movie.Title.replace(/\s+/g, "+").toLowerCase() +
          "+" +
          movie.Year.replace("–", "") +
          "+trailer";
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/trailer/${query}`
        );
        // console.log(res.data);
        movie.videoSrc = res.data;
      }
      // console.log("movieList:", movieList);
      setFeaturedMovies(movieList);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoadingTrailer(false);
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
    if (iframes[prev]) {
      const src = iframes[prev].src;
      iframes[prev].src = src;
    }
  }

  useEffect(() => {
    async function onLoad() {
      loadFeatured();
    }
    onLoad();

    function handleResize() {
      setShowTrailer(getWidth());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);
  // console.log("featured Movies:", featuredMovies);
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
                  <Col md="auto" style={{ maxWidth: "300px", padding: "0" }}>
                    <img src={movie.Poster} alt="Poster" />
                  </Col>
                  {showTrailer === "visible" ? (
                    <Col style={{ padding: "0", visibility: showTrailer }}>
                      {isLoadingTrailer
                        ? Loading("trailer")
                        : Trailer(movie.videoSrc)}
                    </Col>
                  ) : (
                    <></>
                  )}
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
    </Container>
  );
}
