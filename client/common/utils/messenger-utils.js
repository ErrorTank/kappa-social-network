import {REACTIONS, REVERSE_REACTIONS} from "../../react/common/reactions-widget/reactions-widget";


const getActiveReaction = (userID, reactions) => {
    for(let prop in reactions){
        let users = reactions[prop];
        if(users.find(each => each === userID)){
            return REACTIONS[prop];
        }
    }
    return null;
};

const haveReaction = reactions => {
  return Object.values(reactions).reduce((total, cur) => total.concat(cur), []).length !== 0
};

const transformReactionsObject = reactions => {
    return Object.keys(reactions).reduce((total,cur) => {
        return {...total, [cur]: reactions[cur].length}
    },{})
}

const transformReactionObjectToSortedArray = obj => {
    return Object.keys(obj).reduce((total, cur) => [...total, {key: REACTIONS[cur], count : obj[cur]}], []).sort((a,b) => a.count - b.count)
}

const removeNonReaction = arr => arr.filter(each => each.count)

export {
    getActiveReaction,
    haveReaction,
    transformReactionsObject,
    transformReactionObjectToSortedArray,
    removeNonReaction
}