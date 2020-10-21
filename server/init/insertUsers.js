const users = require("../data/user-data.json");
const User = require("../models/User");
const follow = require("../utils/follow");
const mongoose = require("mongoose");

// Script to populate database with users

mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

async function insertUsers() {
  console.log("Inserting users...");
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  await User.insertMany(users);
  const userDocs = await User.find();
  const userIds = userDocs.map((user) => user._id);
  for (const userId of userIds) {
    const otherIds = userIds.filter((ele) => ele != userId);
    for (const otherId of otherIds) {
      await follow.followUser(userId, otherId);
    }
  }

  console.log("Done inserting users.");
  // mongoose.disconnect();
}

// insertUsers();

module.exports = { insertUsers };
