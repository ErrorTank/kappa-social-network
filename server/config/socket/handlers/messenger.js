const {getAllUserActiveRelations} = require("../../../db/db-controllers/messenger-utility");
const {simpleUpdateUser} = require("../../../db/db-controllers/user");
const {updateSavedMessagesToSent, deleteMessage, updateMessageReaction} = require("../../../db/db-controllers/chat-room");
const mongoose = require("mongoose");
const {MessageState} = require("../../../common/const/message-state")
const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /messenger namespace");
    socket.on("disconnect", function () {
        if(socket.userID){
            Promise.all([simpleUpdateUser(socket.userID, {active: false, last_active_at: new Date().getTime()}), getAllUserActiveRelations(socket.userID)])
                .then(([_, data]) => {
                    let relationIds = data.map(each => each._id);
                    for(let roomName of relationIds){

                        io.to(`/messenger-user-room/user/${roomName}`).emit('change-contact-status', {userID: socket.userID, active: false});
                    }
                    socket.userID = "";

                });
        }
        socket.auth = false;
        console.log(socket.id + " has disconnected from /messenger namespace");


    });
    socket.on("request", function (data) {
        if(data.callType && data.friendID){

            io.to(`/messenger-user-room/user/${data.friendID}`).emit('request', {from: socket.userID, callType: data.callType});
        }

    });
    socket.on("ack-call", function (data) {
        if(data.friendID){

            io.to(`/messenger-user-room/user/${data.friendID}`).emit('ack', {from: socket.userID});
        }

    });
    socket.on("reject", function (data) {
        if(data.friendID){
            io.to(`/messenger-user-room/user/${data.friendID}`).emit('reject', {from: socket.userID});
        }

    });
    socket.on("join-own-room", function (data) {
        if(data.userID){
            console.log(`User ${data.userID} join their own room!`)
            socket.userID = data.userID;
            socket.join(`/messenger-user-room/user/${data.userID}`);
        }

    });
    socket.on("join-chat-room", function (data) {
        if(data.userID && data.chatRoomID){
            console.log(`User ${data.userID} join chat room ${data.chatRoomID}!`)
            socket.join(`/messenger-chat-room/chat-room/${data.chatRoomID}`);
        }

    });
    socket.on("remove-message", function (data) {

        if(data.messageID && data.chatRoomID){

            deleteMessage(data.chatRoomID ,data.messageID)
            socket.broadcast.to(`/messenger-chat-room/chat-room/${data.chatRoomID}`).emit('remove-message', {messageID: data.messageID});
        }

    });

    socket.on("change-message-reaction", function (data) {
        if(data.userID && data.chatRoomID && data.messageID && data.reactionConfig){
            updateMessageReaction(data.chatRoomID, data.userID, data.messageID, data.reactionConfig)
                .then((newMsg) => {


                    io.to(`/messenger-chat-room/chat-room/${data.chatRoomID}`).emit("change-message-reactions", {messageID: newMsg._id, reactions: newMsg.reactions})
                });
        }

    });
    socket.on("left-chat-room", function (data) {
        if(data.userID && data.chatRoomID){
            console.log(`User ${data.userID} left chat room ${data.chatRoomID}!`)
            socket.leave(`/messenger-chat-room/chat-room/${data.chatRoomID}`);
        }

    });
    socket.on("received-message", function (data) {
        if(data.userID && data.chatRoomID && data.messageID){
            console.log(`User ${data.userID} has received message ${data.messageID}!`)
            updateSavedMessagesToSent(data.chatRoomID, [ObjectId(data.messageID)]);
            io.to(`/messenger-chat-room/chat-room/${data.chatRoomID}`).emit('change-message-state', {messageIDs: [ObjectId(data.messageID)], state: MessageState.SENT});
        }

    });
    socket.on("typing-start", function (data) {
        if(data.user && data.chatRoomID){

            socket.broadcast.to(`/messenger-chat-room/chat-room/${data.chatRoomID}`).emit('user-typing', {user: data.user});
        }

    });
    socket.on("typing-done", function (data) {
        if(data.user && data.chatRoomID){

            socket.broadcast.to(`/messenger-chat-room/chat-room/${data.chatRoomID}`).emit('user-typing-done', {user: data.user});
        }

    });
    return io;

};