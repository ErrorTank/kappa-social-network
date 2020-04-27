


module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /messenger namespace");
    socket.on("disconnect", function () {
        console.log(socket.id + " has disconnected from /messenger namespace");
    });

    return io;
};