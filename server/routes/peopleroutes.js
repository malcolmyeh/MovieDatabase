const express = require("express");
const router = express.Router();
const People = require("../models/People");
const User = require("../models/User");

router.get("/people/:person", async (req, res, next) => {
  console.log("GET person", req.params.person);

  try {
    const user = await User.findOne({ _id: req.user._id });
    const person = await People.findOne({ _id: req.params.person });
    var isFollowing = false;
    // console.log("user", user);
    if (req.session.loggedIn) {
      isFollowing = user.followingPeople.includes(req.params.person);
    }
    res.status(200).send({ person: person, isFollowing: isFollowing });
  } catch (e) {
    console.log(e);
    console.log("Person not found!");
    res.status(404);
    res.send({ error: "Person doesn't exist!" });
  }
});

router.get("/people", async (req, res, next) => {
  try {
    let name = req.query.name;
    let query = {};
    if (name) query.name = { $regex: `(?i).*${name}.*` };
    const people = await People.find(query);
    // console.log("people: ", people);
    var reducedPeople = people.map((person) => {
      const reducedPerson = {
        name: person.name,
        _id: person._id,
      };
      return reducedPerson;
    });
    // console.log("reducedPeople: ", reducedPeople);
    res.status(200).send(reducedPeople);
  } catch {
    res.status(404);
    res.send({ error: "No people found!" });
  }
});

router.post("/people", async (req, res, next) => {
  console.log("POST people");
  // console.log("req.body.name:", req);
  if (req.session.loggedIn && req.user.accountType == "Contributor") {
    try {
      const exists = await People.exists({ name: req.body.name });
      if (exists) {
        res.status(404).send({ error: `${req.body.name} already exists.` });
      } else {
        const newPerson = new People({
          name: req.body.name,
        });
        await newPerson.save();
        // todo: post success status
        res.send(`${newPerson._id} created.`);
      }
    } catch (e) {
      console.log(e);
      res.status(404).send({ error: "Cannot create person." });
    }
  } else {
    res
      .status(401)
      .send("Cannot create person - must be logged in and contributing user. ");
  }
});

module.exports = router;
