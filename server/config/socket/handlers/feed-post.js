
const mongoose = require("mongoose");
const dbManager = require("../../db");
const appDb = dbManager.getConnections()[0];
const User = require("../../../db/model/user")(appDb);
const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /feed-post namespace");
    socket.on("disconnect", function () {
        socket.auth = false;
        console.log(socket.id + " has disconnected from /eed-post namespace");


    });
    socket.on("join-own-room", function (data) {
        if (data.userID) {
            console.log(`User ${data.userID} join own post room!`)
            socket.join(`/feed-post-room/user/${data.userID}`);
        }

    });
    socket.on("seen-notification", function (data) {
        if (data.notificationID) {

            User.findOneAndUpdate({
                _id: ObjectId(data.userID)
            },  {"$set": {"notifications.$[elem].is_seen": true}}, {
                "arrayFilters": [{"elem._id": ObjectId(data.notificationID)}],
                "multi": true,
                new: true
            }).exec()
        }

    });
    socket.on("join-posts-notification-rooms", function (data) {
        if (data.userID) {
            console.log(`User ${data.userID} join posts notification rooms!`);
            User.findOne({_id: ObjectId(data.userID)})
                .lean()
                .then(user => {
                    let followedPosts = user.followed_posts;
                    for(let p of followedPosts){
                        socket.join(`/notification-post-room/post/${p.post}`);
                    }
                });

        }

    });
    socket.on("join-post-room", function (data) {
        if (data.userID && data.postID) {
            console.log(`User ${data.userID} join post room ${data.postID}!`)
            socket.join(`/post-room/${data.postID}`);
        }

    });
    socket.on("left-post-room", function (data) {
        if (data.userID && data.postID) {
            console.log(`User ${data.userID} left post room ${data.postID}!`)
            socket.leave(`/post-room/${data.postID}`);
        }

    });
    return io;

};