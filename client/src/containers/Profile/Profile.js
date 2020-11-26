import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../libs/context";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Reviews from "./Reviews";
import MoviesWatched from "./MoviesWatched";
import Followers from "./Followers";
import Following from "./Following";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
axios.defaults.withCredentials = true;

export default function Profile() {
  const { userId, isContributor, setIsContributor } = useAppContext();
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  var ownPage;
  if (id === userId) {
    ownPage = true;
  } else {
    ownPage = false;
  }

  async function upgradeAccount() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/contributor`
      );
      console.log(res);
      setIsContributor(true);
    } catch (e) {
      console.log(e);
    }
  }

  async function downgradeAccount() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/regular`
      );
      console.log(res);
      setIsContributor(false);
    } catch (e) {
      console.log(e);
    }
    setIsContributor(false);
  }

  async function handleFollow() {
    if (!isFollowing) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/followuser/${id}`
        );
        console.log(res);
        setIsFollowing(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/unfollowuser/${id}`
        );
        console.log(res);
        setIsFollowing(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function loadUsername(id) {
    setIsLoading(true);
    try {
      const res = await axios(
        `${process.env.REACT_APP_API_URL}/api/users/${id}`
      );
      console.log("res.data", res.data);
      setUsername(res.data.user.username);
      setIsFollowing(res.data.isFollowing);
      if (res.data.user.accountType === "Contributor") setIsContributor(true);
      else setIsContributor(false);
      console.log("res.data.isFollowing:", res.data.isFollowing);
      console.log("isFollowing:", isFollowing);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      loadUsername(id);
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function renderUserInfo() {
    return isLoading ? (
      Loading("user")
    ) : (
      <Row>
        <Col sm={4.5}>
          <img
            alt="user"
            style={{ height: "150px" }}
            src="https://www.peerq.com/profilepics/default-profile.png"
          />
        </Col>
        <Col sm={8}>
          <h1>{username}</h1>
          {!ownPage ? (
            isFollowing ? (
              <LoadingButton onClick={handleFollow} variant="outline-danger">
                Unfollow
              </LoadingButton>
            ) : (
              <LoadingButton onClick={handleFollow} variant="outline-primary">
                Follow
              </LoadingButton>
            )
          ) : (
            <>
              {isContributor ? (
                <LoadingButton
                  variant="outline-primary"
                  onClick={downgradeAccount}
                >
                  Become Regular User
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant="outline-primary"
                  onClick={upgradeAccount}
                >
                  Become Contributing User
                </LoadingButton>
              )}
            </>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <Container>
      <Row>
        <Col sm={8}>
          {renderUserInfo()}
          {MoviesWatched(id)}
          {Reviews(ownPage, id)}
        </Col>
        <Col sm={4}>
          {Following(id, ownPage, "user")}
          {Following(id, ownPage, "name")}
          {Followers(id)}
        </Col>
      </Row>
    </Container>
  );
}
