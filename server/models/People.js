const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required. "],
    unique: [true, "Name already taken. "],
  },
  movies: {
    type: Array,
    default: [],
  },
  frequentCollaborators: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
});

module.exports = People = mongoose.model("people", PeopleSchema);
