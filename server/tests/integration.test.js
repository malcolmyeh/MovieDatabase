const request = require("supertest");
const server = require("../server");
const User = require("../models/User");
const Movie = require("../models/Movie");
const People = require("../models/People");
const Review = require("../models/Review");
const passport = require("passport");

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// since .save() is tied to instance of each Model, it cannot be mocked

describe("Integration Tests", () => {
  beforeAll(async () => {
    var res = await request(server.app).get("/");
    while (res.statusCode != 200) {
      console.log(res.statusCode);
      await delay();
      res = await request(server.app).get("/");
    }
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("is healthy", async () => {
    const res = await request(server.app).get("/");
    expect(res.statusCode).toEqual(200);
  });
  describe("Authentication Integration", () => {
    const userData = {
      username: "test-user",
      password: "password",
    };
    it("calls passport authenticate", async () => {
      const spy = jest.spyOn(passport, "authenticate").mockImplementation();
      const res = await request(server.app)
        .post("/api/auth/signin")
        .send(userData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("User Integration", () => {
    it("calls mongoose functions", async () => {
      const spy = jest.spyOn(User, "findOne");
      await request(server.app).get("/api/users/test");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Movie Integration", () => {
    it("calls mongoose functions", async () => {
      const spy = jest.spyOn(Movie, "findOne").mockImplementation();
      await request(server.app).get("/api/movies/1");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("People Integration", () => {
    it("calls mongoose functions", async () => {
      const spy = jest.spyOn(People, "findOne").mockImplementation();
      await request(server.app).get("/api/people/1");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Review Integration", () => {
    it("calls mongoose functions", async () => {
      const spy = jest.spyOn(Review, "find").mockImplementation();
      await request(server.app).get("/api/reviews");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
