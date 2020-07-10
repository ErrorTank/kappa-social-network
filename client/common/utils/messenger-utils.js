import {REACTIONS} from "../../react/common/reactions-widget/reactions-widget";


const getActiveReaction = (userID, reactions) => {
    for(let prop in reactions){
        let users = reactions[prop];
        if(users.find(each => each === userID)){
            return REACTIONS[prop];
        }
    }
    return null;
};

export {
    getActiveReaction
}