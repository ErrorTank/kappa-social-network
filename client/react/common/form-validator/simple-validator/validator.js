const onlyWord = (value) => {
  return {
    result: /\W/gi.test(value) === false,
    msg: (prefix) => prefix + " không được chưa ký tự đặc biệt"
  };
};

const haveChar = (value) => {
  return {
    result: /[a-z]/gi.test(value) === true,
    msg: (prefix) => prefix + " phải có ký tự alphabet"
  };
};

const haveNumber = (value) => {
  return {
    result: /\d/gi.test(value) === true,
    msg: (prefix) => prefix + " phải có ký tự số"
  };
};

const minLength = length => (value) => {
  return {
    result: value.length >= length,
    msg: (prefix) => prefix + " phải dài hơn " + length + " ký tự"
  };
};

const maxLength = length => (value) => {
  return {
    result: value.length <= length,
    msg: (prefix) => prefix + " phải ngắn hơn " + length + " ký tự"
  };
};

const exclude = arr => value => {
  let specialCase = ["/", "\\", "[", "]", "^", "|", "-", "(", ")", ".", "*", "+", "?", "}", "{", "$", "=", "!", ","];
  let regex = arr.reduce((reg, operator)=>{
    return reg + (specialCase.includes(operator) ? ("\\"+operator) : operator) + "|";
  }, "(") + ")";
  let notify = arr.reduce((reg, operator) => {
    return reg + (operator === " " ? "dấu cách" : operator) + " ";
  }, "");

  return {
    result: new RegExp(regex).test(value) === false,
    msg: (prefix) => prefix + " không thể chứa " + notify
  };
};

export {
  onlyWord,
  haveChar,
  haveNumber,
  maxLength,
  minLength,
  exclude
}
