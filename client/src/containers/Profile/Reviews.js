import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";

var sampleReviews = require("./sample-reviews.json");

export default function Reviews(ownPage, id) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numReviews, setNumReviews] = useState(3);
  const [reviews, setReviews] = useState([{}]);

  async function loadReviews() {
    setIsLoading(true);
    const res = await axios(`${process.env.REACT_APP_API_URL}/api/reviews?userId=${id}`);
    const reviews = res.data;
    console.log("reviews:", reviews)
    setReviews(reviews);
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        loadReviews();
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id]);

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      // todo: turn into modal
      "Delete this review?"
    );
    if (!confirmed) {
      return;
    }
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
        var index = findIndexFromAttr(arr, "title", title);
        if (index > -1) {
          arr.splice(index, 1);
        }
        sampleReviews.reviews = arr;
      }
      deleteReview(event.target.id);
      ////////////////////////////////////////////////////////////////
      await loadReviews(id);
      setIsDeleting(false);
    } catch (e) {
      console.log(e);
      setIsDeleting(false);
    }
  }
  function renderReviews() {
    function displayReview(review) {
      return review.title !== "" && review.body !== "" ? (
        <div key={review.movie + review.title}>
          <div style={{ display: "flex" }}>
            <h4>{`${review.movieTitle}\xa0|\xa0${review.title}`}</h4>
            {ownPage ? (
              <LoadingButton
                variant="outline-dark"
                id={review.title}
                type="submit"
                onClick={handleDelete}
                isLoading={isDeleting}
                style={{ marginLeft: "auto" }}
              >
                delete
              </LoadingButton>
            ) : (
              <></>
            )}
          </div>
          <p>{`${review.date.slice(0, 10)}`}</p>
          <div>{review.body}</div>
        </div>
      ) : (
        <></>
      );
    }
    return isLoading ? (
      Loading("reviews")
    ) : (
      // todo: sort by date
      <FadeIn>
        <Row>
          <Col>
            <h3>Reviews</h3>
            {reviews.slice(0, numReviews).map((review) => {
              return displayReview(review);
            })}
            {numReviews !== reviews.length ? (
              <p
                type="submit"
                onClick={() => {
                  setNumReviews(reviews.length);
                }}
                style={{ textDecoration: "underline" }}
              >
                See all reviews
              </p>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </FadeIn>
    );
  }
  return renderReviews();
}
