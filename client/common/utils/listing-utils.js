// import isNil from "lodash/isNil"

const checkNumber = (value) => {
  const re = /^[0-9\b]+$/;
  return re.test(value);
};

const cleanBlankProp = (obj) => {
  return Object.keys(obj).reduce(
    (total, propName) =>
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
        ? { ...total }
        : { ...total, [propName]: obj[propName] },
    {}
  );
};

const moneyToNumber = (value) => {
  value = value.replace(' ₫', '');
  return value.split('.').join('');
};
export { checkNumber, cleanBlankProp, moneyToNumber };
