const { MongoError } = require("mongodb");
const mongoose = require("mongoose");
const User = require("../User");

const userData = {
  username: "test-user",
  password: "password",
};

describe("User Model Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          process.exit(1);
        }
      }
    );
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  it("creates and saves user successfully", async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();

    // username/password matches json
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.password).toBe(userData.password);

    // defaults
    expect(savedUser.date).toBeDefined();
    expect(savedUser.moviesWatched).toBeDefined();
    expect(savedUser.reviews).toBeDefined();
    expect(savedUser.followingPeople).toBeDefined();
    expect(savedUser.followingUsers).toBeDefined();
    expect(savedUser.followers).toBeDefined();
  });

  it("inserts user successfully but ignores fields not defined in schema", async () => {
    const validUser = new User({
      username: "test-user-2",
      password: "password",
      invalidField: "invalid",
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.invalidField).toBeUndefined();
  });

  it("does not create user without required fields", async () => {
    const invalidUser = new User({ username: "test-user-2" });
    var err;
    try {
      const savedUser = await invalidUser.save();
      e = savedUser;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });

  it("does not allow creation of multiple users with the same username", async () => {
    const invalidUser = new User(userData);
    var err;
    try {
      const savedUser = await invalidUser.save();
      e = savedUser;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(MongoError);
  });
});
