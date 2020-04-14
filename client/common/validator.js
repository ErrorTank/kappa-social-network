const isEmail = (val) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val.trim().toLowerCase());
};

const isPhone = val => {
    return /\D/gi.test(val.trim()) === false;
};

export {
    isEmail,
    isPhone
}