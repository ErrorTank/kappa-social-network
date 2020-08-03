
const transformSecondsToTime = (total) => {

    let hours = Math.floor(total / 3600);
    let last = total - (3600 * hours);
    let minutes = Math.floor(last / 60);
    let seconds = last - (60 * minutes);
    return {
        hours,
        minutes,
        seconds
    }
};

export {
    transformSecondsToTime
}