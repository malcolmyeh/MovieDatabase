const { MongoError } = require("mongodb");
const mongoose = require("mongoose");
const People = require("../People");

const peopleData = {
  name: "test-person",
};

describe("People Model Unit Test", () => {
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
  it("creates and saves person successfully", async () => {
    const validPerson = new People(peopleData);
    const savedPerson = await validPerson.save();

    expect(savedPerson._id).toBeDefined();

    // username/password matches json
    expect(savedPerson.name).toBe(peopleData.name);

    // defaults
    expect(savedPerson.movies).toBeDefined();
    expect(savedPerson.frequentCollaborators).toBeDefined();
    expect(savedPerson.followers).toBeDefined();
  });

  it("inserts person successfully but ignores fields not defined in schema", async () => {
    const validPerson = new People({
      name: "test-person-2",
      invalidField: "invalid",
    });
    const savedPerson = await validPerson.save();
    expect(savedPerson._id).toBeDefined();
    expect(savedPerson.invalidField).toBeUndefined();
  });

  it("does not create person without required fields", async () => {
    const invalidPerson = new People({});
    var err;
    try {
      const savedPerson = await invalidPerson.save();
      e = savedPerson;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("does not allow creation of multiple people with the same username", async () => {
    const invalidPerson = new People(peopleData);
    var err;
    try {
      const savedPerson = await invalidPerson.save();
      e = savedPerson;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(MongoError);
  });
});
