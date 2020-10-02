import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import { Link } from "react-router-dom";

var sampleFollowers = require("./sample-followers.json");

export default function Followers(id) {
    const [followers, setFollowers] = useState([]);
    const [numFollowers, setNumFollowers] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    async function loadFollowers(followers) { // takes in id
        return followers.data.users;
    }
    useEffect(() => {
        async function onLoad() {
            try {
                const followers = await loadFollowers(sampleFollowers);
                setFollowers(followers);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }); // todo: specify functions that will trigger this
    return (!isLoading &&
        <Row>
            <Col>
                <h3>{`Followers (${followers.length})`}</h3>
                {followers.slice(0, numFollowers).map((user) => {
                    return (
                        <div key={user}>
                            <Link to={`${formatLink(`/user/${user}`)}`}
                            style={{ textDecoration: 'none', color: 'black' }}>{user}</Link>
                        </div>
                    )
                })}
                {(numFollowers !== followers.length) ?
                    <p type="submit"
                        onClick={() => { setNumFollowers(followers.length) }}
                        style={{ textDecoration: "underline" }}>See all</p> :
                    <p type="submit"
                        onClick={() => { setNumFollowers(5) }}
                        style={{ textDecoration: "underline" }}>See less</p>}
            </Col>
        </Row>
    );

}