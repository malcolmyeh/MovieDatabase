import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var users = [];
var names = [];

var sampleFollowingUsers = require("./sample-following-users.json");
var sampleFollowingNames = require("./sample-following-names.json");

export default function Following(id, ownPage, type) {
  const [following, setFollowing] = useState([]);
  const [numFollowing, setNumFollowing] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  async function loadFollowing() {
    setIsLoading(true);
    const res = await axios(`http://localhost:5000/api/users/${id}`);
    const userIds = res.data.followingUsers;
    const nameIds = res.data.followingPeople;
    if (type === "user") {
      users = [];
      for (const userId of userIds) {
        const user = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        users.push({username: user.data.username, id: userId});
      }
      setFollowing(users);
    } else if (type === "name") {
      names = [];
      for (const nameId of nameIds) {
        const person = await axios.get(
          `http://localhost:5000/api/people/${nameId}`
        );
        names.push({name: person.data.name, id: nameId});
      }
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
  }, [id]); // todo: specify functions that will trigger this

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
      ////////////////////////////////////////////////////////////////
      function unfollowName(name) {
        var arr = sampleFollowingNames.names;
        var index = arr.indexOf(name);
        if (index > -1) {
          arr.splice(index, 1);
        }
        sampleFollowingNames.names = arr;
      }
      ////////////////////////////////////////////////////////////////
      function unfollowUser(user) {
        var arr = sampleFollowingUsers.users;
        var index = arr.indexOf(user);
        if (index > -1) {
          arr.splice(index, 1);
        }
        sampleFollowingUsers.users = arr;
      }
      ////////////////////////////////////////////////////////////////
      if (type === "user") unfollowUser(event.target.id);
      else if (type === "name") unfollowName(event.target.id);
      loadFollowing();
    } catch (e) {
      console.log(e);
    }
  }

  function displayFollowing(user) {
    return (
      <div key={user.id} style={{ display: "flex", height: "auto" }}>
        {type === "user" ? (
          <Link to={`${formatLink(`/profile/${user.id}`)}`}>{user.username}</Link>
        ) : (
          <Link to={`${formatLink(`/name/${user.id}`)}`}>{user.name}</Link>
        )}

        {ownPage ? (
          <Link
            to="/#"
            id={user}
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
