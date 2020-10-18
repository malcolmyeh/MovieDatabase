const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    movie: {
      // movie id
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
