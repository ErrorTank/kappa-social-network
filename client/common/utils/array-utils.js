const generateArrayFromRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
};

export {
    generateArrayFromRange
}