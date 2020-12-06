import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Loading from "../../components/Loading/Loading";
import FadeIn from "../../components/Fade/Fade";
import axios from "axios";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function Reviews(ownPage, id) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numReviews, setNumReviews] = useState(3);
  const [reviews, setReviews] = useState([{}]);

  async function loadReviews() {
    // console.log("loadReviews");
    setIsLoading(true);
    try {
      const res = await axios(
        `${process.env.REACT_APP_API_URL}/api/reviews?userId=${id}`
      );
      const reviews = res.data;
      // console.log("reviews:", reviews);
      setReviews(reviews);
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      loadReviews();
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Delete this review?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/reviews/${event.target.id}`
      );
      console.log(res);
      loadReviews(id);
    } catch (e) {
      console.log(e);
    }
    setIsDeleting(false);
  }
  function renderReviews() {
    function displayReview(review) {
      return review.title !== "" && review.body !== "" ? (
        <div key={review.movie + review.title}>
          <div style={{ display: "flex" }}>
            <h4>{`${review.score}/10\xa0\xa0${review.title}`}</h4>
            {ownPage ? (
              <LoadingButton
                variant="outline-dark"
                id={review._id}
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
          <p>{`${review.date.slice(0, 10)}\xa0|\xa0`}
          <Link to={`/movie/${review.movieId}`}>{review.movieTitle}</Link></p>
          <div>{review.body}</div>
        </div>
      ) : (
        <></>
      );
    }
    return isLoading ? (
      Loading("reviews")
    ) : (
      <FadeIn>
        <Row>
          <Col>
            <h3>Reviews</h3>
            {reviews.slice(0, numReviews).map((review) => {
              return displayReview(review);
            })}
            {numReviews !== reviews.length && reviews.length > numReviews ? (
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
