const users = require("../data/user-data.json");
const User = require("../models/User");
const follow = require("../utils/follow");
const mongoose = require("mongoose");

// Script to populate database with users

mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });

async function run() {
  var db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error: "));

  await db.once("open", async function () {
    // insert users
    await User.insertMany(users, async function (error, docs) {
      if (error) console.log(error);
      var userIds = [];
      docs.forEach((doc) => {
        console.log(doc._id);
        userIds.push(doc._id);
      });

      // set users to follow each other
      const doFollowUsers = userIds.map(async userId => {
        console.log("user: ", userId);
        const otherIds = userIds.filter(ele => ele!=userId);
        return Promise.all(
          otherIds.map(async otherId => {
            console.log("following: ", otherId);
            return await follow.followUser(userId, otherId);
          })
        )
      })

      await Promise.all(doFollowUsers);
      // set user to follow people

      // todo: set movies watched
      console.log("disconnecting");
      mongoose.disconnect();
    });
  });
}

run();
