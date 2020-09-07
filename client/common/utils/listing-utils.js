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

// check error, only check needed input now
const handleCheckError = (name, message, value) => {
  const { state, updateValue } = this.props;
  if (!value || (value.includes('&nbsp;') && value.length === 7)) {
    this.setState((prevState) => ({
      error: {
        ...prevState.error,
        [name]: message,
      },
    }));
  } else {
    this.setState((prevState) => ({
      error: {
        ...prevState.error,
        [name]: '',
      },
    }));
  }
};
export { checkNumber, cleanBlankProp, moneyToNumber };
