


module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /messenger namespace");
    socket.on("disconnect", function () {
        console.log(socket.id + " has disconnected from /messenger namespace");
    });
    socket.on("join-own-room", function (data) {
        if(data.userID && data.socketID){
            console.log(`User ${data.userID} with socketID ${data.socketID} join their own room`)
            socket.join(`/messenger-user-room/user/${data.userID}`);
        }

    });
    return io;
};