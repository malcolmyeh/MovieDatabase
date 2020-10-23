const express = require("express");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const router = express.Router();

// Get all reviews for given movie
router.get("/reviews/:movie",async (req, res, next) => {
    console.log("GET reviews for movie: ", req.params.movie);
    try{
        const reviews = await Review.find({movieId: req.params.movie});
        console.log(reviews);
        res.send(reviews);
    } catch {
        res.send([]);
    }
});

// Get all reviews for given user
router.get("/reviews/:userId", async (req, res, next) => {
    console.log("GET reviews for user: ", req.params.userId);
    try {
        console.log("looking for reviews for user: ", req.params.userId);
        const reviews = await Review.find({userId: req.params.userId});
        console.log(reviews);
        res.send(reviews);
    } catch {
        res.send([]);
    }
});

// Post new review
router.post("/reviews", async (req, res, next) => {
    console.log("POST review");
    try{
        const review = new Review({
            userId: req.body.userId,
            userName: req.body.userName,
            movieId: req.body.movieId,
            movieTitle: req.body.movieTitle,
            score: req.body.score,
            title: req.body.title,
            body: req.body.body
        });
        await review.save();
        await updateRating(req.body.movie);
    } catch {
        res.status(500);
        res.send({error: "Could not post review!"});
    }
})

// Delete review by id
router.delete("/reviews/:id", async(req, res) => {
    console.log("DELETE review");
    try {
        const movieId = await Review.findOne({_id: req.params.id}).movie;
        await Review.deleteOne({_id: req.params.id});
        updateRating(movieId);
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "Review does not exist!"});
    }
} )

// updates Movie rating one review is added or deleted
async function updateRating(movieId){
    try{
        // get average rating from reviews
        const reviews = await Review.find({movie: movieId});
        var average = reviews.reduce((total, next) => total + next.score, 0)/reviews.length;
        console.log("average: ", average);
        // update rating on movie
        const movie = await Movie.findOne({_id: movieId});
        movie.Rating = average;
        await movie.save();        
    } catch (e){
        console.log(e);
    }
}

module.exports = router;
