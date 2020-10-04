import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { delay } from "../../libs/otherutils";
import FadeIn from "../../components/Fade/Fade";

var sampleFollowers = require("./sample-followers.json");

export default function Followers(id) {
  const [followers, setFollowers] = useState([]);
  const [numFollowers, setNumFollowers] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  async function loadFollowers(id) {
    setIsLoading(true);
    console.log("Loading followers for ", id);
    await delay();
    setFollowers(sampleFollowers.data.users);
    setIsLoading(false);
  }
  useEffect(() => {
    async function onLoad() {
      try {
        loadFollowers(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);
  return isLoading ? (
    Loading("followers")
  ) : (
    <FadeIn>
      <Row>
        <Col>
          <h3>{`Followers (${followers.length})`}</h3>
          {followers.slice(0, numFollowers).map((user) => {
            return (
              <div key={user}>
                <Link
                  to={`${formatLink(`/profile/${user}`)}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {user}
                </Link>
              </div>
            );
          })}
          {numFollowers !== followers.length ? (
            <p
              type="submit"
              onClick={() => {
                setNumFollowers(followers.length);
              }}
              style={{ textDecoration: "underline" }}
            >
              See all
            </p>
          ) : (
            <p
              type="submit"
              onClick={() => {
                setNumFollowers(5);
              }}
              style={{ textDecoration: "underline" }}
            >
              See less
            </p>
          )}
        </Col>
      </Row>
    </FadeIn>
  );
}
