const express = require("express");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const router = express.Router();

// Get all reviews for given movie
router.get("/reviews/:movie",async (req, res, next) => {
    try{
        console.log("looking for reviews for movie: ", req.params.movie);
        const reviews = await Review.find({movie: req.params.movie});
        console.log(reviews);
        res.send(reviews);
    } catch {
        res.send([]);
    }
});

// Get all reviews for given user
router.get("/reviews/:user", async (req, res, next) => {
    try {
        console.log("looking for reviews for user: ", req.params.user);
        const reviews = await Review.find({user: req.params.user});
        console.log(reviews);
        res.send(reviews);
    } catch {
        res.send([]);
    }
});

// Post new review
router.post("/reviews", async (req, res, next) => {
    try{
        const review = new Review({
            user: req.body.user,
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
        movie.rating = average;
        await movie.save();        
    } catch (e){
        console.log(e);
    }
}

module.exports = router;
