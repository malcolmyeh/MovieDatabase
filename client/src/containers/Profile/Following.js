import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";
axios.defaults.withCredentials = true;

var users = [];
var names = [];

export default function Following(id, ownPage, type) {
  const [following, setFollowing] = useState([]);
  const [numFollowing, setNumFollowing] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  async function loadFollowing() {
    setIsLoading(true);
    const res = await axios(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
    const userIds = res.data.user.followingUsers;
    const nameIds = res.data.user.followingPeople;
    if (type === "user") {
      users = [];
      for (const userId of userIds) {
        const user = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`
        );
        users.push({username: user.data.user.username, id: userId});
      }
      setFollowing(users);
    } else if (type === "name") {
      names = [];
      for (const nameId of nameIds) {
        const person = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/people/${nameId}`
        );
        names.push({name: person.data.person.name, id: nameId});
      }
      console.log(names);
      setFollowing(names);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadFollowing(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUnfollow(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      // todo: turn into modal
      "Unfollow?"
    );
    if (!confirmed) {
      return;
    }
    try {
      async function unfollowName(name) {
        console.log("name: ", name);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/unfollowperson/${name}`);
          console.log(res);
        } catch (e){
          console.log(e);
        }
      }
      async function unfollowUser(user) {
        console.log("user: ", user);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/unfollowuser/${user}`);
          console.log(res);
        } catch (e){
          console.log(e);
        }
      }
      if (type === "user") await unfollowUser(event.target.id);
      else if (type === "name") await unfollowName(event.target.id);
      loadFollowing();
    } catch (e) {
      console.log(e);
    }
  }

  function displayFollowing(user) {
    return (
      <div key={user.id} style={{ display: "flex", height: "auto" }}>
        {type === "user" ? (
          <Link to={`/profile/${user.id}`}>{user.username}</Link>
        ) : (
          <Link to={`/name/${user.id}`}>{user.name}</Link>
        )}

        {ownPage ? (
          <Link
            to="/#"
            id={user.id}
            type="submit"
            onClick={handleUnfollow}
            style={{
              marginLeft: "auto",
              textDecoration: "none",
              color: "black",
            }}
          >
            ✕
          </Link>
        ) : (
          <></>
        )}
      </div>
    );
  }
  return isLoading ? (
    Loading("following")
  ) : (
    <FadeIn>
      <Row>
        <Col>
          <h3>{`Following ${type.charAt(0).toUpperCase() + type.slice(1)}s (${
            following.length
          })`}</h3>
          {following.slice(0, numFollowing).map((user) => {
            return displayFollowing(user);
          })}
          {numFollowing !== following.length ? (
            <p
              type="submit"
              onClick={() => {
                setNumFollowing(following.length);
              }}
              style={{ textDecoration: "underline" }}
            >
              See all
            </p>
          ) : (
            <p
              type="submit"
              onClick={() => {
                setNumFollowing(5);
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
