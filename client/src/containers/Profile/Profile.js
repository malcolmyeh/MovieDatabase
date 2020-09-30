import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../libs/context";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
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

const sampleFollowing = require("./sample-following-users.json");

const sampleFollowers = require("./sample-followers.json");

const sampleFollowingNames = require("./sample-following-names.json");

const sampleMoviesWatched = require("./sample-movies-watched.json");

const sampleReviews = require("./sample-reviews.json");


export default function Profile() {
    const [reviews, setReviews] = useState([]);
    const [moviesWatched, setMoviesWatched] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followingNames, setFollowingNames] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const { username } = useAppContext();
    const { id } = useParams();

    var ownPage;
    if (id === username) {
        ownPage = true;
    } else {
        ownPage = false;
    }

    async function loadMoviesWatched(moviesWatched) {
        return moviesWatched.movies;
    }

    async function loadFollowing(following) {
        return following.users;
    }

    async function loadFollowers(followers) {
        return followers.users;
    }

    async function loadFollowingNames(followingNames) {
        return followingNames.names;
    }

    async function loadReviews(reviews) {
        return reviews.reviews;
    }

    useEffect(() => {
        async function onLoad() {
            try {
                const moviesWatched = await loadMoviesWatched(sampleMoviesWatched);
                setMoviesWatched(moviesWatched);
                const following = await loadFollowing(sampleFollowing);
                setFollowing(following);
                const followers = await loadFollowers(sampleFollowers);
                setFollowers(followers);
                const followingNames = await loadFollowingNames(sampleFollowingNames);
                setFollowingNames(followingNames);
                const reviews = await loadReviews(sampleReviews);
                setReviews(reviews);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }); // todo: specify functions that will trigger this

    function renderUserInfo() {
        return (
            <Row>
                <Col sm={3}>
                    <img style={{ "height": "15vh" }} src="https://www.peerq.com/profilepics/default-profile.png" />
                </Col>
                <Col sm={8}>
                    <h1>{id}</h1>
                    <p>Movie Database member since September 2020</p>
                </Col>
            </Row>
        )
    }

    function renderMoviesWatched() {
        return (
            <>
                <Row>
                    <Col>
                        <h3>Movies Watched</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {moviesWatched.map((movie) => {
                            return <img src={movie.Poster} style={{ maxHeight: "15vh" }} />
                        })}
                    </Col>
                </Row>
            </>
        )
    }

    async function handleDelete(event) {
        event.preventDefault();
        const confirmed = window.confirm( // todo: turn into modal
            "Delete this review?"
        );
        if (!confirmed) { return; }
        setIsDeleting(true);
        try {
            //////////////////////////////// delete from sampleReviews
            function findIndexFromAttr(array, attr, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            }
            function deleteReview(title) {
                var arr = sampleReviews.reviews;
                var index = findIndexFromAttr(arr, 'title', title);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                sampleReviews.reviews = arr;
            }
            deleteReview(event.target.id);
            ////////////////////////////////////////////////////////////////
            setReviews(await loadReviews(sampleReviews));
            setIsDeleting(false);
        } catch (e) {
            console.log(e);
            setIsDeleting(false);
        }
    }
    function renderReviews() {
        return (
            // todo: read more accordion
            // todo: sort by date
            <Row>
                <Col>
                    <h3>Reviews</h3>
                    {reviews.map((review) => {
                        return (review.title !== "" && review.body !== "") ?
                            <div key={review.title}>
                                <h4>{`${review.movie}\xa0|\xa0${review.title}`}</h4>
                                <p>{`${review.date}`}</p>
                                <p>{review.body}</p>
                                {ownPage ?
                                    <LoadingButton
                                        id={review.title}
                                        type="submit"
                                        onClick={handleDelete}
                                        isLoading={isDeleting}>
                                        ✕
                                </LoadingButton> : <></>}
                            </div> : <></>
                    })}
                </Col>
            </Row>
        )
    }

    function renderFollowing() {
        return (
            <Row>
                <Col>
                <h3>Following</h3>
                </Col>
            </Row>
        );
    }

    function renderFollowers() {
        return (
            <Row>
                <h3>Followers</h3>
                <Col>
                </Col>
            </Row>
        );
    }

    function renderFollowingNames() {
        return (
            <Row>
                <Col>
                </Col>
            </Row>
        );
    }


    /*
        If profile is of user, allow:
            1. Remove review
            2. unfollow from list of followed users
            3. unfollow from list of followed names
            4. switch account type 
        If profile is of someone else,  allow:
            1. follow/unfollow from button
    */

    return (
        <Container>
            <Row>
                <Col sm={8}>
                    {renderUserInfo()}
                    {renderMoviesWatched()}
                    {renderReviews()}
                </Col>
                <Col sm={4}>
                </Col>
            </Row>
            <br /><br />
        </Container>
    )
}