import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../libs/context";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Reviews from "./Reviews";
import MoviesWatched from "./MoviesWatched";
import Followers from "./Followers";
import Following from "./Following";

/*
SELF
    profile photo?
    user tiers?
    date registered?
    list of people they follow (and a way to unfollow)
    list of users they follow (and a way to unfollow)
    list of followers?
    Switch account type (regular/contributor)
    Movies recommendation
    Movies watched
    search bar? or put it somewhere else
OTHER
    Option to follow
    List of their reviews that they have made
    List of people they follow
*/


/*
    If profile is of user, allow:
        1. Remove review
        2. unfollow from list of followed users
        3. unfollow from list of followed names
        4. switch account type 
    If profile is of someone else,  allow:
        1. follow/unfollow from button
*/



export default function Profile() {

    const { username } = useAppContext();
    const { id } = useParams();

    var ownPage;
    if (id === username) {
        ownPage = true;
    } else {
        ownPage = false;
    }


    function renderUserInfo() {
        return (
            <Row>
                <Col sm={3}>
                    <img alt="user" style={{ "height": "15vh" }} src="https://www.peerq.com/profilepics/default-profile.png" />
                </Col>
                <Col sm={8}>
                    <h1>{id}</h1>
                    <p>Movie Database member since September 2020</p>
                    {!ownPage ?
                        <LoadingButton>Follow</LoadingButton>
                        : <></>}
                </Col>
            </Row>
        )
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
            <br /><br />
        </Container>
    )
}