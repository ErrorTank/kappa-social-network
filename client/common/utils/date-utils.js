const getDaysInMonth = (month, year) => {
    let date = new Date(year, month - 1, 1);
    let days = [];
    while (date.getMonth() === month - 1) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
    }
    return days;
};

const getAge =(dob)=>{
    var ageDifMs = Date.now() - new Date(dob).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
export {
    getDaysInMonth,
    getAge
}
