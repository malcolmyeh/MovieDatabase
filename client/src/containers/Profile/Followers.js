import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var users = [];

export default function Followers(id) {
  const [followers, setFollowers] = useState([]);
  const [numFollowers, setNumFollowers] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  async function loadFollowers(id) {
    setIsLoading(true);

    const res = await axios(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
    const userIds = res.data.followers;
    users = [];
    for (const userId of userIds) {
      const user = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`
      );
      users.push({username: user.data.username, id: userId});
    }
    setFollowers(users);

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
              <div key={user.id}>
                <Link
                  to={`/profile/${user.id}`}
                >
                  {user.username}
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
