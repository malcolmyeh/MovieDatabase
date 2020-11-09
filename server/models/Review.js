const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required:true,
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
  // { strict: false }
);

module.exports = Review = mongoose.model("reviews", ReviewSchema);
