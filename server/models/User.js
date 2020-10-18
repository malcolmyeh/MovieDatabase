const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, 'Username already taken. ']
    },
    password: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    accountType: {
      type: String,
      default: "Regular",
    },
    moviesWatched: {
      type: Array,
      default: [],
    },
    reviews: {
      type: Array,
      default: [],
    },
    followingPeople: {
      type: Array,
      default: [],
    },
    followingUsers: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
  },
  { strict: false }
);

module.exports = User = mongoose.model("users", UserSchema);
