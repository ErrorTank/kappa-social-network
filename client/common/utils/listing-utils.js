const checkNumber = (value) => {
  const re = /^[0-9\b]+$/;
  return re.test(value);
};

const cleanBlankProp = (Obj) => {
  let newObj = { ...Obj };
  for (var propName in newObj) {
    if (
      newObj[propName] === null ||
      newObj[propName] === undefined ||
      newObj[propName] === ''
    ) {
      delete newObj[propName];
    }
  }
  return newObj;
};

const moneyToNumber = (value) => {
  value = value.replace(' ₫', '');
  return value.split('.').join('');
};
export { checkNumber, cleanBlankProp, moneyToNumber };
