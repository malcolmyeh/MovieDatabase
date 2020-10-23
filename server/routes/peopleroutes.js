const express = require("express");
const router = express.Router();
const People = require("../models/People");

router.get("/people/:person", async (req, res, next) => {
  console.log("GET person", req.params.person);
  try {
    const person = await People.findOne({ _id: req.params.person });
    console.log("Person found: ", person.name);
    res.send(person);
  } catch {
    console.log("Person not found!");
    res.status(404);
    res.send({ error: "Person doesn't exist!" });
  }
});

router.get("/people", async (req, res, next) => {
    try {
        let name = req.query.name;
        let query = {};
        if (name)
            query.name = {$regex : `(?i).*${name}.*`};
        const people = await People.find(query);
        console.log("people: ", people);
        var reducedPeople = people.map((person) => {
          const reducedPerson = {
            name: person.name,
            _id: person._id
          };
          return reducedPerson;
        });
        console.log("reducedPeople: ", reducedPeople);
        res.send(reducedPeople);
      } catch {
        res.status(404);
        res.send({ error: "No people found!" });
      }
})

router.post("/people", async(req, res, next) => {
  try {

  } catch {
    
  }
})

module.exports = router;
