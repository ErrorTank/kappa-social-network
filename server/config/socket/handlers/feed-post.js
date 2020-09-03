
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /feed-post namespace");
    socket.on("disconnect", function () {
        socket.auth = false;
        console.log(socket.id + " has disconnected from /eed-post namespace");


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