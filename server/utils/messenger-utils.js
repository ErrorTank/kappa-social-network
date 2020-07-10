
const REACTIONS = {
    love: 1,
    laugh: 2,
    wow: 3,
    cry: 4,
    angry: 5,
    thump_up: 6,
    thump_down: 7
}


const REVERSE_REACTIONS = {
    1: "love",
    2: "laugh",
    3: "wow",
    4: "cry",
    5: "angry",
    6: "thump_up",
    7: "thump_down"
};


const getActiveReaction = (userID, reactions) => {
    for(let prop in reactions){
        let users = reactions[prop];
        if(users.find(each => each === userID)){
            return REACTIONS[prop];
        }
    }
    return null;
};

module.exports = {
    getActiveReaction,
    REACTIONS,
    REVERSE_REACTIONS
}