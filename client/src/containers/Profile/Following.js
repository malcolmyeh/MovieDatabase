import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import { Link } from "react-router-dom";

var sampleFollowingUsers = require("./sample-following-users.json");
var sampleFollowingNames = require("./sample-following-names.json");

export default function Following(id, ownPage, type) {
    const [following, setFollowing] = useState([]);
    const [numFollowing, setNumFollowing] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    async function loadFollowing() { // takes in id and type
        if (type === "user")
            return sampleFollowingUsers.data.users;
        else if (type === "name")
            return sampleFollowingNames.data.names;
    }

    useEffect(() => {
        async function onLoad() {
            try {
                const following = await loadFollowing();
                setFollowing(following);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }); // todo: specify functions that will trigger this

    async function handleUnfollow(event) {
        event.preventDefault();
        const confirmed = window.confirm( // todo: turn into modal
            "Unfollow?"
        );
        if (!confirmed) { return; }
        setIsDeleting(true);
        try {
            ////////////////////////////////////////////////////////////////
            function unfollowName(name) {
                var arr = sampleFollowingNames.data.names;
                var index = arr.indexOf(name);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                sampleFollowingNames.data.names = arr;
            }
            ////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////
            function unfollowUser(user) {
                var arr = sampleFollowingUsers.data.users;
                var index = arr.indexOf(user);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                sampleFollowingUsers.data.users = arr;
            }
            ////////////////////////////////////////////////////////////////
            if (type === "user")
                unfollowUser(event.target.id);
            else if (type === "name")
                unfollowName(event.target.id);
            setFollowing(await loadFollowing());
            setIsDeleting(false);
        } catch (e) {
            console.log(e);
            setIsDeleting(false);
        }
    }

    function displayFollowing(user) {
        return (
            <div key={user} style={{ display: "flex", height: "auto" }}>
                {(type==="user")?            
                    <Link to={`${formatLink(`/user/${user}`)}`}
                    style={{ textDecoration: 'none', color: 'black' }}>{user}</Link>:                <Link to={`${formatLink(`/name/${user}`)}`}
                    style={{ textDecoration: 'none', color: 'black' }}>{user}</Link>}

                {ownPage ?
                    <Link
                        to="/#"
                        id={user}
                        type="submit"
                        onClick={handleUnfollow}
                        style={{ "marginLeft": "auto", textDecoration: 'none', color: 'black' }}
                    >
                        ✕
                </Link> : <></>}
            </div>
        )
    }
    return (!isLoading &&
        <Row>
            <Col>
                <h3>{`Following ${type.charAt(0).toUpperCase() + type.slice(1)}s (${following.length})`}</h3>
                {following.slice(0, numFollowing).map((user) => {
                    return displayFollowing(user);
                })}
                {(numFollowing !== following.length) ?
                    <p type="submit"
                        onClick={() => { setNumFollowing(following.length) }}
                        style={{ textDecoration: "underline" }}>See all</p> :
                    <p type="submit"
                        onClick={() => { setNumFollowing(5) }}
                        style={{ textDecoration: "underline" }}>See less</p>}
            </Col>
        </Row >
    );

}