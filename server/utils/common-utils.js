const crypto = require("crypto");
const get = require("lodash/get");

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


const scorizeArray = (arr, field) => {
    const createScoreItem = (item, score = 0) => ({
       value: item,
       score
    });
    let result = [];
    if(arr.length){
        let score = 0;
        let sortedArr = arr.sort((a,b) => get(a, field) - get(b, field));
        result.push(createScoreItem(sortedArr[0]));
        for(let i = 1; i < sortedArr.length; i++){
            let item = sortedArr[i];
            let lastItem = sortedArr[i-1];
            if(get(item, field) > get(lastItem, field)){
                score++;

            }
            result.push(createScoreItem(item, score))
        }
    }

    return result;
};

const isValidDate = d => d instanceof Date && !isNaN(d);

module.exports = {
    getRandomToken,
    asynchronized,
    binarySearch,
    scorizeArray,
    isValidDate
};