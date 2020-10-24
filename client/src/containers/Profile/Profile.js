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
  // todo: load isFollowing

  async function upgradeAccount() {
    setIsContributor(true);
  }

  async function downgradeAccount() {
    setIsContributor(false);
  }

  async function handleFollow() {
    setIsFollowing(!isFollowing);
  }

  async function loadUsername(id){
    setIsLoading(true);
    const res = await axios(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
    console.log("res.data", res.data.username);
    setUsername(res.data.username);
    setIsLoading(false);
  }
  useEffect(() => {
    async function onLoad() {
      try {
        loadUsername(id);
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);

  function renderUserInfo() {
    return isLoading? (Loading("user")): (
      <Row>
        <Col sm={3}>
          <img
            alt="user"
            style={{ height: "15vh" }}
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
