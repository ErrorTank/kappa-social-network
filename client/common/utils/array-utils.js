const generateArrayFromRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
};

const mergeArray = (array1, array2, condition) => {
    let results = [...array1];
    return array2.reduce((total, cur) => {
        if(total.find(each => condition(each, cur))){
            return [...total]
        }
        return total.concat(cur)
    }, results)
};

export {
    generateArrayFromRange,
    mergeArray
}