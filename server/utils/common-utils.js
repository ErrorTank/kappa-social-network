const crypto = require("crypto");

const getRandomToken = l => {
    return crypto.randomBytes(l).toString('hex');
};

const asynchronized = (fn) => {
    return new Promise(fn)
};

function binarySearch(items, value, getValue){
    let startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(getValue(items[middle]) != value && startIndex < stopIndex){

        //adjust search area
        if (value < (getValue(items[middle]))){
            stopIndex = middle - 1;
        } else if (value > getValue(items[middle])){
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }

    //make sure it's the right value
    return (getValue(items[middle]) != value) ? -1 : middle;
}

module.exports = {
    getRandomToken,
    asynchronized,
    binarySearch
};