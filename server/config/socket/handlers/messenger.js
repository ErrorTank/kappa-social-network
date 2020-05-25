const {getAllUserActiveRelations} = require("../../../db/db-controllers/messenger-utility");
const {simpleUpdateUser} = require("../../../db/db-controllers/user");


module.exports = (io, socket, context) => {
    console.log(socket.id + " has connected to /messenger namespace");
    socket.on("disconnect", function () {
        if(socket.userID){
            Promise.all([simpleUpdateUser(socket.userID, {active: false, last_active_at: new Date().getTime()}), getAllUserActiveRelations(socket.userID)])
                .then(([_, data]) => {
                    let relationIds = data.map(each => each._id);
                    for(let roomName of relationIds){
                        console.log(`/messenger-user-room/user/${roomName}`)
                        io.to(`/messenger-user-room/user/${roomName}`).emit('change-contact-status', {userID: socket.userID, active: false});
                    }
                    socket.userID = "";

                });
        }
        socket.auth = false;
        console.log(socket.id + " has disconnected from /messenger namespace");


    });
    socket.on("join-own-room", function (data) {
        if(data.userID){
            console.log(`User ${data.userID} join their own room!`)
            socket.userID = data.userID;
            socket.join(`/messenger-user-room/user/${data.userID}`);
        }

    });
    return io;
};