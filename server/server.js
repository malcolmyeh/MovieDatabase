const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const passport = require("./passport/setup");
const auth = require("./routes/auth");
const movieroutes = require("./routes/movieroutes");
const peopleroutes = require("./routes/peopleroutes");
const reviewroutes = require("./routes/reviewroutes");
const userroutes = require("./routes/userroutes");
const cors = require("cors");
const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/";

app.use(cors());

mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`MongoDB connected ${MONGO_URI}`);
    // Bodyparser middleware, extended false does not allow nested payloads
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Express Session
    app.use(
      session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      })
    );

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use("/api/auth", auth);
    app.use("/api", movieroutes);
    app.use("/api", userroutes);
    app.use("/api", reviewroutes);
    app.use("/api", peopleroutes);
    app.get("/", (req, res) => res.send("Backend is healthy."));

    app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));
