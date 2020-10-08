const mongoose = require("mongoose");
const dbManager = require("../../db");
const appDb = dbManager.getConnections()[0];
const User = require("../../../db/model/user")(appDb);
const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket, context) => {
  socket.on("disconnect", function () {
    socket.auth = false;
  });
  socket.on("join-own-room", function (data) {
    if (data.profileID) {
      console.log("welcome to my room");
      socket.join(`/dating-room/profile/${data.profileID}`);
    }
  });
  return io;
};
