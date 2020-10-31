const User = require("../models/User");
const People = require("../models/People");

async function followUser(user, userToFollow) {
  await User.updateOne(
    { _id: user },
    { $push: { followingUsers: userToFollow } }
  );
  await User.updateOne({ _id: userToFollow }, { $push: { followers: user } });
  console.log("user", user, "is following user", userToFollow);
}

async function followPerson(user, personToFollow) {
  await User.updateOne(
    { _id: user },
    { $push: { followingPeople: personToFollow } }
  );
  await People.updateOne({ _id: personToFollow }, { $push: { followers: user } });
  console.log("user", user, "is following person", personToFollow);
}

async function unfollowUser(user, userToUnfollow) {
  await User.updateOne(
    { _id: user },
    { $pull: { followingUsers: { $in: [userToUnfollow] } } }
  );
  await User.updateOne(
    { _id: userToUnfollow },
    { $pull: { followers: { $in: [user] } } }
  );
  console.log("user", user, "unfollowed", userToUnfollow);
}

async function unfollowPerson(user, personToUnfollow) {
  await User.updateOne(
    { _id: user },
    { $pull: { followingPeople: { $in: [personToUnfollow] } } }
  );
  await People.updateOne(
    { _id: user },
    { $pull: { followers: { $in: [user] } } }
  );
  console.log("user", user, "unfollowed", personToUnfollow);
}

exports.followUser = followUser;
exports.followPerson = followPerson;
exports.unfollowUser = unfollowUser;
exports.unfollowPerson = unfollowPerson;
