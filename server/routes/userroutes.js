const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users/:user", async (req, res, next) => {
  try {
    console.log("looking for user: ", req.params.user);
    const user = await User.findOne({ _id: req.params.user });
    console.log("User found: ", user.username);
    res.send(user);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

router.get("/users", async (req, res, next) => {
    try {
        let name = req.query.name;
        let query = {};
        if (name)
            query.username = {$regex : `(?i).*${name}.*`};
        console.log("query: ", query);
        const users = await User.find(query);
        console.log("users: ", users);
        var reducedUsers = users.map((user) => {
          const reducedUser = {
            username: user.username,
            _id: user._id
          };
          return reducedUser;
        });
        console.log("reducedUsers: ", reducedUsers);
        res.send(reducedUsers);
      } catch {
        res.status(404);
        res.send({ error: "No users found!" });
      }
})
module.exports = router;
