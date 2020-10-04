import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const axios = require("axios");

// google api key
// AIzaSyCiA1HcKnNmWULGUBmIOJN1JEuvplOLKaM

export default function Home() {

  async function getBackground(){
    
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&toy+story+1995+trailer&key=AIzaSyCiA1HcKnNmWULGUBmIOJN1JEuvplOLKaM`)
        .then(function (response) {
            // handle success
            console.log(response)
        })
  }

  useEffect(() => {
    async function onLoad() {
      try {
        getBackground();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, []);

  return (
    <Container>
      <Link to="/movie/toy-story">
        <h3>Sample Movie Page</h3>
      </Link>
      <Link to="/profile/someone">
        <h3>Sample Other User Page</h3>
      </Link>
      <Link to="/name/test">
        <h3>Sample Name Page</h3>
      </Link>
      <h3>- most recent movies</h3>
      <h3>- most popular (by # of imbd votes)</h3>
      <h3>- recent reviews (user review from this site)</h3>
      <h3>- feed (followed person new movie, followed user review)</h3>
    </Container>
  );
}
