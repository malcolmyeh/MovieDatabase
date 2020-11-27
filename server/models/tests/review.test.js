const mongoose = require("mongoose");
const Review = require("../Review");

const reviewData = {
  userId: mongoose.Types.ObjectId("4edd40c86762e0fb12000003"),
  userName: "test-user",
  movieId: mongoose.Types.ObjectId("4edd40c86762e0fb12000004"),
  movieTitle: "test-movie",
  score: 10,
};

describe("Review Model Unit Test", () => {
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

  it("creates and saves review successfully", async () => {
    const validReview = new Review(reviewData);
    const savedReview = await validReview.save();

    expect(savedReview._id).toBeDefined();

    // fields matches json
    expect(savedReview.userId).toBe(reviewData.userId);
    expect(savedReview.userName).toBe(reviewData.userName);
    expect(savedReview.movieId).toBe(reviewData.movieId);
    expect(savedReview.movieTitle).toBe(reviewData.movieTitle);
    expect(savedReview.score).toBe(reviewData.score);

    // defaults
    expect(savedReview.title).toBeDefined();
    expect(savedReview.body).toBeDefined();
    expect(savedReview.date).toBeDefined();
  });

  it("inserts review successfully but ignores fields not defined in schema", async () => {
    var modifiedReviewData = reviewData;
    modifiedReviewData.invalidField = "invalid";
    const validReview = new Review(modifiedReviewData);
    const savedReview = await validReview.save();
    expect(savedReview._id).toBeDefined();
    expect(savedReview.invalidField).toBeUndefined();
  });

  it("does not create review without required fields", async () => {
    const invalidReview = new Review({ userName: "test-user" });
    var err;
    try {
      const savedReview = await invalidReview.save();
      e = savedReview;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
