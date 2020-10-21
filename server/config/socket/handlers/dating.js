const mongoose = require("mongoose");
const dbManager = require("../../db");
const appDb = dbManager.getConnections()[0];
const User = require("../../../db/model/user")(appDb);
const ObjectId = mongoose.Types.ObjectId;
const ChatBox = require("../../../db/model/dating/chatbox")(appDb);
module.exports = (io, socket, context) => {
  socket.on("disconnect", function () {
    socket.auth = false;
  });

  socket.on("join-own-room", function (data, ack) {
    if (data.profileID) {
      console.log("welcome to my room");
      socket.join(`/dating-room/profile/${data.profileID}`);
      if (ack) {
        ack();
      }
    }
  });
  socket.on("join-dating-chatbox", function (data, ack) {
    if (data.chatBoxId) {
      console.log("join");
      socket.join(`/dating-room/chatbox/${data.chatBoxId}`);
    }
  });
  socket.on("out-dating-chatbox", function (data) {
    if (data.chatBoxId) {
      console.log("out");
      socket.leave(`/dating-room/chatbox/${data.chatBoxId}`);
    }
  });
  socket.on("chat-room", function (data) {
    console.log(data);
    let newData = {
      ...data.data,
      _id: new ObjectId(),
      createdAt: Date.now(),
    };
    ChatBox.findOneAndUpdate(
      {
        _id: data.chatBoxId,
      },
      {
        $push: {
          messages: newData,
        },
      },
      {
        new: true,
      }
    )
      .lean()
      .then((data) => {
        io.to(`/dating-room/chatbox/${data._id.toString()}`).emit(
          "coming-message",
          data.messages.find(
            (each) => each._id.toString() === newData._id.toString()
          )
        );
      });
  });
  return io;
};
