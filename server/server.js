const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const socketIo = require("socket.io");
var passportSocketIo = require("passport.socketio");
const http = require("http");
const cors = require("cors");

const passport = require("./passport/setup");
const auth = require("./routes/auth");
const movieroutes = require("./routes/movieroutes");
const peopleroutes = require("./routes/peopleroutes");
const reviewroutes = require("./routes/reviewroutes");
const userroutes = require("./routes/userroutes");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/";

app.use(cors({ origin: true, credentials: true }));

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
    app.use(cookieParser());
    // Express Session
    var mongoStore = new MongoStore({
      mongooseConnection: mongoose.connection,
    });
    app.use(
      session({
        secret: "secret",
        resave: true,
        saveUninitialized: false,
        store: mongoStore,
      })
    );
    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use("/api/auth", auth);
    app.use("/api/movies", movieroutes);
    app.use("/api/users", userroutes);
    app.use("/api/reviews", reviewroutes);
    app.use("/api/people", peopleroutes);
    app.get("/", (req, res) => res.send("Backend is healthy."));

    const server = http.createServer(app);
    const io = socketIo(server);

    io.use(
      passportSocketIo.authorize({
        key: "connect.sid",
        secret: "secret",
        passport: passport,
        store: mongoStore,
        cookieParser: cookieParser,
      })
    );
    io.on("connection", async (socket) => {
      if (socket.request.user && socket.request.user.logged_in) {
        console.log(socket.request.user.username, "is logged in.");
      }

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
    app.io = io;
    server.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));
