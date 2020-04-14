const getDaysInMonth = (month, year) => {
    let date = new Date(year, month - 1, 1);
    let days = [];
    while (date.getMonth() === month - 1) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
    }
    return days;
};

export {
    getDaysInMonth
}
