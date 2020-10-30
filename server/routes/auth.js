const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/signin", (req, res, next) => {
  if (req.session.loggedin) {
    res.status(200).send("Already logged in.");
    return;
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({ errors: "No user found. " });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({ errors: err });
      }
      req.session.loggedIn = true;
      console.log("req.session: ", req.session);
      console.log("req.user.accountType", req.user.accountType);
      req.session.save();
      return res.status(200).json({ userId: user.id, username: user.username, accountType: req.user.accountType });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  console.log("Logging out", req.user.username, "...");
  if (req.session.loggedIn) {
    req.session.loggedIn = false;
    req.logOut();
    req.session.destroy();
    console.log("Logged out.");
    res.status(200).send("Logged out.");
  } else {
    res.status(200).send("You cannot log out because you aren't logged in.");
  }
});

module.exports = router;
