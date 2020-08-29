const checkNumber = (value) => {
  const re = /^[0-9\b]+$/;
  return re.test(value);
};

const cleanBlankProp = (obj) => {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
    ) {
      delete obj[propName];
    }
  }
  // return obj;
};

const moneyToNumber = (value) => {
  value = value.replace(' ₫', '');
  return value.split('.').join('');
};
export { checkNumber, cleanBlankProp, moneyToNumber };
