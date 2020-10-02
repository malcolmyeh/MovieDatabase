import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

var sampleReviews = require("./sample-reviews.json");

export default function Reviews(ownPage, id) {
    const [reviews, setReviews] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [numReviews, setNumReviews] = useState(3);

    async function loadReviews(reviews) {
        return reviews.data.reviews;
    }
    useEffect(() => {
        async function onLoad() {
            try {
                const reviews = await loadReviews(sampleReviews);
                setReviews(reviews);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }); // todo: specify functions that will trigger this
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
                var arr = sampleReviews.data.reviews;
                var index = findIndexFromAttr(arr, 'title', title);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                sampleReviews.data.reviews = arr;
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
        function displayReview(review) {
            return (review.title !== "" && review.body !== "") ?
                <div key={review.movie + review.title}>
                    <div style={{ display: "flex" }}>
                        <h4>{`${review.movie}\xa0|\xa0${review.title}`}</h4>
                        {ownPage ?
                            <LoadingButton
                                variant="outline-dark"
                                id={review.title}
                                type="submit"
                                onClick={handleDelete}
                                isLoading={isDeleting}
                                style={{ "marginLeft": "auto" }}>
                                delete
                </LoadingButton> : <></>}
                    </div>
                    <p>{`${review.date}`}</p>
                    <p>{review.body}</p>
                </div> : <></>
        }
        return (!isLoading &&
            // todo: sort by date
            <Row>
                <Col>
                    <h3>Reviews</h3>
                    {reviews.slice(0, numReviews).map((review) => {
                        return displayReview(review);
                    })}
                    {(numReviews !== reviews.length) ? <p type="submit"
                        onClick={() => { setNumReviews(reviews.length) }}
                        style={{ textDecoration: "underline" }}>See all reviews</p> : <></>}
                </Col>
            </Row>
        )
    }
    return renderReviews();
}