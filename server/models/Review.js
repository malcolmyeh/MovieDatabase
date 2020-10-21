const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
    },
    movieId: {
      type: ObjectId,
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

module.exports = Review = mongoose.model("reviews", ReviewSchema);
