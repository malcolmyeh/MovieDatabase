const User = require("../models/User");
const People = require("../models/People");

async function followUser(user, userToFollow){
    await User.updateOne({_id: user}, {$push: {followingUsers: userToFollow}});
    await User.updateOne({_id: userToFollow}, {$push: {followers: user}});
    console.log("user", user, "is following user", userToFollow);
}

async function followPerson(user, personToFollow){
    await People.updateOne({_id: user}, {$push: {followingPeople: personToFollow}});
    console.log("user", user, "is following person", personToFollow);
}

exports.followUser = followUser;