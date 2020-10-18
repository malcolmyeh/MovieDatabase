const User = require("../models/User");
const People = require("../models/People");

async function followUser(user, userToFollow){
    await User.update({_id: user}, {$push: {followingUsers: userToFollow}});
    await User.update({_id: userToFollow}, {$push: {followers: user}});
    console.log("followUser::done following");
    return;
}

async function followPerson(user, personToFollow){
    await People.update({_id: user}, {$push: {followingPeople: personToFollow}});
}

exports.followUser = followUser;