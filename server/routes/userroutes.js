const express = require("express");
const router = express.Router();
const User = require("../models/User");
const follow = require("../utils/follow");

router.get("/users/:user", async (req, res, next) => {
  // console.log("GET user: ", req.params.user);
  try {
    const user = await User.findOne({ _id: req.params.user });
    var isFollowing = false;
    if (req.session.loggedIn) {
      // console.log("user:", req.params.user ,"logged in:", req.user.id);
      isFollowing = user.followers.includes(req.user.id);
    }
    res.status(200).send({ user: user, isFollowing: isFollowing });
  } catch {
    res.status(404).send({ error: "User doesn't exist!" });
  }
});

router.get("/users", async (req, res, next) => {
  try {
    let name = req.query.name;
    let query = {};
    if (name) query.username = { $regex: `(?i).*${name}.*` };
    console.log("query: ", query);
    const users = await User.find(query);
    console.log("users: ", users);
    var reducedUsers = users.map((user) => {
      const reducedUser = {
        username: user.username,
        _id: user._id,
      };
      return reducedUser;
    });
    console.log("reducedUsers: ", reducedUsers);
    res.status(200).send(reducedUsers);
  } catch {
    res.status(404).send({ error: "No users found!" });
  }
});

// follow user
router.get("/followuser/:user", async (req, res, next) => {
  console.log("GET follow user");
  if (req.session.loggedIn) {
    await follow.followUser(req.user._id, req.params.user);
    res.status(200).send(`${req.user._id} is following ${req.params.user}`);
  } else {
    res.status(401).send("Cannot follow user - not logged in. ");
  }
});

// unfollow user
router.get("/unfollowuser/:user", async (req, res, next) => {
  console.log("GET unfollow user");
  if (req.session.loggedIn) {
    await follow.unfollowUser(req.user._id, req.params.user);
    res.status(200).send(`${req.user._id} unfollowed ${req.params.user}`);
  } else {
    res.status(401).send("Cannot unfollow user - not logged in. ");
  }
});

// follow person
router.get("/followperson/:name", async (req, res, next) => {
  console.log("GET follow name");
  if (req.session.loggedIn) {
    await follow.followPerson(req.user._id, req.params.name);
    res.status(200).send(`${req.user._id} is following ${req.params.name}`);
  } else {
    res.status(401).send("Cannot follow name - not logged in. ");
  }
});

// unfollow person
router.get("/unfollowperson/:name", async (req, res, next) => {
  console.log("GET unfollow name");
  if (req.session.loggedIn) {
    await follow.unfollowPerson(req.user._id, req.params.name);
    res.status(200).send(`${req.user._id} unfollowed ${req.params.name}`);
  } else {
    res.status(401).send("Cannot unfollow user - not logged in. ");
  }
});

// make contributor
router.get("/contributor", async (req, res, next) => {
  console.log("GET contributor");
  if (req.session.loggedIn) {
    req.user.accountType = "Contributor";
    req.user.save();
    console.log(req.user);
    res.status(200).send(`${req.user.username} is a contributor. `);
  } else {
    res.status(401).send("Cannot become contributor - not logged in. ");
  }
});

// make regular
router.get("/regular", async (req, res, next) => {
  console.log("GET regular");
  if (req.session.loggedIn) {
    req.user.accountType = "Regular";
    req.user.save();
    console.log(req.user);
    res.status(200).send(`${req.user.username} is a regular user. `);
  } else {
    res.status(401).send("Cannot become regular - not logged in. ");
  }
});

// add to movies watched
router.get("/addmoviewatched/:movie", async (req, res, next) => {
  console.log("GET add movie watched");
  if (req.session.loggedIn) {
    await User.updateOne(
      { _id: req.user._id },
      { $push: { moviesWatched: req.params.movie } }
    );
    res
      .status(200)
      .send(`${req.user._id} added ${req.params.movies} to movies watched.`);
  } else {
    res.status(401).send("Cannot add to movies watched - not logged in. ");
  }
});

// remove from movies watched
router.get("/removemoviewatched/:movie", async (req, res, next) => {
  console.log("GET remove movie watched");
  if (req.session.loggedIn) {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { moviesWatched: { $in: [req.params.movie] } } }
    );
    res
      .status(200)
      .send(
        `${req.user._id} removed ${req.params.movies} from movies watched.`
      );
  } else {
    res.status(401).send("Cannot remove from movies watched - not logged in. ");
  }
});

module.exports = router;
